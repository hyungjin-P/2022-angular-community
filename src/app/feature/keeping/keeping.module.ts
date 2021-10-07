import { NgModule } from '@angular/core'

import { KeepingRoutingModule } from './keeping-routing.module'
import { KeepingComponent } from './keeping.component'

import { SharedModule } from '@shared/shared.module'

import { CommonModule } from './common/common.module'

import { HomeComponent } from './children/home/home.component'
import { FeedComponent } from './children/feed/feed.component'
import { WriteComponent } from './children/write/write.component'
import { CommunityComponent } from './children/community/community.component'

import { MypageComponent } from './children/mypage/mypage.component'
import { PrivacyComponent } from './children/privacy/privacy.component'
import { ServiceTermsComponent } from './children/service-terms/service-terms.component'

import { SearchComponent } from './search/search.component'
import { NotificationComponent } from './children/notification/notification.component'

@NgModule({
    declarations: [
        KeepingComponent,

        HomeComponent,
        FeedComponent,
        WriteComponent,
        CommunityComponent,

        MypageComponent,
        PrivacyComponent,
        ServiceTermsComponent,

        SearchComponent,
        NotificationComponent,
    ],
    imports: [KeepingRoutingModule, SharedModule, CommonModule],
    exports: [],
    providers: [],
})
export class KeepingModule {}
