import {AfterViewInit, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {User} from "@schemas/user";
import {UserService} from "@services/user.service";
import {ActivatedRoute} from "@angular/router";
import {StorageService} from "@services/storage.service";
import {FollowService} from "@services/follow.service";
import {GlobalService} from "@services/global.service";

declare const $;

@Component({
  selector: 'app-follow-view-modal',
  templateUrl: './follow-view-modal.component.html',
  styleUrls: ['./follow-view-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FollowViewModalComponent implements OnInit, AfterViewInit {

  @Input() userId: string;
  user: User;
  loginUser: User;

  /** 팔로잉 페이지 */
  followingPage: number = 1;
  followingLimit: number = 1000;
  followingLink: any = {};
  followingMeta: any = {};
  followingList: any[] = [];

  /** 팔로워 페이지 */
  followerPage: number = 1;
  followerLimit: number = 1000;
  followerLink: any = {};
  followerMeta: any = {};
  followerList: any[] = [];

  constructor(
    private router: ActivatedRoute,
    private storageService: StorageService,
    private followService: FollowService,
    private userService: UserService,
    private globalService: GlobalService,
  ) {
    /* 실제 로그인 유저 */
    this.loginUser = this.storageService.getUser();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  onFollowViewModalShow(): void {
    this.initFollowView(this.userId);
    $('#bs-follow-view-modal').modal('show');
  }

  onCloseFollowViewModal(): void {
    $('#bs-follow-view-modal').modal('hide');
  }

  clearData(): void {
    this.followingPage = 1;
    this.followingLimit = 1000;
    this.followingLink = {};
    this.followingMeta = {};
    this.followingList = [];
    this.followerPage = 1;
    this.followerLimit = 1000;
    this.followerLink = {};
    this.followerMeta = {};
    this.followerList = [];
  }

  initFollowView(userId: string): void {
    /* 데이터 클리어 */
    this.clearData();

    /* 팔로우 데이터 조회 */
    this.findUserInfo(userId);
    this.findFollowingList(userId);
    this.findFollowerList(userId);
  }

  findUserInfo(userId: string): void {
    this.userService
      .getUser(userId)
      .subscribe((user) => {
        if (user) {
          this.user = user;
        }
      });
  }

  findFollowingList(userId): void {
    this.followService
      .findFollowingList({
        userId,
        page: this.followingPage,
        limit: this.followingLimit
      })
      .subscribe((data) => {
        this.followingMeta = data.metaInfo.meta;
        this.followingLink = data.metaInfo.links;
        this.followingList = [...this.followingList, ...data?.users];
      });
  }

  findFollowerList(userId): void {
    this.followService
      .findFollowerList({
        userId,
        page: this.followerPage,
        limit: this.followerLimit
      })
      .subscribe((data) => {
        this.followerMeta = data.metaInfo.meta;
        this.followerLink = data.metaInfo.links;
        this.followerList = [...this.followerList, ...data?.users];
      });
  }

  toggleFollow(user: any, fromUserId: string, toUserId, type: string): void {
    if (user.isFollow) {
      this.deleteFollow(user, fromUserId, toUserId, type);
    } else {
      this.addFollow(user, fromUserId, toUserId, type);
    }
  }

  addFollow(user: any, fromUserId: string, toUserId: string, type: string): void {
    this.followService
      .addFollow(fromUserId, toUserId)
      .subscribe(data => {
        user.isFollow = true;
        this.globalService.showToast('팔로잉 되었습니다.');

      });
  }

  deleteFollow(user: any, fromUserId: string, toUserId: string, type: string): void {
    this.followService
      .removeFollow(fromUserId, toUserId)
      .subscribe(data => {
        user.isFollow = false;
        this.globalService.showToast('팔로우를 해제했습니다.');
      });
  }
}
