import { Component, Input, forwardRef } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
    selector: 'shared-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true,
        },
    ],
})
export class InputComponent implements ControlValueAccessor {
    @Input() type: string
    @Input() label: string
    @Input() placeholder: string
    @Input() disabled: boolean
    @Input() text: string
    @Input() maxlength: number
    @Input() info: string
    @Input() error: string

    onChange = (_) => {}
    onTouched = (_) => {}

    constructor() {
        this.type = 'text'
        this.label = ''
        this.placeholder = ''
        this.disabled = false
        this.text = ''
        this.info = ''
        this.error = ''
    }

    writeValue(value: string): void {
        this.text = value
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

        this.text = $event
        this.onChange($event)
    }
}
