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
import { MypageFeedDetailComponent } from './mypage/mypage-feed-detail/mypage-feed-detail.component';
import {SwiperModule} from "swiper/angular";
import { MypageSlider } from './mypage/shared/mypage-slider/mypage-slider.component';
import { MypagePopoverComponent } from './mypage/shared/mypage-popover/mypage-popover.component';
import { ScrapComponent } from './children/scrap/scrap.component';
import { ScrapFeedComponent } from './children/scrap/scrap-feed/scrap-feed.component';

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
    MypageFeedDetailComponent,
    MypageSlider,
    MypagePopoverComponent,
    ScrapComponent,
    ScrapFeedComponent,
  ],
  imports: [KeepingRoutingModule, SharedModule, CommonModule, InlineSVGModule.forRoot(), SwiperModule],
  exports: [],
  providers: [],
})
export class KeepingModule {}
