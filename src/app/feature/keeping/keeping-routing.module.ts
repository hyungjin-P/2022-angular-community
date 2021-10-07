import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthGuard } from '@services/guards/auth.guard'
import { ServiceTermsGuard } from '@services/guards/service-terms.guard'

import { KeepingComponent } from './keeping.component'

import { HomeComponent } from './children/home/home.component'
import { FeedComponent } from './children/feed/feed.component'
import { WriteComponent } from './children/write/write.component'
import { CommunityComponent } from './children/community/community.component'

import { MypageComponent } from './children/mypage/mypage.component'
import { PrivacyComponent } from './children/privacy/privacy.component'
import { ServiceTermsComponent } from './children/service-terms/service-terms.component'

import { SearchComponent } from './search/search.component'
import { NotificationComponent } from './children/notification/notification.component'

const routes: Routes = [
    {
        path: '',
        canActivate: [ServiceTermsGuard],
        component: KeepingComponent,
        children: [
            { path: '', component: HomeComponent, pathMatch: 'full' },
            { path: 'feed', component: FeedComponent },
            { path: 'write', component: WriteComponent },
            { path: 'community', component: CommunityComponent },

            { path: 'mypage', component: MypageComponent },
            { path: 'privacy', component: PrivacyComponent },
            { path: 'service-terms', component: ServiceTermsComponent },

            { path: 'notification', component: NotificationComponent },
        ],
    },

    { path: 'search', canActivate: [ServiceTermsGuard], component: SearchComponent },

    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class KeepingRoutingModule {}
