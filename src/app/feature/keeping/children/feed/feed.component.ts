import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'feed',
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
    selectedMenu: string

    constructor() {}

    ngOnInit() {
        this.selectedMenu = 'popularity'
    }

    changeMenu(menu: string) {
        this.selectedMenu = menu
    }
}
