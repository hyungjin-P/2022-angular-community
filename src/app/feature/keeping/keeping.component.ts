import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import * as moment from 'moment-timezone'

import { GlobalService } from '@services/global.service'

@Component({
    selector: 'keeping',
    templateUrl: './keeping.component.html',
    styleUrls: ['./keeping.component.scss'],
})
export class KeepingComponent implements OnInit {
    @ViewChild('bannerElement') bannerElement: ElementRef

    touchScreen: boolean
    banner: boolean

    constructor(private globalService: GlobalService) {
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
}
