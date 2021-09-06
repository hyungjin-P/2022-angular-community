import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core'
import {
    animationFrameScheduler,
    defer,
    fromEvent,
    Observable,
    interval,
    concat,
    of,
    scheduled,
    queueScheduler,
    asapScheduler,
    asyncScheduler,
} from 'rxjs'
import {
    map,
    switchMap,
    takeUntil,
    take,
    startWith,
    tap,
    withLatestFrom,
    share,
    scan,
    takeWhile,
    mergeAll,
} from 'rxjs/operators'

@Component({
    selector: 'carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit, AfterViewInit {
    @ViewChild('carousel')
    carousel

    @ViewChild('container')
    container

    size$

    start$
    move$
    end$

    drag$
    drop$

    carousel$
    store

    constructor() {}

    ngOnInit() {}

    ngAfterViewInit() {
        const SUPPORT_TOUCH = 'ontouchstart' in window
        const EVENTS = {
            start: SUPPORT_TOUCH ? 'touchstart' : 'mousedown',
            move: SUPPORT_TOUCH ? 'touchmove' : 'mousemove',
            end: SUPPORT_TOUCH ? 'touchend' : 'mouseup',
        }
        const DEFAULT_DURATION = 300

        let clientWith = this.carousel.nativeElement.clientWidth
        this.store = {
            from: -clientWith,
            to: -clientWith,
            index: 1,
            size: clientWith,
        }
        this.translateX(this.store.to)

        this.size$ = fromEvent(window, 'resize').pipe(
            startWith(0),
            map((event: any) => this.carousel.nativeElement.clientWidth),
            tap((clientWith) => {
                this.store.from = -(this.store.index * clientWith)
                this.store.to = -(this.store.index * clientWith)
                this.store.size = clientWith

                this.translateX(this.store.to)
            })
        )
        this.size$.subscribe()

        this.start$ = fromEvent(this.carousel.nativeElement, EVENTS.start).pipe(this.toPos)
        this.move$ = fromEvent(this.carousel.nativeElement, EVENTS.move).pipe(this.toPos)
        this.end$ = fromEvent(this.carousel.nativeElement, EVENTS.end)

        this.drag$ = this.start$.pipe(
            switchMap((start: any) =>
                this.move$.pipe(
                    map((move: number) => move - start),
                    takeUntil(this.end$)
                )
            ),
            share(),
            map((distance) => ({
                distance,
                dropped: false,
            }))
        )

        this.drop$ = this.drag$.pipe(
            switchMap((drag) =>
                this.end$.pipe(
                    map((event) => drag),
                    take(1)
                )
            ),
            map(({ distance }) => ({
                distance,
                dropped: true,
            }))
        )

        this.carousel$ = scheduled([this.drag$, this.drop$], asapScheduler).pipe(
            mergeAll(),
            map(({ distance, dropped }) => {
                const updateStore: any = {
                    from: -(this.store.index * this.store.size) + distance,
                }

                if (dropped == false) {
                    updateStore.to = updateStore.from
                } else {
                    const THRESHOLD = 30
                    const PANEL_COUNT = 6
                    let tobeIndex = this.store.index
                    if (Math.abs(distance) >= THRESHOLD) {
                        tobeIndex =
                            distance >= 0 ? Math.max(tobeIndex - 1, 0) : Math.min(tobeIndex + 1, PANEL_COUNT - 1)
                    }

                    updateStore.index = tobeIndex
                    updateStore.to = -(tobeIndex * this.store.size)
                    updateStore.size = this.store.size
                }

                this.store = {
                    ...this.store,
                    ...updateStore,
                }

                return this.store
            }),
            switchMap((store) => (store.from == store.to ? of(store) : this.animation(store, DEFAULT_DURATION)))
        )

        this.carousel$.subscribe((store) => {
            const PANEL_COUNT = 6

            this.translateX(store.to)

            if (Math.abs(store.to) == store.index * store.size) {
                if (store.index == 0) {
                    this.store = {
                        from: -((PANEL_COUNT - 2) * store.size),
                        to: -((PANEL_COUNT - 2) * store.size),
                        index: PANEL_COUNT - 2,
                        size: store.size,
                    }

                    this.translateX(this.store.to)
                } else if (store.index == PANEL_COUNT - 1) {
                    this.store = {
                        from: -store.size,
                        to: -store.size,
                        index: 1,
                        size: store.size,
                    }

                    this.translateX(this.store.to)
                }
            }
        })
    }

    toPos(obs$) {
        const SUPPORT_TOUCH = 'ontouchstart' in window
        return obs$.pipe(map((v: any) => (SUPPORT_TOUCH ? v.changedTouches[0].pageX : v.pageX)))
    }

    translateX(posX) {
        this.container.nativeElement.style.transform = `translate3d(${posX}px, 0, 0)`
    }

    animation(store, duration) {
        return defer(() => {
            const scheduler = animationFrameScheduler
            const start = scheduler.now()
            const interval$ = interval(0, scheduler).pipe(
                map(() => (scheduler.now() - start) / duration),
                takeWhile((rate) => rate < 1)
            )

            return concat(interval$, of(1)).pipe(
                map((rate) => {
                    return {
                        ...store,
                        to: store.from + (store.to - store.from) * rate,
                    }
                })
            )
        })
    }
}
