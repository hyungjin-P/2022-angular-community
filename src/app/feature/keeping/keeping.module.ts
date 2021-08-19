import { NgModule } from '@angular/core'

import { KeepingRoutingModule } from './keeping-routing.module'
import { KeepingComponent } from './keeping.component'

import { SharedModule } from '@shared/shared.module'

import { HomeComponent } from './contents/home/home.component'
import { FeedComponent } from './contents/feed/feed.component'
import { CommunityComponent } from './contents/community/community.component'
import { MarketComponent } from './contents/market/market.component'
import { MagazineComponent } from './contents/magazine/magazine.component'
import { PrivacyComponent } from './contents/privacy/privacy.component'
import { ServiceTermsComponent } from './contents/service-terms/service-terms.component'

@NgModule({
    declarations: [
        KeepingComponent,
        HomeComponent,
        FeedComponent,
        CommunityComponent,
        MarketComponent,
        MagazineComponent,
        PrivacyComponent,
        ServiceTermsComponent,
    ],
    imports: [KeepingRoutingModule, SharedModule],
    exports: [],
    providers: [],
})
export class KeepingModule {}
