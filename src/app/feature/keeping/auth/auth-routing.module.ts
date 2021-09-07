import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthGuard } from '@services/guards/auth.guard'

import { LoginComponent } from './login/login.component'
import { CallbackComponent } from './callback/callback.component'
import { TosComponent } from './tos/tos.component'
import { RegistrationComponent } from './registration/registration.component'
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component'
import { ResetPasswordComponent } from './reset-password/reset-password.component'

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', canActivate: [AuthGuard], component: LoginComponent },
    { path: 'callback', canActivate: [AuthGuard], component: CallbackComponent },
    { path: 'tos', canActivate: [], component: TosComponent },
    { path: 'registration', canActivate: [], component: RegistrationComponent },
    { path: 'forgot-password', canActivate: [], component: ForgotPasswordComponent },
    { path: 'reset-password', canActivate: [], component: ResetPasswordComponent },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
