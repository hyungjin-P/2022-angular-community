import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import * as moment from 'moment-timezone'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

import { User } from '@schemas/user'

@Component({
    selector: 'keeping',
    templateUrl: './keeping.component.html',
    styleUrls: ['./keeping.component.scss'],
})
export class KeepingComponent implements OnInit {
    @ViewChild('keeping') keeping: ElementRef
    @ViewChild('bannerElement') bannerElement: ElementRef

    scrollPosition: number
    touchScreen: boolean
    banner: boolean

    login: any
    user: User

    constructor(private router: Router, private globalService: GlobalService, private storageService: StorageService) {
        this.touchScreen = false
        this.banner = true
    }

    ngOnInit(): void {
        if (window.hasOwnProperty('ontouchstart')) {
            this.globalService.touchScreen = true
            this.touchScreen = true
        }

        const bannerClosedAt = localStorage.getItem('bannerClosedAt')
        if (bannerClosedAt) {
            const now = moment().format('YYYY-MM-DD HH:mm:ss')
            const _bannerClosedAt = moment(bannerClosedAt, 'x').format('yyyy-MM-DD HH:mm:ss')
            const diff = moment(now).diff(_bannerClosedAt, 'hours')

            if (diff >= 24) {
                this.banner = true
                localStorage.removeItem('bannerClosedAt')
            } else {
                this.banner = false
            }
        }

        this.login = this.globalService.login
        this.user = this.storageService.getUser()
    }

    closeBannerAllDay() {
        localStorage.setItem('bannerClosedAt', Date.now() + '')
        this.closeBanner()
    }

    closeBanner() {
        this.bannerElement.nativeElement.style.height = '0'
        setTimeout(() => {
            this.banner = false
        }, 200)
    }

    async logout() {
        await this.storageService.removeUser()
        this.router.navigateByUrl('/')
    }

    scrollTop() {
        this.keeping.nativeElement.scroll({
            top: 0,
            behavior: 'auto',
        })
    }

    scroll(event) {
        this.scrollPosition = event.target.scrollTop
    }
}
