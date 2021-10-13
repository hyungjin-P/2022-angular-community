import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { SettingsComponent } from './settings.component'

import { HomeComponent } from './children/home/home.component'
import { ProfileComponent } from './children/profile/profile.component'
import { AccountComponent } from './children/account/account.component'
import { NotificationComponent } from './children/notification/notification.component'
import { LanguageComponent } from './children/language/language.component'
import { ServiceCenterComponent } from './children/service-center/service-center.component'
import { CompanyComponent } from './children/company/company.component'

const routes: Routes = [
    {
        path: '',
        canActivate: [],
        component: SettingsComponent,
        children: [
            { path: '', component: HomeComponent, pathMatch: 'full' },
            { path: 'profile', component: ProfileComponent },
            { path: 'account', component: AccountComponent },
            { path: 'notification', component: NotificationComponent },
            { path: 'language', component: LanguageComponent },
            { path: 'service-center', component: ServiceCenterComponent },
            { path: 'company', component: CompanyComponent },
        ],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingsRoutingModule {}
