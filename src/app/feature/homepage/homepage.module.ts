import { NgModule } from '@angular/core'

import { HomepageRoutingModule } from './homepage-routing.module'
import { HomepageComponent } from './homepage.component'

import { SharedModule } from '@shared/shared.module'

@NgModule({
    declarations: [HomepageComponent],
    imports: [HomepageRoutingModule, SharedModule],
    exports: [],
    providers: [],
})
export class HomepageModule {}
