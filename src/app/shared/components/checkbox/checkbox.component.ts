import { Component, Input, ElementRef, Renderer2 } from '@angular/core'

@Component({
    selector: 'shared-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent {
    @Input() shape: string
    @Input() size: string
    @Input() checked: boolean
    @Input() disabled: boolean
    @Input() text: string

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.shape = 'square' // none, square, circle
        this.size = 'default' // default, small
        this.checked = false
        this.disabled = false
        this.text = ''
    }
}
