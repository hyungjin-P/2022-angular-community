import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
    password: string
    confirmPassword: string
    checkbox: boolean
    checkbox1: boolean

    constructor() {}

    ngOnInit() {}

    clickCheckbox() {
        this.checkbox = !this.checkbox
    }

    clickCheckbox1() {
        this.checkbox1 = !this.checkbox1
    }
}
