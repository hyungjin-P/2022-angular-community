import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'datepicker',
    templateUrl: './datepicker.component.html',
    styleUrls: ['./datepicker.component.scss'],
})
export class DatePickerComponent implements OnInit {
    data1: any = {
        date: '2021-03-10',
    }
    data2: any = {
        startDate: '2021-03-14',
        endDate: '2021-03-20',
    }
    data3 = []

    constructor() {}

    ngOnInit() {}
}
