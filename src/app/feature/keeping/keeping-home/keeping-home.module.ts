import { NgModule } from '@angular/core'

import { KeepingsHomeRoutingModule } from './keeping-home-routing.module'
import { KeepingHomeComponent } from './keeping-home.component'

import { SharedModule } from '@shared/shared.module'

@NgModule({
    declarations: [KeepingHomeComponent],
    imports: [KeepingsHomeRoutingModule, SharedModule],
    exports: [],
    providers: [],
})
export class KeepingHomeModule {}
