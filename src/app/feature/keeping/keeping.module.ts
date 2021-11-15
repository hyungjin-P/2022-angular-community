import { NgModule } from '@angular/core'

import { KeepingRoutingModule } from './keeping-routing.module'
import { KeepingComponent } from './keeping.component'

import { SharedModule } from '@shared/shared.module'

import { CommonModule } from './common/common.module'

import { HomeComponent } from './children/home/home.component'
import { FeedComponent } from './children/feed/feed.component'
import { WriteComponent } from './children/write/write.component'
import { MagazineComponent } from './children/magazine/magazine.component'
import { NoticeComponent } from './children/notice/notice.component'
import { EventComponent } from './children/event/event.component'
import { HelpComponent } from './children/help/help.component'

import { PrivacyComponent } from './children/privacy/privacy.component'
import { ServiceTermsComponent } from './children/service-terms/service-terms.component'
import { NotificationComponent } from './children/notification/notification.component'

import { MypageComponent } from './mypage/mypage.component'
import { SearchComponent } from './search/search.component'

@NgModule({
    declarations: [
        KeepingComponent,

        HomeComponent,
        FeedComponent,
        WriteComponent,
        MagazineComponent,
        NoticeComponent,
        EventComponent,
        HelpComponent,

        PrivacyComponent,
        ServiceTermsComponent,
        NotificationComponent,

        MypageComponent,
        SearchComponent,
    ],
    imports: [KeepingRoutingModule, SharedModule, CommonModule],
    exports: [],
    providers: [],
})
export class KeepingModule {}
