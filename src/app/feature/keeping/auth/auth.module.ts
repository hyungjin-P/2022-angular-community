import { NgModule } from '@angular/core'

import { AuthRoutingModule } from './auth-routing.module'

import { SharedModule } from '@shared/shared.module'

import { CommonModule } from '../common/common.module'

import { CallbackComponent } from './callback/callback.component'
import { EmailComponent } from './email/email.component'
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component'
import { LoginComponent } from './login/login.component'
import { RegistrationComponent } from './registration/registration.component'
import { ResetPasswordComponent } from './reset-password/reset-password.component'
import { ServiceTermsComponent } from './service-terms/service-terms.component';
import { ViaLoginSuccessComponent } from './via-login-success/via-login-success.component';
import { ViaSignupSuccessComponent } from './via-signup-success/via-signup-success.component'

@NgModule({
    declarations: [
        CallbackComponent,
        EmailComponent,
        ForgotPasswordComponent,
        LoginComponent,
        RegistrationComponent,
        ResetPasswordComponent,
        ServiceTermsComponent,
        ViaLoginSuccessComponent,
        ViaSignupSuccessComponent,
    ],
    imports: [AuthRoutingModule, SharedModule, CommonModule],
    exports: [],
    providers: [],
})
export class AuthModule {}
