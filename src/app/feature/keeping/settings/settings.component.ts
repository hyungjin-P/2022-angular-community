import { Component, OnInit } from '@angular/core'

import { GlobalService } from '@services/global.service'

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
    variables: any

    constructor(private globalService: GlobalService) {
        this.variables = this.globalService.variables
    }

    ngOnInit() {
        this.closeDrawer()
    }

    closeDrawer() {
        this.variables.isDrawerOpen = false
    }
}
