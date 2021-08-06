import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { KeepingHomeComponent } from './keeping-home.component'

const routes: Routes = [
    {
        path: '',
        component: KeepingHomeComponent,
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class KeepingsHomeRoutingModule {}
