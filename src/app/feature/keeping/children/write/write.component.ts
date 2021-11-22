import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'

@Component({
    selector: 'write',
    templateUrl: './write.component.html',
    styleUrls: ['./write.component.scss'],
})
export class WriteComponent implements OnInit {
    title: string
    content: string

    constructor(private location: Location) {}

    ngOnInit() {
        this.title = ''
        this.content = ''
    }

    goBack() {
        this.location.back()
    }
}
