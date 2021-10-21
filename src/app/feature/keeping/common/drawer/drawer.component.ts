import { Component, OnInit, Output, EventEmitter } from '@angular/core'

import { GlobalService } from '@services/global.service'

@Component({
    selector: 'drawer',
    templateUrl: './drawer.component.html',
    styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements OnInit {
    @Output() scrollTop = new EventEmitter<any>()

    variables: any

    constructor(private globalService: GlobalService) {
        this.variables = this.globalService.variables
    }

    ngOnInit() {}

    closeDrawer() {
        this.variables.isDrawerOpen = false
    }

    onScrollTop(): void {
        this.scrollTop.emit({})
    }

    openMenuMoreBox() {
        this.variables.menuMoreBoxVisible = !this.variables.menuMoreBoxVisible
    }
}
