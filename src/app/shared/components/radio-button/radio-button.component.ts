import { Component, Input, ElementRef, Renderer2 } from '@angular/core'

@Component({
    selector: 'keeping-radio-button',
    templateUrl: './radio-button.component.html',
    styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonComponent {
    @Input() checked: boolean
    @Input() text: string
    @Input() disabled: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.checked = false
        this.text = ''
        this.disabled = false
    }
}
