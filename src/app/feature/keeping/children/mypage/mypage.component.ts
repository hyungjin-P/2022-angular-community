import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

@Component({
    selector: 'mypage',
    templateUrl: './mypage.component.html',
    styleUrls: ['./mypage.component.scss'],
})
export class MypageComponent implements OnInit {
    constructor(private globalService: GlobalService, private router: Router, private storageService: StorageService) {}

    ngOnInit() {}

    async logout() {
        await this.storageService.removeUser()
        this.router.navigateByUrl('/')
    }
}
