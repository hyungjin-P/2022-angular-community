import { NgModule } from '@angular/core'

import { KeepingRoutingModule } from './keeping-routing.module'
import { KeepingComponent } from './keeping.component'

import { SharedModule } from '@shared/shared.module'

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

        PrivacyComponent,
        ServiceTermsComponent,

        SearchComponent,
        MyInfoComponent,
    ],
    imports: [KeepingRoutingModule, SharedModule],
    exports: [],
    providers: [],
})
export class KeepingModule {}
