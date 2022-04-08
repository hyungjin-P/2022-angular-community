import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {StorageService} from "@services/storage.service";
import {FeedService} from "@services/feed.service";
import {User} from "@schemas/user";
import {Feed} from "@schemas/feed";


@Component({
  selector: 'app-mypage-feed-detail',
  templateUrl: './mypage-feed-detail.component.html',
  styleUrls: ['./mypage-feed-detail.component.scss']
})
export class MypageFeedDetailComponent implements OnInit, AfterViewInit {

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

  touchCount = 0;

  likeToggle: boolean = false;
  bookmarkToggle: boolean = false;
  popoverToggle: boolean = false;

  feedModifyModalVisible: boolean = false;
  feedDeleteModalVisible: boolean = false;

  user: User;
  feedList: any[] = [];

  /** pagination */
  page: number = 1;
  pageCount: number = 12;

  emptyCount: number = 0;
  otherCount: number = 0;
  totalCount: number = 0;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private feedService: FeedService,
  ) {
    this.pushEmptyFeed(this.pageCount);
  }

  ngOnInit(): void {
    this.user = this.storageService.getUser();
  }

  ngAfterViewInit(): void {
    this.findMyPageFeedList(this.user.id, this.pageCount);
  }

  /**
   * 마이페이지 내 피드 메인 조회
   * @param userId
   * @param limit
   */
  findMyPageFeedList(userId, limit): void {
    if (this.user) {
      this.feedService
        .findMyPageFeedMain(userId, limit)
        .subscribe((data) => {
          this.feedList = data?.feedList;
          if (this.feedList.length < limit) {
            let def = limit - this.feedList.length;

            for (let i = 0; i < def; i++) {
              this.feedList.push({});
            }
          }
          this.otherCount = data?.otherCount;
          this.totalCount = data?.totalCount;

          if (this.totalCount === 0) {
            this.feedList = [];
          }

          console.log('--- feed/detail feedList : ', this.feedList[0]);
        });
    }
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

  onPopoverToggle(feed: Feed): boolean {
    feed.onCheckPopover = !feed.onCheckPopover;
    return feed.onCheckPopover;
  }

  onClosePopover(feed: Feed): void {
    feed.onCheckPopover = false;
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

  pushEmptyFeed(limit: number): void {
    for (let i = 0; i < limit; i++) {
      this.feedList.push({});
    }
  }

  comparisonUserPicture(user: User): any {
    return user?.picture ? {'background-image': 'url(' + user?.picture[0].url + ')'} : {};
  }

}
