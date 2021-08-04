import { Component, Input, ElementRef, Renderer2 } from '@angular/core'

@Component({
    selector: 'keeping-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent {
    @Input() checked: boolean
    @Input() text: string
    @Input() disabled: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.checked = false
        this.text = ''
        this.disabled = false
    }
}
