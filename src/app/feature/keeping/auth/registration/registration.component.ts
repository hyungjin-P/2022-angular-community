import { Component, OnInit, ViewChild } from '@angular/core'

@Component({
    selector: 'registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
    @ViewChild('popupPrivacyServiceTermsRef') popupPrivacyServiceTermsRef

    email: string
    password: string
    confirmPassword: string

    checkbox: boolean
    checkbox1: boolean

    isPrivacyOpen: boolean
    isServiceTermsOpen: boolean

    constructor() {}

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

    openContent(name: string) {
        if (name == 'privacy') {
            this.isPrivacyOpen = !this.isPrivacyOpen
            this.isServiceTermsOpen = false
        } else if (name == 'service-terms') {
            this.isPrivacyOpen = false
            this.isServiceTermsOpen = !this.isServiceTermsOpen
        }
    }
}
