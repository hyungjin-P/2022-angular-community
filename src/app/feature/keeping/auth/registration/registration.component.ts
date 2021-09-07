import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
    email: string
    password: string
    confirmPassword: string
    checkbox: boolean

    constructor() {}

    ngOnInit() {}

    clickCheckbox() {
        this.checkbox = !this.checkbox
    }
}
