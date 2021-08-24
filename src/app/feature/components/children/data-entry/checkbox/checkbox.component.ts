import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent implements OnInit {
    checkbox = true

    constructor() {}

    ngOnInit() {}

    clickCheckbox() {
        this.checkbox = !this.checkbox
    }
}
