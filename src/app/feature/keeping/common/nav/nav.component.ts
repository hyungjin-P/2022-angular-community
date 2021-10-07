import { Component, OnInit, Output, EventEmitter } from '@angular/core'

import { GlobalService } from '@services/global.service'

@Component({
    selector: 'nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
    @Output() scrollTop = new EventEmitter<any>()

    variables: any

    constructor(private globalService: GlobalService) {
        this.variables = this.globalService.variables
    }

    ngOnInit() {}

    onScrollTop(): void {
        this.scrollTop.emit({})
    }
}
