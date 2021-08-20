import { Component, OnInit } from '@angular/core'

import { GlobalService } from '@services/global.service'

@Component({
    selector: 'keeping',
    templateUrl: './keeping.component.html',
    styleUrls: ['./keeping.component.scss'],
})
export class KeepingComponent implements OnInit {
    touchScreen: boolean

    constructor(private globalService: GlobalService) {
        this.touchScreen = false
    }

    ngOnInit(): void {
        if (window.hasOwnProperty('ontouchstart')) {
            this.globalService.touchScreen = true
            this.touchScreen = true
        }
    }
}
