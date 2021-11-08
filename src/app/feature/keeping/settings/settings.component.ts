import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
    variables: any

    constructor(private router: Router, private globalService: GlobalService, private storageService: StorageService) {
        this.variables = this.globalService.variables
    }

    ngOnInit() {
        this.closeDrawer()
    }

    closeDrawer() {
        this.variables.isDrawerOpen = false
    }

    async logout() {
        await this.storageService.removeUser()
        this.router.navigateByUrl('/')
    }
}
