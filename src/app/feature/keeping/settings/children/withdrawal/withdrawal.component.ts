import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'

@Component({
    selector: 'withdrawal',
    templateUrl: './withdrawal.component.html',
    styleUrls: ['./withdrawal.component.scss'],
})
export class WithdrawalComponent implements OnInit {
    constructor(private location: Location) {}

    ngOnInit() {}

    goBack() {
        this.location.back()
    }
}
