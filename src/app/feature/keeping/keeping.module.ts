import { NgModule } from '@angular/core';

import { KeepingRoutingModule } from './keeping-routing.module';
import { KeepingComponent } from './keeping.component';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from './common/common.module';
import { HomeComponent } from './children/home/home.component';
import { FeedComponent } from './children/feed/feed.component';
import { FeedDetailComponent } from './children/feed-detail/feed-detail.component';
import { WriteComponent } from './children/write/write.component';
import { MagazineComponent } from './children/magazine/magazine.component';
import { NoticeComponent } from './children/notice/notice.component';
import { EventComponent } from './children/event/event.component';
import { HelpComponent } from './children/help/help.component';
import { PrivacyComponent } from './children/privacy/privacy.component';
import { ServiceTermsComponent } from './children/service-terms/service-terms.component';
import { NotificationComponent } from './children/notification/notification.component';
import { MypageComponent } from './mypage/mypage.component';
import { SearchComponent } from './search/search.component';
import { TestPageComponent } from './children/test-page/test-page.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { MypageFeedComponent } from './mypage/mypage-feed/mypage-feed.component';
import { FeedFollowComponent } from './children/feed-follow/feed-follow.component';

@NgModule({
  declarations: [
    KeepingComponent,

    HomeComponent,
    FeedComponent,
    FeedDetailComponent,
    FeedFollowComponent,
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
    TestPageComponent,
    MypageFeedComponent,
  ],
  imports: [KeepingRoutingModule, SharedModule, CommonModule, InlineSVGModule.forRoot()],
  exports: [],
  providers: [],
})
export class KeepingModule {}
