import { Component, OnInit } from '@angular/core'

import { GlobalService } from '@services/global.service'

@Component({
    selector: 'header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    variables: any

    constructor(private globalService: GlobalService) {
        this.variables = this.globalService.variables
    }

    ngOnInit() {}

    changeIndex(url: string) {
        if (this.variables.navMenu.indexOf(url) > -1) {
            this.variables.navMenuIndex = this.variables.navMenu.indexOf(url)
        }
    }
}
