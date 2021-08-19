import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthGuard } from '@services/guards/auth.guard'

import { KeepingComponent } from './keeping.component'

import { HomeComponent } from './contents/home/home.component'
import { FeedComponent } from './contents/feed/feed.component'
import { CommunityComponent } from './contents/community/community.component'
import { MarketComponent } from './contents/market/market.component'
import { MagazineComponent } from './contents/magazine/magazine.component'
import { PrivacyComponent } from './contents/privacy/privacy.component'
import { ServiceTermsComponent } from './contents/service-terms/service-terms.component'

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

            { path: 'privacy', component: PrivacyComponent },
            { path: 'service-terms', component: ServiceTermsComponent },
        ],
    },

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
