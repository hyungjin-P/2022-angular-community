import { NgModule } from '@angular/core'

import { SettingsRoutingModule } from './settings-routing.module'
import { SettingsComponent } from './settings.component'

import { SharedModule } from '@shared/shared.module'

import { CommonModule } from '../common/common.module'

import { HomeComponent } from './children/home/home.component'
import { ProfileComponent } from './children/profile/profile.component'
import { AccountComponent } from './children/account/account.component'
import { NotificationComponent } from './children/notification/notification.component'
import { LanguageComponent } from './children/language/language.component'
import { ServiceCenterComponent } from './children/service-center/service-center.component'
import { CompanyComponent } from './children/company/company.component'

@NgModule({
    declarations: [
        SettingsComponent,
        HomeComponent,
        ProfileComponent,
        AccountComponent,
        NotificationComponent,
        LanguageComponent,
        ServiceCenterComponent,
        CompanyComponent,
    ],
    imports: [SettingsRoutingModule, SharedModule, CommonModule],
    exports: [],
    providers: [],
})
export class SettingsModule {}
