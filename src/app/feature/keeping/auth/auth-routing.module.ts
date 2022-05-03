import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'

import {AuthGuard} from '@services/guards/auth.guard'

import {CallbackComponent} from './callback/callback.component'
import {EmailComponent} from './email/email.component'
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component'
import {LoginComponent} from './login/login.component'
import {RegistrationComponent} from './registration/registration.component'
import {ResetPasswordComponent} from './reset-password/reset-password.component'
import {ServiceTermsComponent} from './service-terms/service-terms.component'
import {ViaLoginSuccessComponent} from "./via-login-success/via-login-success.component";
import {ViaSignupSuccessComponent} from "./via-signup-success/via-signup-success.component";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'callback', canActivate: [AuthGuard], component: CallbackComponent },
  { path: 'email', canActivate: [AuthGuard], component: EmailComponent },
  { path: 'forgot-password', canActivate: [AuthGuard], component: ForgotPasswordComponent },
  { path: 'login', canActivate: [AuthGuard], component: LoginComponent },
  { path: 'registration', canActivate: [AuthGuard], component: RegistrationComponent },
  { path: 'reset-password', canActivate: [AuthGuard], component: ResetPasswordComponent },
  { path: 'reset-password/:token', canActivate: [AuthGuard], component: ResetPasswordComponent },
  { path: 'service-terms', canActivate: [AuthGuard], component: ServiceTermsComponent },
  { path: 'service-terms:/type', canActivate: [AuthGuard], component: ServiceTermsComponent },
  { path: 'login-success/:type', component: ViaLoginSuccessComponent },
  { path: 'signup-success/:type', component: ViaSignupSuccessComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
