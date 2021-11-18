import { NgModule } from '@angular/core'

import { ComponentsRoutingModule } from './components-routing.module'
import { ComponentsComponent } from './components.component'

import { SharedModule } from '@shared/shared.module'

import { ButtonComponent } from './children/general/button/button.component'

import { CheckboxComponent } from './children/data-entry/checkbox/checkbox.component'
import { DatePickerComponent } from './children/data-entry/datepicker/datepicker.component'
import { EditorComponent } from './children/data-entry/editor/editor.component'
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

@NgModule({
    declarations: [
        ComponentsComponent,

        ButtonComponent,

        CheckboxComponent,
        DatePickerComponent,
        EditorComponent,
        InputComponent,
        RadioComponent,
        SelectComponent,
        SwitchComponent,
        TimePickerComponent,

        AvatarComponent,
        CarouselComponent,
        TooltipComponent,

        ModalComponent,
        ToastComponent,

        WebSocketComponent,
        EmailComponent,
    ],
    imports: [ComponentsRoutingModule, SharedModule],
    exports: [ComponentsComponent],
    providers: [],
})
export class ComponentsModule {}
