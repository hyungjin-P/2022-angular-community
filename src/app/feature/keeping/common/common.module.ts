import { NgModule } from '@angular/core'

import { RouterModule } from '@angular/router'

import { SharedModule } from '@shared/shared.module'

import { FooterComponent } from './footer/footer.component'
import { HeaderComponent } from './header/header.component'
import { PrivacyFragmentComponent } from './privacy-fragment/privacy-fragment.component'
import { ServiceTermsFragmentComponent } from './service-terms-fragment/service-terms-fragment.component'

@NgModule({
    declarations: [FooterComponent, HeaderComponent, PrivacyFragmentComponent, ServiceTermsFragmentComponent],
    imports: [RouterModule, SharedModule],
    exports: [FooterComponent, HeaderComponent, PrivacyFragmentComponent, ServiceTermsFragmentComponent],
    providers: [],
})
export class CommonModule {}
