import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'

@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
    constructor(private location: Location) {}

    ngOnInit() {}

    goBack() {
        this.location.back()
    }
}
