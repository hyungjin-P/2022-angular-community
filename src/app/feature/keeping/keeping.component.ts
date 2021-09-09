import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription, fromEvent, interval, scheduled, asapScheduler } from 'rxjs'
import { throttle, map, switchMap, takeUntil, take, share, mergeAll } from 'rxjs/operators'
import * as moment from 'moment-timezone'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

import { User } from '@schemas/user'

@Component({
    selector: 'keeping',
    templateUrl: './keeping.component.html',
    styleUrls: ['./keeping.component.scss'],
})
export class KeepingComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('keeping') keeping: ElementRef
    @ViewChild('bannerElement') bannerElement: ElementRef

    variables: any
    user: User

    scrollSubscription: Subscription
    previousScrollTop: number
    currentScrollTop: number

    isBannerVisible: boolean
    isHeaderVisible: boolean
    isBottomNavVisible: boolean

    carouselSubscription: Subscription

    constructor(private router: Router, private globalService: GlobalService, private storageService: StorageService) {
        this.variables = this.globalService.variables
        this.user = this.storageService.getUser()

        this.previousScrollTop = 0
        this.currentScrollTop = 0

        this.isBannerVisible = true
        this.isHeaderVisible = false
        this.isBottomNavVisible = false
    }

    ngOnInit(): void {
        if (window.hasOwnProperty('ontouchstart')) {
            this.variables.isTouchScreen = true
        }

        this.setBanner()
    }

    ngAfterViewInit() {
        this.setScrollStream()
        this.setCarousel()
    }

    ngOnDestroy() {
        this.scrollSubscription.unsubscribe()
        this.carouselSubscription.unsubscribe()
    }

    setBanner() {
        const bannerClosedAt = localStorage.getItem('bannerClosedAt')
        if (bannerClosedAt) {
            const now = moment().format('YYYY-MM-DD HH:mm:ss')
            const _bannerClosedAt = moment(bannerClosedAt, 'x').format('yyyy-MM-DD HH:mm:ss')
            const diff = moment(now).diff(_bannerClosedAt, 'hours')

            if (diff >= 24) {
                this.isBannerVisible = true
                localStorage.removeItem('bannerClosedAt')
            } else {
                this.isBannerVisible = false
            }
        }

        this.isBannerVisible = false
    }

    closeBannerAllDay() {
        localStorage.setItem('bannerClosedAt', Date.now() + '')
        this.closeBanner()
    }

    closeBanner() {
        this.bannerElement.nativeElement.style.height = '0'
        setTimeout(() => {
            this.isBannerVisible = false
        }, 200)
    }

    scrollTop() {
        this.keeping.nativeElement.scroll({
            top: 0,
            behavior: 'auto',
        })
    }

    setScrollStream() {
        const THRESHOLD = 150

        const scroll$ = fromEvent(this.keeping.nativeElement, 'scroll')
        this.scrollSubscription = scroll$.pipe(throttle((event: any) => interval(100))).subscribe((event) => {
            let scrollTop = event.target.scrollTop
            this.previousScrollTop = this.currentScrollTop
            this.currentScrollTop = scrollTop
            let diff = this.previousScrollTop - this.currentScrollTop

            if (scrollTop < THRESHOLD) {
                this.isHeaderVisible = false
                return
            }

            if (diff < 0) {
                // downward
                this.isHeaderVisible = true
                this.isBottomNavVisible = false
            } else {
                // upward
                this.isHeaderVisible = false

                if (this.variables.isTouchScreen) {
                    this.isBottomNavVisible = true
                }
            }
        })
    }

    setCarousel() {
        const SUPPORT_TOUCH = 'ontouchstart' in window
        const EVENTS = {
            start: SUPPORT_TOUCH ? 'touchstart' : 'mousedown',
            move: SUPPORT_TOUCH ? 'touchmove' : 'mousemove',
            end: SUPPORT_TOUCH ? 'touchend' : 'mouseup',
        }

        let start$ = fromEvent(this.keeping.nativeElement, EVENTS.start).pipe(this.toPos)
        let move$ = fromEvent(this.keeping.nativeElement, EVENTS.move).pipe(this.toPos)
        let end$ = fromEvent(this.keeping.nativeElement, EVENTS.end)

        let drag$ = start$.pipe(
            switchMap((start: any) =>
                move$.pipe(
                    map((move: number) => move - start),
                    takeUntil(end$)
                )
            ),
            share(),
            map((distance) => ({
                distance,
                dropped: false,
            }))
        )

        let drop$ = drag$.pipe(
            switchMap((drag) =>
                end$.pipe(
                    map((event) => drag),
                    take(1)
                )
            ),
            map(({ distance }) => ({
                distance,
                dropped: true,
            }))
        )

        let carousel$ = scheduled([drag$, drop$], asapScheduler).pipe(
            mergeAll(),
            map(({ distance, dropped }) => {
                if (dropped == false) {
                } else {
                    const THRESHOLD = 30
                    if (Math.abs(distance) >= THRESHOLD) {
                        if (distance >= 0) {
                            // Left
                            this.variables.navMenuIndex = this.variables.navMenuIndex - 1
                            if (this.variables.navMenuIndex < 0) {
                                this.variables.navMenuIndex = this.variables.navMenu.length - 1
                            }
                        } else {
                            // Right
                            this.variables.navMenuIndex = this.variables.navMenuIndex + 1
                            if (this.variables.navMenuIndex > this.variables.navMenu.length - 1) {
                                this.variables.navMenuIndex = 0
                            }
                        }
                    }
                }

                return {
                    distance,
                    dropped,
                }
            })
        )

        this.carouselSubscription = carousel$.subscribe((v) => {
            let url = this.router.url
            let path = this.variables.navMenu[this.variables.navMenuIndex]

            if (url != path && this.variables.navMenu.indexOf(url) > -1) {
                this.router.navigateByUrl(path)
            }
        })
    }

    changeIndex(url: string) {
        if (this.variables.navMenu.indexOf(url) > -1) {
            this.variables.navMenuIndex = this.variables.navMenu.indexOf(url)
        }
    }

    toPos(obs$) {
        const SUPPORT_TOUCH = 'ontouchstart' in window
        return obs$.pipe(map((v: any) => (SUPPORT_TOUCH ? v.changedTouches[0].pageX : v.pageX)))
    }

    async logout() {
        this.globalService.variables.isLogin = false
        await this.storageService.removeUser()
        this.router.navigateByUrl('/')
    }
}
