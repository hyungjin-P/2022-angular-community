import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
    email: string

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
