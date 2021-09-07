import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'tos',
    templateUrl: './tos.component.html',
    styleUrls: ['./tos.component.scss'],
})
export class TosComponent implements OnInit {
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
