import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthGuard } from '@services/guards/auth.guard'

import { LoginComponent } from './login/login.component'
import { CallbackComponent } from './callback/callback.component'
import { RegistrationComponent } from './registration/registration.component'
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component'
import { ResetPasswordComponent } from './reset-password/reset-password.component'
import { ServiceTermsComponent } from './service-terms/service-terms.component'

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', canActivate: [AuthGuard], component: LoginComponent },
    { path: 'callback', canActivate: [AuthGuard], component: CallbackComponent },
    { path: 'registration', canActivate: [AuthGuard], component: RegistrationComponent },
    { path: 'forgot-password', canActivate: [AuthGuard], component: ForgotPasswordComponent },
    { path: 'reset-password', canActivate: [AuthGuard], component: ResetPasswordComponent },
    { path: 'service-terms', canActivate: [], component: ServiceTermsComponent },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
