import {
    Component,
    Input,
    ElementRef,
    Renderer2,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
    ViewChild,
} from '@angular/core'

@Component({
    selector: 'shared-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnChanges, AfterViewChecked {
    @Input() visible: boolean
    @Input() data: any
    @Input() type: string

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<any>()

    changed: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.type = 'alert' // alert, confirm
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.visible.firstChange) {
            if (changes.visible.previousValue != changes.visible.currentValue) {
                this.changed = true
            }
        }
    }

    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false

            if (this.visible) {
                this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'd-block')
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'd-flex')
                this.modalWrapperElement.nativeElement.focus()

                this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'shared-modal-background-show')
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'shared-modal-wrapper-show')
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'shared-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'shared-modal-wrapper-show')

                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'd-block')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'd-flex')
            }
        }
    }

    onCancel(): void {
        this.cancel.emit({})
    }

    onConfirm(): void {
        this.confirm.emit({})
    }
}
