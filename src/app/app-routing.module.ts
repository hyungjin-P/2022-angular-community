import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import {NotFoundComponent} from './core/not-found/not-found.component'

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./feature/keeping/keeping.module').then((m) => m.KeepingModule)
  },
  {
    path: 'components',
    loadChildren: () => import('./feature/components/components.module').then((m) => m.ComponentsModule),
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
