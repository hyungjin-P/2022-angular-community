import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
    selector: 'mobile-header',
    templateUrl: './mobile-header.component.html',
    styleUrls: ['./mobile-header.component.scss'],
})
export class MobileHeaderComponent implements OnInit {
    @Input() text: string
    @Output() goBack = new EventEmitter<any>()

    constructor() {}

    ngOnInit(): void {}

    _goBack() {
        this.goBack.emit({})
    }
}
