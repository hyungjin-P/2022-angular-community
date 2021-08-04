import { NgModule } from '@angular/core'

import { ThefaceHomeRoutingModule } from './theface-home-routing.module'
import { ThefaceHomeComponent } from './theface-home.component'

import { SharedModule } from '@shared/shared.module'

@NgModule({
    declarations: [ThefaceHomeComponent],
    imports: [ThefaceHomeRoutingModule, SharedModule],
    exports: [],
    providers: [],
})
export class ThefaceHomeModule {}
