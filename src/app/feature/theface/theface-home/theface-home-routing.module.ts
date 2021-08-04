import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { ThefaceHomeComponent } from './theface-home.component'

const routes: Routes = [
    {
        path: '',
        component: ThefaceHomeComponent,
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ThefaceHomeRoutingModule {}
