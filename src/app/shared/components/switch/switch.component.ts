import { Component, Input, forwardRef } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
    selector: 'shared-switch',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SwitchComponent),
            multi: true,
        },
    ],
})
export class SwitchComponent implements ControlValueAccessor {
    @Input() disabled: boolean
    @Input() text: string

    isChecked: boolean
    onChange = (_) => {}
    onTouched = (_) => {}

    constructor() {
        this.disabled = false
        this.isChecked = false
    }

    writeValue(value: boolean): void {
        this.isChecked = value
    }

    registerOnChange(fn: any): void {
        this.onChange = fn
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled
    }

    onChanged($event) {
        if (this.disabled) {
            return
        }

        this.isChecked = $event
        this.onChange($event)
    }
}
