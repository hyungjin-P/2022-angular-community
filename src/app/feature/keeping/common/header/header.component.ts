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
    url: string

    variables: any
    user: User

    userMenuVisible: boolean

    constructor(private router: Router, private globalService: GlobalService, private storageService: StorageService) {}

    ngOnInit() {
        this.url = this.router.url

        this.variables = this.globalService.variables
        this.user = this.storageService.getUser()

        if (this.user) {
            this.variables.isLogin = true
        }

        this.userMenuVisible = false
    }

    openNav() {
        this.variables.isNavOpen = !this.variables.isNavOpen
    }

    openDrawer() {
        this.variables.isDrawerOpen = true
    }

    openUserMenu(event) {
        event.stopPropagation()

        if (this.userMenuVisible) {
            this.closeUserMenu()
        } else {
            this.userMenuVisible = true
        }
    }

    closeUserMenu() {
        this.userMenuVisible = false
    }

    async logout() {
        this.globalService.variables.isLogin = false
        await this.storageService.removeUser()
        this.router.navigateByUrl('/')
    }
}
