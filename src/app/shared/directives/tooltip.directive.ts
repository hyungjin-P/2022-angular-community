import { Directive, ElementRef, HostListener, Input, Renderer2, OnDestroy } from '@angular/core'

@Directive({
    selector: '[keeping-tooltip]',
})
export class TooltipDirective implements OnDestroy {
    @Input() keepingTooltipTitle: string
    @Input() keepingTooltipPlacement: string
    @Input() keepingTooltipDelay: number

    private tooltip: HTMLElement
    private offset = 10

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.keepingTooltipTitle = 'Tooltip'
        this.keepingTooltipPlacement = 'left'
        this.keepingTooltipDelay = 200
    }

    ngOnDestroy(): void {
        this.onMouseLeave()
    }

    @HostListener('mouseenter')
    onMouseEnter() {
        this.create()
        this.setPosition()

        setTimeout(() => {
            if (this.tooltip) {
                this.renderer.addClass(this.tooltip, 'keeping-tooltip-show')
            }
        }, 0)
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        if (this.tooltip) {
            this.renderer.removeChild(document.body, this.tooltip)
            this.tooltip = null
        }
    }

    create() {
        this.tooltip = this.renderer.createElement('div')
        this.renderer.appendChild(this.tooltip, this.renderer.createText(this.keepingTooltipTitle))
        this.renderer.appendChild(document.body, this.tooltip)

        this.renderer.addClass(this.tooltip, 'keeping-tooltip')
        this.renderer.addClass(this.tooltip, `keeping-tooltip-${this.keepingTooltipPlacement}`)
        this.renderer.setStyle(this.tooltip, '-webkit-transition', `opacity ${this.keepingTooltipDelay}ms`)
        this.renderer.setStyle(this.tooltip, '-moz-transition', `opacity ${this.keepingTooltipDelay}ms`)
        this.renderer.setStyle(this.tooltip, '-o-transition', `opacity ${this.keepingTooltipDelay}ms`)
        this.renderer.setStyle(this.tooltip, 'transition', `opacity ${this.keepingTooltipDelay}ms`)
    }

    setPosition() {
        const hostPos = this.el.nativeElement.getBoundingClientRect()
        const toolTipPos = this.tooltip.getBoundingClientRect()

        if (this.keepingTooltipPlacement == 'top') {
            const adjusment =
                hostPos.width > toolTipPos.width
                    ? hostPos.width / 2 - toolTipPos.width / 2
                    : (toolTipPos.width / 2 - hostPos.width / 2) * -1
            this.renderer.setStyle(this.tooltip, 'top', `${hostPos.top - toolTipPos.height - this.offset}px`)
            this.renderer.setStyle(this.tooltip, 'left', `${hostPos.left + adjusment}px`)
        } else if (this.keepingTooltipPlacement == 'right') {
            const adjusment =
                hostPos.height > toolTipPos.height
                    ? hostPos.height / 2 - toolTipPos.height / 2
                    : (toolTipPos.height / 2 - hostPos.height / 2) * -1
            this.renderer.setStyle(this.tooltip, 'top', `${hostPos.top + adjusment}px`)
            this.renderer.setStyle(this.tooltip, 'left', `${hostPos.right + this.offset}px`)
        } else if (this.keepingTooltipPlacement == 'bottom') {
            const adjusment =
                hostPos.width > toolTipPos.width
                    ? hostPos.width / 2 - toolTipPos.width / 2
                    : (toolTipPos.width / 2 - hostPos.width / 2) * -1
            this.renderer.setStyle(this.tooltip, 'top', `${hostPos.bottom + this.offset}px`)
            this.renderer.setStyle(this.tooltip, 'left', `${hostPos.left + adjusment}px`)
        } else {
            const adjusment =
                hostPos.height > toolTipPos.height
                    ? hostPos.height / 2 - toolTipPos.height / 2
                    : (toolTipPos.height / 2 - hostPos.height / 2) * -1
            this.renderer.setStyle(this.tooltip, 'top', `${hostPos.top + adjusment}px`)
            this.renderer.setStyle(this.tooltip, 'left', `${hostPos.left - toolTipPos.width - this.offset}px`)
        }
    }
}
