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
    isDrawerMenu: boolean

    variables: any
    globalUser: any
    user: User

    userBoxVisible: boolean

    constructor(private router: Router, private globalService: GlobalService, private storageService: StorageService) {}

    ngOnInit() {
        this.url = this.router.url
        this.isDrawerMenu = this.url.indexOf('/settings') != -1 || this.url.indexOf('/mypage') != -1

        this.variables = this.globalService.variables
        this.globalUser = this.globalService.user
        this.user = this.storageService.getUser()

        this.userBoxVisible = false
    }

    openNav() {
        this.variables.isNavOpen = !this.variables.isNavOpen
    }

    openDrawer() {
        this.variables.isDrawerOpen = true
    }

    openUserBox(event) {
        event.stopPropagation()

        if (this.userBoxVisible) {
            this.closeUserBox()
        } else {
            this.userBoxVisible = true
        }
    }

    closeUserBox() {
        this.userBoxVisible = false
    }

    async logout() {
        await this.storageService.removeUser()
        this.router.navigateByUrl('/')
    }
}
