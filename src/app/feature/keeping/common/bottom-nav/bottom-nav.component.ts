import { Component, OnInit } from '@angular/core'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

import { User } from '@schemas/user'

@Component({
    selector: 'bottom-nav',
    templateUrl: './bottom-nav.component.html',
    styleUrls: ['./bottom-nav.component.scss'],
})
export class BottomNavComponent implements OnInit {
    variables: any
    user: User

    constructor(private globalService: GlobalService, private storageService: StorageService) {}

    ngOnInit() {
        this.variables = this.globalService.variables
        this.user = this.storageService.getUser()
    }
}
