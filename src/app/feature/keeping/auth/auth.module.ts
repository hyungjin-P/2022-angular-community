import { NgModule } from '@angular/core'

import { AuthRoutingModule } from './auth-routing.module'

import { SharedModule } from '@shared/shared.module'

import { CommonModule } from '../common/common.module'

import { LoginComponent } from './login/login.component'
import { CallbackComponent } from './callback/callback.component'
import { RegistrationComponent } from './registration/registration.component'
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component'
import { ResetPasswordComponent } from './reset-password/reset-password.component'
import { ServiceTermsComponent } from './service-terms/service-terms.component'

@NgModule({
    declarations: [
        LoginComponent,
        CallbackComponent,
        RegistrationComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        ServiceTermsComponent,
    ],
    imports: [AuthRoutingModule, SharedModule, CommonModule],
    exports: [],
    providers: [],
})
export class AuthModule {}
