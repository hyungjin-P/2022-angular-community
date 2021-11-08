import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    variables: any

    constructor(private router: Router, private globalService: GlobalService, private storageService: StorageService) {
        this.variables = this.globalService.variables
    }

    ngOnInit() {
        if (!this.variables.isTouchScreen) {
            this.router.navigateByUrl('/settings/profile')
        }
    }

    goBack() {
        this.router.navigateByUrl('/')
    }

    async logout() {
        await this.storageService.removeUser()
        this.router.navigateByUrl('/')
    }
}
