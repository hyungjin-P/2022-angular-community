import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
    selector: 'callback',
    templateUrl: './callback.component.html',
    styleUrls: ['./callback.component.scss'],
})
export class CallbackComponent implements OnInit {
    code: string

    constructor(private activatedRoute: ActivatedRoute) {
        this.code = this.activatedRoute.snapshot.queryParams['code']
    }

    ngOnInit(): void {
        if (this.code) {
            window.opener.document.getElementById('code').innerText = this.code
            window.opener.document.getElementById('code').dispatchEvent(new Event('click'))
        }
    }
}
