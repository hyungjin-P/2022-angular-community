import { Component, OnInit, Output, EventEmitter } from '@angular/core'

@Component({
    selector: 'footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
    @Output() scrollTop = new EventEmitter<any>()

    constructor() {}

    ngOnInit() {}

    onScrollTop(): void {
        this.scrollTop.emit({})
    }
}
