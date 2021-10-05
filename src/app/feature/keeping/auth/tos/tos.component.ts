import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

import { UserService } from '@services/user.service'

import { User } from '@schemas/user'

@Component({
    selector: 'tos',
    templateUrl: './tos.component.html',
    styleUrls: ['./tos.component.scss'],
})
export class TosComponent implements OnInit {
    TAG = '서비스 이용약관'

    @ViewChild('popupPrivacyServiceTermsRef') popupPrivacyServiceTermsRef

    user: User

    selectedMenu: string

    agreementAll: boolean
    agreementAge: boolean
    agreementPrivacy: boolean
    agreementServiceTerms: boolean
    agreementMarketing: boolean

    constructor(
        private router: Router,
        private globalService: GlobalService,
        private storageService: StorageService,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.user = this.storageService.getUser()

        this.selectedMenu = 'service-terms' // service-terms, privacy

        this.agreementAll = false
        this.agreementAge = false
        this.agreementPrivacy = false
        this.agreementServiceTerms = false
        this.agreementMarketing = false
    }

    updateUser() {
        if (!this.agreementAge || !this.agreementPrivacy || !this.agreementServiceTerms) {
            return
        }

        this.userService
            .updateUser(this.user.id, {
                agreement_age: this.agreementAge,
                agreement_privacy: this.agreementPrivacy,
                agreement_service_terms: this.agreementServiceTerms,
                agreement_marketing: this.agreementMarketing,
            })
            .subscribe(
                (v) => {
                    this.user = {
                        ...this.user,
                        agreement_age: this.agreementAge,
                        agreement_privacy: this.agreementPrivacy,
                        agreement_service_terms: this.agreementServiceTerms,
                        agreement_marketing: this.agreementMarketing,
                    }
                    this.storageService.setUser(this.user)

                    this.router.navigateByUrl('/')
                },
                (e) => {
                    this.globalService.showToast(e.message)
                }
            )
    }

    checkTerms(item: string) {
        if (item == 'all') {
            if (this.agreementAll) {
                this.agreementAll = false
                this.agreementAge = false
                this.agreementPrivacy = false
                this.agreementServiceTerms = false
                this.agreementMarketing = false
            } else {
                this.agreementAll = true
                this.agreementAge = true
                this.agreementPrivacy = true
                this.agreementServiceTerms = true
                this.agreementMarketing = true
            }
        } else if (item == 'age') {
            this.agreementAge = !this.agreementAge
        } else if (item == 'privacy') {
            this.agreementPrivacy = !this.agreementPrivacy
        } else if (item == 'serviceTerms') {
            this.agreementServiceTerms = !this.agreementServiceTerms
        } else if (item == 'marketing') {
            this.agreementMarketing = !this.agreementMarketing
        }

        if (this.agreementAge && this.agreementPrivacy && this.agreementServiceTerms && this.agreementMarketing) {
            this.agreementAll = true
        } else {
            this.agreementAll = false
        }
    }

    showPopup(menu: string) {
        this.changeMenu(menu)
        this.popupPrivacyServiceTermsRef.nativeElement.style.visibility = 'visible'
    }

    hidePopup() {
        this.popupPrivacyServiceTermsRef.nativeElement.style.visibility = 'hidden'
    }

    changeMenu(menu: string) {
        this.selectedMenu = menu
    }
}
