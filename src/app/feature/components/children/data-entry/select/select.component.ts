import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'select_',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {
    dropboxItems = [
        {
            name: '옵션 1',
            value: 'option 1',
        },
        {
            name: '옵션 2',
            value: 'option 2',
            disabled: true,
        },
        {
            name: '옵션 3',
            value: 'option 3',
        },
        {
            name: '옵션 4',
            value: 'option 4',
        },
    ]

    selectedDropboxItem = {
        name: '옵션 1',
        value: 'option 1',
    }

    constructor() {}

    ngOnInit() {}
}
