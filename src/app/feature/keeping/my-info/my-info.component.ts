import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { StorageService } from '@services/storage.service'

@Component({
    selector: 'my-info',
    templateUrl: './my-info.component.html',
    styleUrls: ['./my-info.component.scss'],
})
export class MyInfoComponent implements OnInit {
    constructor(private router: Router, private storageService: StorageService) {}

    ngOnInit() {}

    async logout() {
        await this.storageService.removeUser()
        this.router.navigateByUrl('/')
    }
}
