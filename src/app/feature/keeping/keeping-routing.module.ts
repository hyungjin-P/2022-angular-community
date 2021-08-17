import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthGuard } from '@services/guards/auth.guard'

import { KeepingComponent } from './keeping.component'

const routes: Routes = [
    {
        path: '',
        component: KeepingComponent,
    },

    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class KeepingRoutingModule {}
