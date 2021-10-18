import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'

@Component({
    selector: 'service-center',
    templateUrl: './service-center.component.html',
    styleUrls: ['./service-center.component.scss'],
})
export class ServiceCenterComponent implements OnInit {
    constructor(private location: Location) {}

    ngOnInit() {}

    goBack() {
        this.location.back()
    }
}
