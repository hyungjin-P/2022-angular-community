import { NgModule } from '@angular/core'

import { KeepingRoutingModule } from './keeping-routing.module'
import { KeepingComponent } from './keeping.component'

import { SharedModule } from '@shared/shared.module'

@NgModule({
    declarations: [KeepingComponent],
    imports: [KeepingRoutingModule, SharedModule],
    exports: [],
    providers: [],
})
export class KeepingModule {}
