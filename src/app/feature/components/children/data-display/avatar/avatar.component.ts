import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
    picture = ''

    constructor() {}

    ngOnInit() {}
}
