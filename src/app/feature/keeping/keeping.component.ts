import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription, fromEvent, interval } from 'rxjs'
import { throttle } from 'rxjs/operators'
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

    login: any
    user: User

    touchScreen: boolean
    scroll$: Subscription
    previousScrollTop: number
    currentScrollTop: number

    isBannerVisible: boolean
    isHeaderVisible: boolean
    isBottomNavVisible: boolean

    constructor(private router: Router, private globalService: GlobalService, private storageService: StorageService) {
        this.touchScreen = false
        this.previousScrollTop = 0
        this.currentScrollTop = 0

        this.isBannerVisible = true
        this.isHeaderVisible = false
        this.isBottomNavVisible = false
    }

    ngOnInit(): void {
        this.setUser()
        this.checkTouchscreen()
        this.setBanner()
    }

    ngAfterViewInit() {
        this.setScrollStream()
    }

    ngOnDestroy() {
        this.scroll$.unsubscribe()
    }

    setUser() {
        this.login = this.globalService.login
        this.user = this.storageService.getUser()
    }

    checkTouchscreen() {
        if (window.hasOwnProperty('ontouchstart')) {
            this.globalService.touchScreen = true
            this.touchScreen = true
        }
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
        const THRESHOLD = 200

        const scroll$ = fromEvent(this.keeping.nativeElement, 'scroll')
        this.scroll$ = scroll$.pipe(throttle((event: any) => interval(100))).subscribe((event) => {
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

                if (this.touchScreen) {
                    this.isBottomNavVisible = true
                }
            }
        })
    }

    async logout() {
        await this.storageService.removeUser()
        this.router.navigateByUrl('/')
    }
}
