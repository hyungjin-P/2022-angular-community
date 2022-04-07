import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';


@Component({
  selector: 'app-mypage-feed-detail',
  templateUrl: './mypage-feed-detail.component.html',
  styleUrls: ['./mypage-feed-detail.component.scss']
})
export class MypageFeedDetailComponent implements OnInit, AfterViewInit {

  pictureTemplate: any[] = [
    { url: 'assets/images/sample/feed_test_img_001.jpg' },
    { url: 'assets/images/sample/feed_test_img_002.jpg' },
    { url: 'assets/images/sample/feed_test_img_003.png' },
  ];

  temp: any[] = [
    { title: 'title1', },
    { title: 'title2', },
    { title: 'title3', },
  ];

  feedList: any[] = [];

  touchCount = 0;

  likeToggle: boolean = false;
  bookmarkToggle: boolean = false;
  popoverToggle: boolean = false;

  feedModifyModalVisible: boolean = false;
  feedDeleteModalVisible: boolean = false;

  feedModifyMessage: any = {
    text: '피드 수정',
    subText: '정말 수정 하시겠어요?',
    confirmBtnText: '수정',
    cancelBtnText: '취소'
  }

  feedDeleteMessage: any = {
    text: '피드 삭제',
    subText: '정말 삭제 하시겠어요?',
    confirmBtnText: '삭제',
    cancelBtnText: '취소'
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  getThisPicture(picture: any): void {
    // console.log('picture : ', picture);
  }

  getSlideActiveIndex(activeIndex: any): void {
    // console.log('activeIndex : ', activeIndex);
  }

  getSlides(data: any): void {
    // console.log('getSlide : ', data);
  }

  likeToggleTest(): boolean {
    this.likeToggle = !this.likeToggle;
    return this.likeToggle;
  }

  bookmarkToggleTest(): boolean {
    this.bookmarkToggle = !this.bookmarkToggle;
    return this.bookmarkToggle;
  }

  popoverToggleTest(event?): boolean {
    if (event) {
      console.log('event : ', event);
    }

    this.popoverToggle = !this.popoverToggle;
    return this.popoverToggle
  }

  errLog(event: any): void {
    console.log('errLog : ', event);
  }

  feedDeleteAccess(): void {
    this.feedModifyModalVisible = false;
  }

  closePopover(): void {
    this.popoverToggle = false;
  }

  modalCancel(): void {
    this.feedModifyModalVisible = false;
    this.feedDeleteModalVisible = false;
  }

  visibleFeedModifyModal() {
    this.feedModifyModalVisible = true;
  }

  visibleFeedDeleteModal() {
    this.feedDeleteModalVisible = true;
  }

}
