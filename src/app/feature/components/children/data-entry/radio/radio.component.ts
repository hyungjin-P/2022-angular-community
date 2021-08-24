import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'radio',
    templateUrl: './radio.component.html',
    styleUrls: ['./radio.component.scss'],
})
export class RadioComponent implements OnInit {
    radio = true

    constructor() {}

    ngOnInit() {}

    clickRadio() {
        this.radio = !this.radio
    }
}
