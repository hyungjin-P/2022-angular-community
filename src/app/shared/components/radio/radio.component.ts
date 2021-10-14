import { Component, Input, ElementRef, Renderer2 } from '@angular/core'

@Component({
    selector: 'shared-radio',
    templateUrl: './radio.component.html',
    styleUrls: ['./radio.component.scss'],
})
export class RadioComponent {
    @Input() checked: boolean
    @Input() disabled: boolean
    @Input() text: string

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.checked = false
        this.disabled = false
        this.text = ''
    }
}
