import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';

import { BottomNavComponent } from './bottom-nav/bottom-nav.component';
import { DrawerComponent } from './drawer/drawer.component';
import { HeaderComponent } from './header/header.component';
import { MobileHeaderComponent } from './mobile-header/mobile-header.component';
import { NavComponent } from './nav/nav.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ServiceTermsComponent } from './service-terms/service-terms.component';
import { InlineSVGModule } from 'ng-inline-svg';

@NgModule({
  declarations: [
    BottomNavComponent,
    DrawerComponent,
    HeaderComponent,
    MobileHeaderComponent,
    NavComponent,
    PrivacyComponent,
    ServiceTermsComponent,
  ],
  imports: [RouterModule, SharedModule, InlineSVGModule],
  exports: [
    BottomNavComponent,
    DrawerComponent,
    HeaderComponent,
    MobileHeaderComponent,
    NavComponent,
    PrivacyComponent,
    ServiceTermsComponent,
  ],
  providers: [],
})
export class CommonModule {}
