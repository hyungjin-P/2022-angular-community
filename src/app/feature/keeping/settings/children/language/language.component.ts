import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'language',
    templateUrl: './language.component.html',
    styleUrls: ['./language.component.scss'],
})
export class LanguageComponent implements OnInit {
    selectedLanguage: string

    constructor(private location: Location, private translate: TranslateService) {}

    ngOnInit() {
        this.selectedLanguage = localStorage.getItem('language')
    }

    goBack() {
        this.location.back()
    }

    changeLanguage(language: string) {
        this.selectedLanguage = language
    }

    switchLanguage() {
        this.translate.use(this.selectedLanguage)

        localStorage.setItem('language', this.selectedLanguage)
    }
}
