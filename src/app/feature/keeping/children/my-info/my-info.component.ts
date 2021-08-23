import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

@Component({
    selector: 'my-info',
    templateUrl: './my-info.component.html',
    styleUrls: ['./my-info.component.scss'],
})
export class MyInfoComponent implements OnInit {
    constructor(private globalService: GlobalService, private router: Router, private storageService: StorageService) {}

    ngOnInit() {}

    async logout() {
        this.globalService.login.valid = false
        await this.storageService.removeUser()
        this.router.navigateByUrl('/')
    }
}
