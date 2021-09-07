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
    @Input() sharedButtonType: string
    @Input() sharedButtonSize: string
    @Input() sharedButtonWidth: string
    @Input() sharedButtonHeight: string
    @Input() sharedButtonDisabled: boolean

    changed

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.sharedButtonType = 'primary' // primary, secondary, outline, teriary primary-text, secondary-text
        this.sharedButtonSize = 'small' // xsmall, small, medium, large
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.sharedButtonDisabled && !changes.sharedButtonDisabled.firstChange) {
            if (changes.sharedButtonDisabled.previousValue != changes.sharedButtonDisabled.currentValue) {
                this.changed = true
            }
        }
    }

    ngOnInit(): void {
        this.renderer.addClass(this.el.nativeElement, 'shared-button')
        this.renderer.addClass(this.el.nativeElement, `shared-button-type-${this.sharedButtonType}`)
        this.renderer.addClass(this.el.nativeElement, `shared-button-size-${this.sharedButtonSize}`)

        if (this.sharedButtonWidth) {
            this.el.nativeElement.style.width = `${this.sharedButtonWidth}px`
        } else {
            this.el.nativeElement.style.width = '100%'
        }

        if (this.sharedButtonHeight) {
            this.el.nativeElement.style.height = `${this.sharedButtonHeight}px`
        }

        if (this.sharedButtonDisabled) {
            this.renderer.addClass(this.el.nativeElement, `shared-button-type-${this.sharedButtonType}-disabled`)
        }
    }

    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false

            if (this.sharedButtonDisabled) {
                this.renderer.addClass(this.el.nativeElement, 'shared-button-disabled')
            } else {
                this.renderer.removeClass(this.el.nativeElement, 'shared-button-disabled')
            }
        }
    }
}
