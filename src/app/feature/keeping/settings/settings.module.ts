import { NgModule } from '@angular/core'

import { SettingsRoutingModule } from './settings-routing.module'
import { SettingsComponent } from './settings.component'

import { SharedModule } from '@shared/shared.module'

import { CommonModule } from '../common/common.module'

import { HomeComponent } from './children/home/home.component'
import { ProfileComponent } from './children/profile/profile.component'
import { AccountComponent } from './children/account/account.component'
import { ChangePasswordComponent } from './children/change-password/change-password.component'
import { WithdrawalComponent } from './children/withdrawal/withdrawal.component'
import { LanguageComponent } from './children/language/language.component'

@NgModule({
    declarations: [
        SettingsComponent,
        HomeComponent,
        ProfileComponent,
        AccountComponent,
        ChangePasswordComponent,
        WithdrawalComponent,
        LanguageComponent,
    ],
    imports: [SettingsRoutingModule, SharedModule, CommonModule],
    exports: [],
    providers: [],
})
export class SettingsModule {}
