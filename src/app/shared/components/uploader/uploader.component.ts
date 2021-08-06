import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'shared-uploader',
    templateUrl: './uploader.component.html',
    styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent implements OnInit {
    isHovering: boolean

    files: File[] = []

    constructor() {}

    ngOnInit() {}

    toogleHover(event: boolean) {
        this.isHovering = event
    }

    onDrop(files: FileList) {
        this.files = []
        for (let i = 0; i < files.length; i++) {
            this.files.push(files.item(i))
        }
    }
}
