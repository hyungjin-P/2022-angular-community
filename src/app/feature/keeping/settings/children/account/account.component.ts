import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'

import { StorageService } from '@services/storage.service'

import { User } from '@schemas/user'

@Component({
    selector: 'account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
    user: User

    constructor(private location: Location, private storageService: StorageService) {}

    ngOnInit() {
        this.user = this.storageService.getUser()
    }

    goBack() {
        this.location.back()
    }
}
