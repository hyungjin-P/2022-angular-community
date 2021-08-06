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
    selector: '[shared-button]',
})
export class ButtonDirective implements OnInit, OnChanges, AfterViewChecked {
    @Input() sharedButtonWidth: string
    @Input() sharedButtonHeight: string
    @Input() sharedButtonColor: string
    @Input() sharedButtonBorderColor: string
    @Input() sharedButtonFontColor: string
    @Input() sharedButtonDisabled: boolean

    changed

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.sharedButtonDisabled && !changes.sharedButtonDisabled.firstChange) {
            if (changes.sharedButtonDisabled.previousValue != changes.sharedButtonDisabled.currentValue) {
                this.changed = true
            }
        }
    }

    ngOnInit(): void {
        this.renderer.addClass(this.el.nativeElement, 'shared-button')

        if (this.sharedButtonWidth) {
            this.el.nativeElement.style.width = `${this.sharedButtonWidth}px`
        }

        if (this.sharedButtonHeight) {
            this.el.nativeElement.style.height = `${this.sharedButtonHeight}px`
        }

        if (!this.sharedButtonWidth && !this.sharedButtonHeight) {
            this.el.nativeElement.style.padding = '13px 15px'
        }

        if (this.sharedButtonColor) {
            this.el.nativeElement.style.backgroundColor = this.sharedButtonColor
            this.el.nativeElement.style.color = 'var(--white)'
            this.renderer.addClass(this.el.nativeElement, 'shared-button-type2')
        } else if (this.sharedButtonBorderColor) {
            this.el.nativeElement.style.border = `1px solid ${this.sharedButtonBorderColor}`
            this.el.nativeElement.style.color = 'var(--font-color)'
            this.renderer.addClass(this.el.nativeElement, 'shared-button-type1')
        } else {
            this.renderer.addClass(this.el.nativeElement, 'shared-button-type1')
        }

        if (this.sharedButtonFontColor) {
            this.el.nativeElement.style.color = this.sharedButtonFontColor
        }

        if (this.sharedButtonDisabled) {
            this.renderer.addClass(this.el.nativeElement, 'shared-button-disabled')

            if (this.sharedButtonBorderColor) {
                this.el.nativeElement.style.border = `1px solid transparent`
            }
        }
    }

    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false

            if (this.sharedButtonDisabled) {
                this.renderer.addClass(this.el.nativeElement, 'shared-button-disabled')

                if (this.sharedButtonBorderColor) {
                    this.el.nativeElement.style.border = `1px solid transparent`
                }
            } else {
                this.renderer.removeClass(this.el.nativeElement, 'shared-button-disabled')

                if (this.sharedButtonBorderColor) {
                    this.el.nativeElement.style.border = `1px solid ${this.sharedButtonBorderColor}`
                }
            }
        }
    }
}
