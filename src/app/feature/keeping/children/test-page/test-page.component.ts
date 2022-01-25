import { AfterViewInit, Component, OnInit } from '@angular/core'

declare const $

@Component({
    selector: 'app-test-page',
    templateUrl: './test-page.component.html',
    styleUrls: ['./test-page.component.scss'],
})
export class TestPageComponent implements OnInit, AfterViewInit {
    constructor() {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        $('.carousel').carousel({

        })
    }
}
