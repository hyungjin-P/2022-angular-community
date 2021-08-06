import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { StorageService } from '@services/storage.service'

@Component({
    selector: 'keeping-home',
    templateUrl: './keeping-home.component.html',
    styleUrls: ['./keeping-home.component.scss'],
})
export class KeepingHomeComponent implements OnInit {
    constructor(private router: Router, private storageService: StorageService) {}

    ngOnInit(): void {}

    async logout() {
        await this.storageService.removeUser()
        this.router.navigateByUrl('/auth/login')
    }
}
