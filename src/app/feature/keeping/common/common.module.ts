import { NgModule } from '@angular/core'

import { RouterModule } from '@angular/router'

import { SharedModule } from '@shared/shared.module'

import { FooterComponent } from './footer/footer.component'
import { HeaderComponent } from './header/header.component'
import { PrivacySnippetComponent } from './privacy-snippet/privacy-snippet.component'
import { ServiceTermsSnippetComponent } from './service-terms-snippet/service-terms-snippet.component'

@NgModule({
    declarations: [FooterComponent, HeaderComponent, PrivacySnippetComponent, ServiceTermsSnippetComponent],
    imports: [RouterModule, SharedModule],
    exports: [FooterComponent, HeaderComponent, PrivacySnippetComponent, ServiceTermsSnippetComponent],
    providers: [],
})
export class CommonModule {}
