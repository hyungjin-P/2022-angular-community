import { NgModule } from '@angular/core'

import { RouterModule } from '@angular/router'

import { SharedModule } from '@shared/shared.module'

import { HeaderComponent } from './header/header.component'
import { NavComponent } from './nav/nav.component'
import { BottomNavComponent } from './bottom-nav/bottom-nav.component'
import { PrivacyComponent } from './privacy/privacy.component'
import { ServiceTermsComponent } from './service-terms/service-terms.component'

@NgModule({
    declarations: [HeaderComponent, NavComponent, BottomNavComponent, PrivacyComponent, ServiceTermsComponent],
    imports: [RouterModule, SharedModule],
    exports: [HeaderComponent, NavComponent, BottomNavComponent, PrivacyComponent, ServiceTermsComponent],
    providers: [],
})
export class CommonModule {}
