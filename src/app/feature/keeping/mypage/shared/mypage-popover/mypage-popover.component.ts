import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-mypage-popover',
  templateUrl: './mypage-popover.component.html',
  styleUrls: ['./mypage-popover.component.scss']
})
export class MypagePopoverComponent implements OnInit {

  @Input() isVisible: boolean = false;

  @Output() toggleVisible = new EventEmitter();

  @Output() onClickModify = new EventEmitter();

  @Output() onClickDelete = new EventEmitter();

  @Output() onFocusOut = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
  }

  focusOutEvent(event: any): void {
    console.log('event : ', event);
    this.isVisible = false;
  }

  onToggleVisible(): void {
    this.isVisible = !this.isVisible;
  }

  onClickModifyEvent(event: any): void {
    this.isVisible = false;
    this.onClickModify.emit( { event });
  }

  onClickDeleteEvent(event: any): void {
    this.isVisible = false;
    this.onClickDelete.emit( { event });
  }

}
