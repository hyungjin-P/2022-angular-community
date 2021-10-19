import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

// Translate
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

// Components
import { AvatarComponent } from './components/avatar/avatar.component'
import { CheckboxComponent } from './components/checkbox/checkbox.component'
import { DatepickerComponent } from './components/datepicker/datepicker.component'
import { InputComponent } from './components/input/input.component'
import { ModalComponent } from './components/modal/modal.component'
import { RadioComponent } from './components/radio/radio.component'
import { SelectComponent } from './components/select/select.component'
import { SwitchComponent } from './components/switch/switch.component'
import { TimepickerComponent } from './components/timepicker/timepicker.component'
import { ToastComponent } from './components/toast/toast.component'

// Directives
import { AutoScrollDirective } from './directives/auto-scroll.directive'
import { ClickOutsideDirective } from './directives/click-outside.directive'
import { DropzoneDirective } from './directives/dropzone.directive'
import { HighlightDirective } from './directives/highlight.directive'
import { TooltipDirective } from './directives/tooltip.directive'

// Pipes
import { LinkPipe } from './pipes/link.pipe'
import { MinuteSecondsPipe } from './pipes/minuteSeconds.pipe'
import { numberWithCommasPipe } from './pipes/numberWithCommas.pipe'
import { SafePipe } from './pipes/safe.pipe'
import { TimePipe } from './pipes/time.pipe'

@NgModule({
    declarations: [
        // Components
        AvatarComponent,
        CheckboxComponent,
        DatepickerComponent,
        InputComponent,
        ModalComponent,
        RadioComponent,
        SelectComponent,
        SwitchComponent,
        TimepickerComponent,
        ToastComponent,

        // Directives
        AutoScrollDirective,
        ClickOutsideDirective,
        DropzoneDirective,
        HighlightDirective,
        TooltipDirective,

        // Pipes
        LinkPipe,
        MinuteSecondsPipe,
        numberWithCommasPipe,
        SafePipe,
        TimePipe,
    ],
    imports: [
        CommonModule,
        FormsModule,

        HttpClientModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),
    ],
    exports: [
        CommonModule,
        FormsModule,
        TranslateModule,

        // Components
        AvatarComponent,
        CheckboxComponent,
        DatepickerComponent,
        InputComponent,
        ModalComponent,
        RadioComponent,
        SelectComponent,
        SwitchComponent,
        TimepickerComponent,
        ToastComponent,

        // Directives
        AutoScrollDirective,
        ClickOutsideDirective,
        DropzoneDirective,
        HighlightDirective,
        TooltipDirective,

        // Pipes
        LinkPipe,
        MinuteSecondsPipe,
        numberWithCommasPipe,
        SafePipe,
        TimePipe,
    ],
    providers: [],
})
export class SharedModule {}
