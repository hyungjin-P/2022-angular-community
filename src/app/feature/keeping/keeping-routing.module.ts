import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@services/guards/auth.guard';
import { ServiceTermsGuard } from '@services/guards/service-terms.guard';

import { KeepingComponent } from './keeping.component';

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
import { MypageFeedComponent } from './mypage/mypage-feed/mypage-feed.component';
import { FeedFollowComponent } from './children/feed-follow/feed-follow.component';
import { ScrapComponent } from './scrap/scrap.component';
import { ScrapFeedComponent } from './scrap/scrap-feed/scrap-feed.component';
import { ScrapMagazineComponent } from './scrap/scrap-magazine/scrap-magazine.component';
import { SearchFeedComponent } from './search/search-feed/search-feed.component';
import { SearchMagazineComponent } from './search/search-magazine/search-magazine.component';
import { MypageViaComponent } from './mypage/mypage-via/mypage-via.component';

// 2022.05.04 기준 미사용 항목 : notice, event, help, notification
const routes: Routes = [
  // 키핑 메뉴
  {
    path: '',
    canActivate: [ServiceTermsGuard],
    component: KeepingComponent,
    children: [
      { path: '', component: HomeComponent, redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', component: FeedComponent },
      { path: 'feed/follow', canActivate: [AuthGuard], component: FeedFollowComponent },
      { path: 'follow', canActivate: [AuthGuard], component: FeedFollowComponent },
      { path: 'feed/follow/:user_id', canActivate: [AuthGuard], component: FeedFollowComponent },
      { path: 'feed/:feed_id', component: FeedDetailComponent },
      { path: 'feed/:feed_id/:redirect', component: FeedDetailComponent },
      { path: 'write', canActivate: [AuthGuard], component: WriteComponent },
      { path: 'write/:feed_id', canActivate: [AuthGuard], component: WriteComponent },
      { path: 'magazine', component: MagazineComponent },
      { path: 'notice', component: NoticeComponent },
      { path: 'event', component: EventComponent },
      { path: 'help', component: HelpComponent },
      { path: 'privacy', component: PrivacyComponent },
      { path: 'service-terms', component: ServiceTermsComponent },
      { path: 'notification', component: NotificationComponent },
    ],
  },
  // 마이페이지
  {
    path: 'mypage/:userId',
    canActivate: [AuthGuard, ServiceTermsGuard],
    component: MypageComponent,
    children: [
      { path: 'feed', component: MypageFeedComponent },
      { path: '', component: MypageFeedComponent, redirectTo: 'feed', pathMatch: 'full' },
    ],
  },

  // 경유 페이지
  {
    path: 'via',
    component: MypageViaComponent,
  },

  {
    path: 'scrap',
    canActivate: [AuthGuard, ServiceTermsGuard],
    component: ScrapComponent,
    children: [
      { path: '', component: ScrapFeedComponent, redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', component: ScrapFeedComponent },
      { path: 'magazine', component: ScrapMagazineComponent },
    ],
  },

  {
    path: 'search',
    canActivate: [ServiceTermsGuard],
    component: SearchComponent,
    children: [
      { path: 'feed', component: SearchFeedComponent },
      { path: 'magazine', component: SearchMagazineComponent },
    ],
  },

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },

  {
    path: 'settings',
    canActivate: [AuthGuard, ServiceTermsGuard],
    loadChildren: () => import('./settings/settings.module').then((m) => m.SettingsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeepingRoutingModule {}
