import { Component, OnInit } from '@angular/core'

import { GlobalService } from '@services/global.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    variables: any

    constructor(private globalService: GlobalService) {
        this.variables = this.globalService.variables
    }

    ngOnInit(): void {
        if (window.hasOwnProperty('ontouchstart')) {
            this.variables.isTouchScreen = true
        }
    }
}
