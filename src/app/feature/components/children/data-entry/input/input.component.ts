import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'input_',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
    text

    constructor() {}

    ngOnInit() {
        // this.text = 'hello'
    }

    showText() {
        console.log(this.text)
    }
}
