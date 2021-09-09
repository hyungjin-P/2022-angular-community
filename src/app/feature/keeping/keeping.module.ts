import { NgModule } from '@angular/core'

import { KeepingRoutingModule } from './keeping-routing.module'
import { KeepingComponent } from './keeping.component'

import { SharedModule } from '@shared/shared.module'

import { CommonModule } from './common/common.module'

import { HomeComponent } from './children/home/home.component'
import { FeedComponent } from './children/feed/feed.component'
import { CommunityComponent } from './children/community/community.component'
import { MarketComponent } from './children/market/market.component'
import { MagazineComponent } from './children/magazine/magazine.component'

import { NotificationComponent } from './children/notification/notification.component'
import { WriteComponent } from './children/write/write.component'
import { ScrapComponent } from './children/scrap/scrap.component'

import { MyInfoComponent } from './children/my-info/my-info.component'
import { PrivacyComponent } from './children/privacy/privacy.component'
import { ServiceTermsComponent } from './children/service-terms/service-terms.component'

import { SearchComponent } from './search/search.component'

@NgModule({
    declarations: [
        KeepingComponent,

        HomeComponent,
        FeedComponent,
        CommunityComponent,
        MarketComponent,
        MagazineComponent,

        NotificationComponent,
        WriteComponent,
        ScrapComponent,

        MyInfoComponent,
        PrivacyComponent,
        ServiceTermsComponent,

        SearchComponent,
    ],
    imports: [KeepingRoutingModule, SharedModule, CommonModule],
    exports: [],
    providers: [],
})
export class KeepingModule {}
