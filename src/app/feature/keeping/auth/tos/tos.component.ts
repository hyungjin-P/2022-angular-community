import { Component, OnInit, ViewChild } from '@angular/core'

@Component({
    selector: 'tos',
    templateUrl: './tos.component.html',
    styleUrls: ['./tos.component.scss'],
})
export class TosComponent implements OnInit {
    @ViewChild('popupPrivacyServiceTermsRef') popupPrivacyServiceTermsRef

    selectedMenu: string

    checkbox: boolean
    checkbox1: boolean

    constructor() {
        this.selectedMenu = 'service-terms' // service-terms, privacy
    }

    ngOnInit() {}

    clickCheckbox() {
        this.checkbox = !this.checkbox
    }

    clickCheckbox1() {
        this.checkbox1 = !this.checkbox1
    }

    showPopup(popupName: string) {
        if (popupName == 'popup-privacy-service-terms') {
            this.popupPrivacyServiceTermsRef.nativeElement.style.visibility = 'visible'
        }
    }

    hidePopup(popupName: string) {
        if (popupName == 'popup-privacy-service-terms') {
            this.popupPrivacyServiceTermsRef.nativeElement.style.visibility = 'hidden'
        }
    }

    changeMenu(menu: string) {
        this.selectedMenu = menu
    }
}
