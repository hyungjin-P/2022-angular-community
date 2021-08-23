import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthGuard } from '@services/guards/auth.guard'

import { KeepingComponent } from './keeping.component'

import { HomeComponent } from './children/home/home.component'
import { FeedComponent } from './children/feed/feed.component'
import { CommunityComponent } from './children/community/community.component'
import { MarketComponent } from './children/market/market.component'
import { MagazineComponent } from './children/magazine/magazine.component'

import { NotificationComponent } from './children/notification/notification.component'
import { WriteComponent } from './children/write/write.component'
import { ScrapComponent } from './children/scrap/scrap.component'

import { PrivacyComponent } from './children/privacy/privacy.component'
import { ServiceTermsComponent } from './children/service-terms/service-terms.component'

import { SearchComponent } from './search/search.component'
import { MyInfoComponent } from './my-info/my-info.component'

const routes: Routes = [
    {
        path: '',
        component: KeepingComponent,
        children: [
            { path: '', component: HomeComponent, pathMatch: 'full' },
            { path: 'feed', component: FeedComponent },
            { path: 'community', component: CommunityComponent },
            { path: 'market', component: MarketComponent },
            { path: 'magazine', component: MagazineComponent },

            { path: 'notification', component: NotificationComponent },
            { path: 'write', component: WriteComponent },
            { path: 'scrap', component: ScrapComponent },

            { path: 'privacy', component: PrivacyComponent },
            { path: 'service-terms', component: ServiceTermsComponent },
        ],
    },

    { path: 'search', component: SearchComponent },

    { path: 'my-info', component: MyInfoComponent },

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
