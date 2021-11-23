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
    pictureBoxVisible: boolean

    constructor(private location: Location) {}

    ngOnInit() {
        this.title = ''
        this.content = ''
        this.pictureBoxVisible = false
    }

    goBack() {
        this.location.back()
    }

    showPictureBox() {
        this.pictureBoxVisible = !this.pictureBoxVisible
    }
}
