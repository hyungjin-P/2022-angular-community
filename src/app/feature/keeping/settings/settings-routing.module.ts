import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'

import {SettingsComponent} from './settings.component'

import {HomeComponent} from './children/home/home.component'
import {ProfileComponent} from './children/profile/profile.component'
import {AccountComponent} from './children/account/account.component'
import {ChangePasswordComponent} from './children/change-password/change-password.component'
import {WithdrawalComponent} from './children/withdrawal/withdrawal.component'
import {LanguageComponent} from './children/language/language.component'

const routes: Routes = [
  {
    path: '',
    canActivate: [],
    component: SettingsComponent,
    children: [
      {path: '', component: HomeComponent, pathMatch: 'full'},
      {path: 'profile', component: ProfileComponent},
      {path: 'account', component: AccountComponent},
      {path: 'change-password', component: ChangePasswordComponent},
      {path: 'withdrawal', component: WithdrawalComponent},
      {path: 'language', component: LanguageComponent},
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {
}
