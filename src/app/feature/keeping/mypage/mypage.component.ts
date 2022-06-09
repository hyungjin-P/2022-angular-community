import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';

import { UserService } from '@services/user.service';
import { FileService } from '@services/file.service';

import { User } from '@schemas/user';
import { File } from '@schemas/file';
import { FollowService } from '@services/follow.service';
import { TextService } from '@services/text.service';
import { FollowViewModalComponent } from '@shared/components/follow-view-modal/follow-view-modal.component';
import { MypageFeedComponent } from './mypage-feed/mypage-feed.component';

@Component({
  selector: 'mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss'],
})
export class MypageComponent implements OnInit, AfterViewInit {
  variables: any;

  user: User;
  ownerUser: User;

  backgroundEditMode: boolean;

  viewType = 'desktop';

  follow: any;

  @ViewChild('scrollEl') scrollEl: ElementRef;

  mypageFeed: MypageFeedComponent;

  isOtherUser: boolean = false;

  @ViewChild('followView') followView: FollowViewModalComponent;

  constructor(
    private router: Router,
    private location: Location,
    private globalService: GlobalService,
    private storageService: StorageService,
    private userService: UserService,
    private fileService: FileService,
    private followService: FollowService,
    private activateRoute: ActivatedRoute,
    private textService: TextService
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

  ngOnInit() {
    this.variables = this.globalService.variables;
    this.user = this.storageService.getUser();
    this.closeDrawer();

    /* url 파라미터에서 해당 마이페이지의 주인(Owner) 특정 */
    this.activateRoute.params.subscribe((params) => {
      if (params.userId === this.user.id) {
        // 나의 마이페이지
        this.ownerUser = this.user;
        this.isOtherUser = false;
        this.countFollow(this.ownerUser.id);
        if (this.mypageFeed) {
          this.mypageFeed.ownerUser = this.ownerUser;
          this.mypageFeed.changeOwner();
        }
      } else {
        // 다른 유저의 마이페이지
        this.userService.getUser(params.userId).subscribe((user) => {
          this.ownerUser = user;
          this.isOtherUser = true;
          this.countFollow(this.ownerUser.id);
          this.isFollowInfo(this.ownerUser.id);
          if (this.mypageFeed) {
            this.mypageFeed.ownerUser = this.ownerUser;
            this.mypageFeed.changeOwner();
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {}

  /* 팔로우 팔로워 수 불러오기 */
  countFollow(userId: string): void {
    this.followService.countFollow(userId).subscribe((follow) => {
      this.follow = follow;
    });
  }

  /* 타 유저 내가 팔로우 했는지 확인 - leftSide */
  isFollowInfo(userId: string) {
    this.followService.getFollowInfo(this.user.id, userId).subscribe((follow) => {
      this.ownerUser.isFollow = follow;
    });
  }

  /* router-outlet active 시, 아래 자식 컴포넌트 가져오기 */
  onActivate(componentRef: any): void {
    if (componentRef?.isFeed) {
      this.mypageFeed = componentRef;
      this.mypageFeed.ownerUser = this.ownerUser;
    }
  }

  goBack(): void {
    window.history.back();
  }

  closeDrawer(): void {
    this.variables.isDrawerOpen = false;
  }

  /**
   * 배경 이미지 교체
   * @param background
   */
  async onChangeFile(background: any): Promise<void> {
    const files: FileList = background.files;

    if (files && files.length === 0) {
      return;
    }

    try {
      let createdFiles: Array<File> = await this.fileService
        .createFile(
          {
            domainName: 'public.keeping.link',
            path: `/users/${this.user.id}/background`,
            tag: 'user-backgrounds',
            userId: this.user.id,
          },
          files
        )
        .toPromise();

      this.user.background = createdFiles.concat(this.user.background);
      this.storageService.setUser(this.user);

      let message = this.textService.getText('myPage:001');
      this.globalService.showToast(message);
      background.value = '';
    } catch (e) {
      this.globalService.showToast(e.message);
    }
  }

  /* 나의 마이페이지에서 배경 편집 활성화 */
  changeBackgroundEditMode(value: boolean): void {
    this.backgroundEditMode = value;
  }

  /* 배경사진 삭제 */
  async deleteBackground(url): Promise<void> {
    try {
      await this.userService.deleteUserBackground(url).toPromise();

      this.changeBackgroundEditMode(false);
      this.user.background = [];
      this.storageService.setUser(this.user);
      let message = this.textService.getText('myPage:002');
      this.globalService.showToast(message);
    } catch (e) {
      this.globalService.showToast(e.message);
    }
  }

  /** 배경사진 변경 */
  async changeBackground(background): Promise<void> {
    const files: FileList = background.files;

    if (files && files.length === 0) {
      return;
    }

    try {
      let createdFiles: Array<File> = await this.fileService
        .createFile(
          {
            domainName: 'public.keeping.link',
            path: `/users/${this.user.id}/background`,
            tag: 'user-background',
            userId: this.user.id,
          },
          files
        )
        .toPromise();

      let oldBackgroundUrl = this.user.background[0]['url'];

      this.user.background = createdFiles;
      this.storageService.setUser(this.user);

      background.value = '';

      await this.userService.deleteUserBackground(oldBackgroundUrl).toPromise();

      this.changeBackgroundEditMode(false);

      let message = this.textService.getText('myPage:001');
      this.globalService.showToast(message);
    } catch (e) {
      this.globalService.showToast(e.message);
    }
  }

  /* 현재 미사용 */
  async logout(): Promise<void> {
    await this.storageService.removeUser();
    this.router.navigateByUrl('/').then(() => {
      let message = this.textService.getText('auth:logout:001');
      this.globalService.showToast(message);
    });
  }

  /* follow-view modal */
  openFollowView(isFollowerTab: boolean): void {
    this.followView.isFollowerTab = isFollowerTab;
    this.followView.userId = this.ownerUser.id;
    this.followView.onFollowViewModalShow();
  }

  /* leftSide 에서 팔로우 버튼 동작 */
  toggleFollow(ownerUser: User) {
    if (ownerUser.isFollow) {
      this.removeFollow(this.user.id, ownerUser);
    } else {
      this.addFollow(this.user.id, ownerUser);
    }
  }

  addFollow(fromUser: string, toUser: User) {
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
  }

  removeFollow(fromUser: string, toUser: User) {
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
  }
}
