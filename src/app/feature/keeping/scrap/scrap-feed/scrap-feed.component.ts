import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Feed } from '@schemas/feed';
import { FeedService } from '@services/feed.service';
import { User } from '@schemas/user';
import { StorageService } from '@services/storage.service';
import { GlobalService } from '@services/global.service';
import { FeedBookmark } from '@schemas/feed-bookmark';

@Component({
  selector: 'app-scrap-feed',
  templateUrl: './scrap-feed.component.html',
  styleUrls: ['./scrap-feed.component.scss'],
})
export class ScrapFeedComponent implements OnInit {
  variables: any;
  user: User;
  language: any;
  feedBookmarkList: FeedBookmark[];
  totalCount: number;

  page = 1;
  limit = 12;
  pageMeta: any = {};
  pageLink: any = {};

  isConfirmModalVisible = false;
  confirmModalData: any;
  confirmModalData_ko = {
    text: '스크랩 전체 삭제',
    subText: '스크랩 게시물을 전체 삭제하시겠어요?',
    cancelBtnText: '취소',
    confirmBtnText: '삭제',
  };
  confirmModalData_en = {
    text: 'Delete all scraps',
    subText: 'Are you sure?',
    cancelBtnText: 'No',
    confirmBtnText: 'Delete',
  };

  isScrapFeed = true;
  viewType = 'desktop';

  constructor(
    private router: Router,
    private globalService: GlobalService,
    private storageService: StorageService,
    private feedService: FeedService
  ) {
    this.viewType = window.outerWidth > 991 ? 'desktop' : 'mobile';

    let timer = null;
    window.addEventListener('resize', (data) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.viewType = window.outerWidth > 991 ? 'desktop' : 'mobile';
      }, 200);
    });
  }

  ngOnInit(): void {
    this.variables = this.globalService.variables;
    this.user = this.storageService.getUser();
    this.language = localStorage.getItem('language');

    this.page = 1;
    this.getScrapFeedList();
  }

  findNextPage(): void {
    if (this.pageLink?.next) {
      this.page = this.page + 1;
      this.getScrapFeedList();
    }
  }

  getScrapFeedList() {
    this.feedService.getScrapFeedList(this.page, this.limit, this.user.id).subscribe(
      (feedBookmarkList: any) => {
        this.pageMeta = feedBookmarkList.meta;
        this.pageLink = feedBookmarkList.links;

        if (this.page > 1) {
          this.feedBookmarkList = [...this.feedBookmarkList, ...feedBookmarkList?.items];
        } else {
          this.feedBookmarkList = feedBookmarkList.items;
        }
        this.totalCount = feedBookmarkList.meta.totalCount;
      },
      (e) => {
        // 스크랩한 게시물이 없음
        this.feedBookmarkList = [];
        console.log('Scrap feed list find failed', e);
      }
    );
  }

  /**
   * 북마크 추가/삭제
   * @param feed
   */
  toggleBookmark(feed: Feed): void {
    if (feed) {
      if (feed.isBookmark) {
        this.deleteBookmark(feed, this.user?.id);
      } else {
        this.addBookmark(feed, this.user?.id);
      }
    }
  }

  /**
   * 북마크 추가
   * @param feed
   * @param userId
   */
  addBookmark(feed: Feed, userId: string): void {
    if (this.user) {
      this.feedService.addFeedBookmark({ feedId: feed?.id, userId }).subscribe(
        (data) => {
          feed.isBookmark = true;
        },
        (error) => {
          console.log('bookmark add failed : ', error);
        }
      );
    }
  }

  /**
   * 북마크 삭제
   * @param feed
   * @param userId
   */
  deleteBookmark(feed: Feed, userId: string): void {
    if (this.user) {
      this.feedService.deleteFeedBookmark({ feedId: feed?.id, userId }).subscribe(
        (data) => {
          feed.isBookmark = false;
        },
        (error) => {
          console.log('bookmark cancel failed : ', error);
        }
      );
    }
  }

  goRouter(path: string): void {
    this.router.navigateByUrl(path).then();
  }

  moveFeedDetail(feed: Feed) {
    this.router.navigateByUrl(`/feed/${feed.id}`);
  }

  showConfirmModal() {
    if (this.language === 'ko') {
      this.confirmModalData = this.confirmModalData_ko;
    } else {
      this.confirmModalData = this.confirmModalData_en;
    }
    this.isConfirmModalVisible = true;
  }

  confirmModalCancel() {
    this.isConfirmModalVisible = false;
  }

  confirmModalOk() {
    this.feedService.deleteBookmarkAll(this.user.id).subscribe((v) => {});
    this.feedBookmarkList = [];
    this.isConfirmModalVisible = false;
  }
}
