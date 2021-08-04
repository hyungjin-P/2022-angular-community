import {
    Directive,
    ElementRef,
    Input,
    OnInit,
    Renderer2,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
} from '@angular/core'

@Directive({
    selector: '[keeping-button]',
})
export class ButtonDirective implements OnInit, OnChanges, AfterViewChecked {
    @Input() keepingButtonWidth: string
    @Input() keepingButtonHeight: string
    @Input() keepingButtonColor: string
    @Input() keepingButtonBorderColor: string
    @Input() keepingButtonFontColor: string
    @Input() keepingButtonDisabled: boolean

    changed

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.keepingButtonDisabled && !changes.keepingButtonDisabled.firstChange) {
            if (changes.keepingButtonDisabled.previousValue != changes.keepingButtonDisabled.currentValue) {
                this.changed = true
            }
        }
    }

    ngOnInit(): void {
        this.renderer.addClass(this.el.nativeElement, 'keeping-button')

        if (this.keepingButtonWidth) {
            this.el.nativeElement.style.width = `${this.keepingButtonWidth}px`
        }

        if (this.keepingButtonHeight) {
            this.el.nativeElement.style.height = `${this.keepingButtonHeight}px`
        }

        if (!this.keepingButtonWidth && !this.keepingButtonHeight) {
            this.el.nativeElement.style.padding = '13px 15px'
        }

        if (this.keepingButtonColor) {
            this.el.nativeElement.style.backgroundColor = this.keepingButtonColor
            this.el.nativeElement.style.color = 'var(--white)'
            this.renderer.addClass(this.el.nativeElement, 'keeping-button-type2')
        } else if (this.keepingButtonBorderColor) {
            this.el.nativeElement.style.border = `1px solid ${this.keepingButtonBorderColor}`
            this.el.nativeElement.style.color = 'var(--font-color)'
            this.renderer.addClass(this.el.nativeElement, 'keeping-button-type1')
        } else {
            this.renderer.addClass(this.el.nativeElement, 'keeping-button-type1')
        }

        if (this.keepingButtonFontColor) {
            this.el.nativeElement.style.color = this.keepingButtonFontColor
        }

        if (this.keepingButtonDisabled) {
            this.renderer.addClass(this.el.nativeElement, 'keeping-button-disabled')

            if (this.keepingButtonBorderColor) {
                this.el.nativeElement.style.border = `1px solid transparent`
            }
        }
    }

    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false

            if (this.keepingButtonDisabled) {
                this.renderer.addClass(this.el.nativeElement, 'keeping-button-disabled')

                if (this.keepingButtonBorderColor) {
                    this.el.nativeElement.style.border = `1px solid transparent`
                }
            } else {
                this.renderer.removeClass(this.el.nativeElement, 'keeping-button-disabled')

                if (this.keepingButtonBorderColor) {
                    this.el.nativeElement.style.border = `1px solid ${this.keepingButtonBorderColor}`
                }
            }
        }
    }
}
