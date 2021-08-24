import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'switch',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss'],
})
export class SwitchComponent implements OnInit {
    switch1 = true
    switch2 = true
    switch3 = false

    constructor() {}

    ngOnInit() {}
}
