import { NgModule } from '@angular/core'

import { KeepingRoutingModule } from './keeping-routing.module'
import { KeepingComponent } from './keeping.component'

import { SharedModule } from '@shared/shared.module'

import { CommonModule } from './common/common.module'

import { HomeComponent } from './children/home/home.component'
import { FeedComponent } from './children/feed/feed.component'
import { WriteComponent } from './children/write/write.component'
import { CommunityComponent } from './children/community/community.component'
import { MagazineComponent } from './children/magazine/magazine.component'
import { EventComponent } from './children/event/event.component'
import { NoticeComponent } from './children/notice/notice.component'

import { MypageComponent } from './children/mypage/mypage.component'
import { PrivacyComponent } from './children/privacy/privacy.component'
import { ServiceTermsComponent } from './children/service-terms/service-terms.component'
import { NotificationComponent } from './children/notification/notification.component'

import { SearchComponent } from './search/search.component'

@NgModule({
    declarations: [
        KeepingComponent,

        HomeComponent,
        FeedComponent,
        WriteComponent,
        CommunityComponent,
        MagazineComponent,
        EventComponent,
        NoticeComponent,

        MypageComponent,
        PrivacyComponent,
        ServiceTermsComponent,
        NotificationComponent,

        SearchComponent,
    ],
    imports: [KeepingRoutingModule, SharedModule, CommonModule],
    exports: [],
    providers: [],
})
export class KeepingModule {}
