import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'shared-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnChanges, AfterViewChecked {
  @Input() visible: boolean;

  @ViewChild('modalBackgroundElement') modalBackgroundElement;
  @ViewChild('modalWrapperElement') modalWrapperElement;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() cancel = new EventEmitter<any>();
  @Output() confirm = new EventEmitter<any>();
  @Output() another = new EventEmitter<any>();

  changed: boolean;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.visible.firstChange) {
      if (changes.visible.previousValue != changes.visible.currentValue) {
        this.changed = true;
      }
    }
  }

  ngAfterViewChecked() {
    if (this.changed) {
      this.changed = false;

      if (this.visible) {
        this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'd-block');
        this.renderer.addClass(this.modalWrapperElement.nativeElement, 'd-flex');
        this.modalWrapperElement.nativeElement.focus();

        this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'shared-modal-background-show');
        this.renderer.addClass(this.modalWrapperElement.nativeElement, 'shared-modal-wrapper-show');
      } else {
        this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'shared-modal-background-show');
        this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'shared-modal-wrapper-show');

        this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'd-block');
        this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'd-flex');
      }
    }
  }

  onCancel(): void {
    this.cancel.emit({});
  }

  onConfirm(): void {
    this.confirm.emit({});
  }

  onAnother() {
    this.another.emit({});
  }
}
