import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { User } from '@schemas/user';
import { Router } from '@angular/router';
import { StorageService } from '@services/storage.service';
import { UserService } from '@services/user.service';
import { Feed } from '@schemas/feed';
import { FeedLike } from '@schemas/feed-like';
import { OtherUserUtil } from '../../../core/utils/other-user.util';
import { GlobalService } from '@services/global.service';
import { TextService } from '@services/text.service';
import { FollowService } from '@services/follow.service';
import { FeedService } from '@services/feed.service';
import { PublicService } from '@services/public.service';
import { FeedDetailModalComponent } from '@shared/components/feed-detail-modal/feed-detail-modal.component';

declare const $;

@Component({
  selector: 'app-feed-like-user-modal',
  templateUrl: './feed-like-user-modal.component.html',
  styleUrls: ['./feed-like-user-modal.component.scss'],
})
export class FeedLikeUserModalComponent implements OnInit, AfterViewInit {
  variables: any;
  pageDate: string;
  @Input() originFeed: Feed;
  @Input() userId: string;
  user: User;

  @ViewChild('scrollEl') scrollEl: ElementRef;

  feedLikes: Array<FeedLike>;
  likePage: number = 1;
  likeLimit: number = 15;
  likePageMeta: any = {};
  likePageLink: any = {};

  isLoginModalVisible = false;

  feedDetailModal: FeedDetailModalComponent;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private globalService: GlobalService,
    private textService: TextService,
    private userService: UserService,
    private otherUserUtil: OtherUserUtil,
    private feedService: FeedService,
    private publicService: PublicService,
    private followService: FollowService
  ) {
    this.user = this.storageService.getUser();
  }

  ngOnInit(): void {
    this.variables = this.globalService.variables;
  }

  ngAfterViewInit() {
    let timer = null;
    this.scrollEl.nativeElement.addEventListener('scroll', (event) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const scrollHeight = this.scrollEl.nativeElement.scrollHeight;
        const scrollTop = this.scrollEl.nativeElement.scrollTop;
        const per = (scrollTop / scrollHeight) * 100;
        const def = scrollHeight - scrollTop;

        if (def < 1000) {
          this.findNextItemPage();
        }

        if (50 < per) {
          console.log('calc : ', per);
        }
      }, 100);
    });
  }

  onLikeUserModalShow(feed: Feed): void {
    // UTC기준 최초 페이지 접속 시점
    this.pageDate = new Date().toISOString();
    this.originFeed = feed;
    // 임시로 기존에 가지고 있던 좋아요 유저 목록 우선 표시
    this.feedLikes = feed.likeUsers;

    this.likePage = 1;
    if (this.user) {
      this.getFeedLikeList();
    } else {
      this.getPublicFeedLikeList();
    }

    $('#bs-feed-like-user-modal').modal('show');
  }

  onCloseLikeUserModal(): void {
    if (this.isLoginModalVisible) this.loginModalCancel();

    $('#bs-feed-like-user-modal').modal('hide');
  }

  /* 스크롤 시, 리스트 추가 */
  findNextItemPage() {
    if (this.likePageLink?.next) {
      this.likePage = this.likePage + 1;
      if (this.user) {
        this.getFeedLikeList();
      } else {
        this.getPublicFeedLikeList();
      }
    }
  }

  getFeedLikeList() {
    this.feedService
      .getFeedLikeList(this.likePage, this.likeLimit, this.originFeed.id, this.user?.id, this.pageDate)
      .subscribe(
        (likeUserList: any) => {
          this.likePageMeta = likeUserList.meta;
          this.likePageLink = likeUserList.links;
          if (this.likePage > 1) {
            this.feedLikes = [...this.feedLikes, ...likeUserList?.items];
          } else {
            this.feedLikes = likeUserList.items;
          }
        },
        (e) => {}
      );
  }

  getPublicFeedLikeList() {
    this.publicService.getFeedLikeList(this.likePage, this.likeLimit, this.originFeed.id, this.pageDate).subscribe(
      (likeUserList: any) => {
        this.likePageMeta = likeUserList.meta;
        this.likePageLink = likeUserList.links;
        if (this.likePage > 1) {
          this.feedLikes = [...this.feedLikes, ...likeUserList?.items];
        } else {
          this.feedLikes = likeUserList.items;
        }
      },
      (e) => {}
    );
  }

  /* 팔로우 로직 */
  addFollow(fromUser: string, toUser: User) {
    if (this.user) {
      this.followService.addFollow(fromUser, toUser.id).subscribe(
        (v) => {
          toUser.isFollow = true;
          let message = this.textService.getText('follow:001');
          this.globalService.showToast(message);
        },
        (error) => {
          console.log('add follow failed : ', error);
        }
      );
    } else {
      this.showLoginModal();
    }
  }

  removeFollow(fromUser: string, toUser: User) {
    if (this.user) {
      this.followService.removeFollow(fromUser, toUser.id).subscribe(
        () => {
          toUser.isFollow = false;
          let message = this.textService.getText('follow:002');
          this.globalService.showToast(message);
        },
        (error) => {
          console.log('remove follow failed : ', error);
        }
      );
    } else {
      this.showLoginModal();
    }
  }

  /* 로그인 모달창 동작 */
  showLoginModal() {
    this.isLoginModalVisible = true;
  }

  loginModalConfirm() {
    this.isLoginModalVisible = false;
    this.onCloseLikeUserModal();

    if (this.feedDetailModal) {
      this.feedDetailModal.onCloseModal();
      this.feedDetailModal = undefined;
    }

    this.router.navigateByUrl('/auth/login');
  }

  loginModalCancel() {
    this.isLoginModalVisible = false;
  }

  loginModalAnother() {
    this.isLoginModalVisible = false;
    this.onCloseLikeUserModal();

    if (this.feedDetailModal) {
      this.feedDetailModal.onCloseModal();
      this.feedDetailModal = undefined;
    }

    this.router.navigateByUrl('/auth/registration');
  }

  /** 다른 유저 마이페이지 이동 시 로직 */
  moveOtherUserMyPage(user: User, targetUserId): void {
    if (this.feedDetailModal) {
      this.feedDetailModal.onCloseModal();
      this.feedDetailModal = undefined;
    }

    if (!this.user) {
      this.showLoginModal();
      return;
    } else {
      this.onCloseLikeUserModal();
      if (user?.id !== targetUserId) {
        this.otherUserUtil.moveOtherUserMyPage(targetUserId);
        return;
      } else {
        this.otherUserUtil.moveMyPage();
        return;
      }
    }
  }
}
