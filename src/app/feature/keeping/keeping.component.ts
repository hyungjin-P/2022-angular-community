import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core'
import { Subscription, fromEvent, interval } from 'rxjs'
import { throttle } from 'rxjs/operators'

import { GlobalService } from '@services/global.service'

@Component({
    selector: 'keeping',
    templateUrl: './keeping.component.html',
    styleUrls: ['./keeping.component.scss'],
})
export class KeepingComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('keeping') keeping: ElementRef

    variables: any

    scrollSubscription: Subscription
    previousScrollTop: number
    currentScrollTop: number
    isHeaderVisible: boolean
    isBottomNavVisible: boolean

    constructor(private globalService: GlobalService) {}

    ngOnInit(): void {
        this.variables = this.globalService.variables

        this.previousScrollTop = 0
        this.currentScrollTop = 0
        this.isHeaderVisible = false
        this.isBottomNavVisible = false
    }

    ngAfterViewInit() {
        this.setScrollEvent()
    }

    ngOnDestroy() {
        this.scrollSubscription.unsubscribe()
    }

    scrollTop() {
        this.keeping.nativeElement.scroll({
            top: 0,
            behavior: 'auto',
        })
    }

    setScrollEvent() {
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
}
