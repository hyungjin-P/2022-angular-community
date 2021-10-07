import { NgModule } from '@angular/core'

import { RouterModule } from '@angular/router'

import { SharedModule } from '@shared/shared.module'

import { HeaderComponent } from './header/header.component'
import { BottomNavComponent } from './bottom-nav/bottom-nav.component'
import { PrivacyFragmentComponent } from './privacy-fragment/privacy-fragment.component'
import { ServiceTermsFragmentComponent } from './service-terms-fragment/service-terms-fragment.component'

@NgModule({
    declarations: [HeaderComponent, BottomNavComponent, PrivacyFragmentComponent, ServiceTermsFragmentComponent],
    imports: [RouterModule, SharedModule],
    exports: [HeaderComponent, BottomNavComponent, PrivacyFragmentComponent, ServiceTermsFragmentComponent],
    providers: [],
})
export class CommonModule {}
