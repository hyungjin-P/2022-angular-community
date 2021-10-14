import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { ComponentsComponent } from './components.component'

import { ButtonComponent } from './children/general/button/button.component'

import { CheckboxComponent } from './children/data-entry/checkbox/checkbox.component'
import { DatePickerComponent } from './children/data-entry/datepicker/datepicker.component'
import { InputComponent } from './children/data-entry/input/input.component'
import { RadioComponent } from './children/data-entry/radio/radio.component'
import { SelectComponent } from './children/data-entry/select/select.component'
import { SwitchComponent } from './children/data-entry/switch/switch.component'
import { TimePickerComponent } from './children/data-entry/timepicker/timepicker.component'

import { AvatarComponent } from './children/data-display/avatar/avatar.component'
import { CarouselComponent } from './children/data-display/carousel/carousel.component'
import { TooltipComponent } from './children/data-display/tooltip/tooltip.component'

import { ModalComponent } from './children/feedback/modal/modal.component'
import { ToastComponent } from './children/feedback/toast/toast.component'

import { WebSocketComponent } from './children/etc/websocket/websocket.component'
import { EmailComponent } from './children/etc/email/email.component'

const routes: Routes = [
    {
        path: '',
        component: ComponentsComponent,
        children: [
            { path: '', redirectTo: 'button', pathMatch: 'full' },
            { path: 'button', component: ButtonComponent },

            { path: 'checkbox', component: CheckboxComponent },
            { path: 'datepicker', component: DatePickerComponent },
            { path: 'input', component: InputComponent },
            { path: 'radio', component: RadioComponent },
            { path: 'select', component: SelectComponent },
            { path: 'switch', component: SwitchComponent },
            { path: 'timepicker', component: TimePickerComponent },

            { path: 'avatar', component: AvatarComponent },
            { path: 'carousel', component: CarouselComponent },
            { path: 'tooltip', component: TooltipComponent },

            { path: 'modal', component: ModalComponent },
            { path: 'toast', component: ToastComponent },

            { path: 'websocket', component: WebSocketComponent },
            { path: 'email', component: EmailComponent },
        ],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ComponentsRoutingModule {}
