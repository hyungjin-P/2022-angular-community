import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { AuthGuard } from '@services/guards/auth.guard'

import { NotFoundComponent } from './core/not-found/not-found.component'

const routes: Routes = [
    { path: '', loadChildren: () => import('./feature/homepage/homepage.module').then((m) => m.HomepageModule) },

    {
        path: 'components',
        loadChildren: () => import('./feature/components/components.module').then((m) => m.ComponentsModule),
    },

    {
        path: 'auth',
        loadChildren: () => import('./feature/theface/auth/auth.module').then((m) => m.AuthModule),
    },

    {
        path: 'theface-home',
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./feature/theface/theface-home/theface-home.module').then((m) => m.ThefaceHomeModule),
    },

    { path: '404', component: NotFoundComponent },

    { path: '**', redirectTo: '/404' },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
