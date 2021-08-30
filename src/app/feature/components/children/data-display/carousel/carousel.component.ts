import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core'
import { animationFrameScheduler, defer, fromEvent, Observable, interval, concat, of, merge } from 'rxjs'
import { map, switchMap, takeUntil, take, startWith, tap, withLatestFrom, share, scan, takeWhile } from 'rxjs/operators'

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

        this.size$ = fromEvent(window, 'resize').pipe(
            startWith(0),
            map((event: any) => this.carousel.nativeElement.clientWidth)
        )

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
            }))
        )

        this.drop$ = this.drag$.pipe(
            switchMap((drag) =>
                this.end$.pipe(
                    map((event) => drag),
                    take(1)
                )
            ),
            withLatestFrom(this.size$, (drag: any, size) => {
                return { ...drag, size }
            })
        )

        this.carousel$ = merge(this.drag$, this.drop$).pipe(
            scan(
                (store, { distance, size }) => {
                    const updateStore: any = {
                        from: -(store.index * store.size) + distance,
                    }

                    if (size == undefined) {
                        updateStore.to = updateStore.from
                    } else {
                        const THRESHOLD = 30
                        const PANEL_COUNT = 4
                        let tobeIndex = store.index
                        if (Math.abs(distance) >= THRESHOLD) {
                            tobeIndex =
                                distance >= 0 ? Math.max(tobeIndex - 1, 0) : Math.min(tobeIndex + 1, PANEL_COUNT - 1)
                        }

                        updateStore.index = tobeIndex
                        updateStore.to = -(tobeIndex * size)
                        updateStore.size = size
                    }

                    return {
                        ...store,
                        ...updateStore,
                    }
                },
                {
                    from: 0,
                    to: 0,
                    index: 0,
                    size: 0,
                }
            ),
            switchMap(({ from, to }) => (from == to ? of(to) : this.animation(from, to, DEFAULT_DURATION)))
        )

        this.carousel$.subscribe((pos) => {
            this.translateX(pos)
        })
    }

    toPos(obs$) {
        const SUPPORT_TOUCH = 'ontouchstart' in window
        return obs$.pipe(map((v: any) => (SUPPORT_TOUCH ? v.changedTouches[0].pageX : v.pageX)))
    }

    translateX(posX) {
        this.container.nativeElement.style.transform = `translate3d(${posX}px, 0, 0)`
    }

    animation(from, to, duration) {
        return defer(() => {
            const scheduler = animationFrameScheduler
            const start = scheduler.now()
            const interval$ = interval(0, scheduler).pipe(
                map(() => (scheduler.now() - start) / duration),
                takeWhile((rate) => rate < 1)
            )

            return concat(interval$, of(1)).pipe(map((rate) => from + (to - from) * rate))
        })
    }
}
