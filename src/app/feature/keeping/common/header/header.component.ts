import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

import { User } from '@schemas/user'

@Component({
    selector: 'header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    variables: any
    user: User

    constructor(private router: Router, private globalService: GlobalService, private storageService: StorageService) {}

    ngOnInit() {
        this.variables = this.globalService.variables
        this.user = this.storageService.getUser()

        if (this.user) {
            this.variables.isLogin = true
        }
    }

    openNav() {
        this.variables.isNavOpen = !this.variables.isNavOpen
    }

    async logout() {
        this.globalService.variables.isLogin = false
        await this.storageService.removeUser()
        this.router.navigateByUrl('/')
    }
}
