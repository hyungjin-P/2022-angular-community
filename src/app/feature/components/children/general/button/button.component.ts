import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'button_',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
    buttonDisabled

    constructor() {}

    ngOnInit() {}

    toggleButtonDisabled() {
        this.buttonDisabled = !this.buttonDisabled
    }
}
