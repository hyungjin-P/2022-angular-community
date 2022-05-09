import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';

import { UserService } from '@services/user.service';
import { FileService } from '@services/file.service';

import { User } from '@schemas/user';
import { File } from '@schemas/file';
import { MypageFeedDetailComponent } from './mypage-feed-detail/mypage-feed-detail.component';
import { FollowService } from '@services/follow.service';
import { TextService } from '@services/text.service';
import { FollowViewModalComponent } from '@shared/components/follow-view-modal/follow-view-modal.component';

@Component({
  selector: 'mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss'],
})
export class MypageComponent implements OnInit, AfterViewInit {
  variables: any;

  user: User;

  isOtherPeople = false;

  backgroundEditMode: boolean;

  viewType = 'desktop';

  follow: any;

  @ViewChild('scrollEl') scrollEl: ElementRef;

  mypageFeedDetail: MypageFeedDetailComponent;

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
    this.countFollow(this.user.id);
    this.closeDrawer();

    this.activateRoute.params.subscribe((params) => {
    });
  }

  ngAfterViewInit(): void {
    let timer = null;
    this.scrollEl.nativeElement.addEventListener('scroll', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const scrollHeight = this.scrollEl.nativeElement.scrollHeight;
        const scrollTop = this.scrollEl.nativeElement.scrollTop;
        const per = (scrollTop / scrollHeight) * 100;
        const def = scrollHeight - scrollTop;

        if (this.mypageFeedDetail) {
          if (def < 1000) {
            this.mypageFeedDetail.findNextPage();
          }
        }
      }, 100);
    });
  }

  countFollow(userId: string): void {
    this.followService.countFollow(userId).subscribe((follow) => {
      this.follow = follow;
    });
  }

  onActivate(componentRef: any): void {
    if (componentRef?.isFeedDetail) {
      this.mypageFeedDetail = componentRef;
    }

    // 다른 유저 구분 첫 페이지에 접근하는 것으로 판단
    if (componentRef?.isFeed) {
      setTimeout(() => {
        if (componentRef.otherUserId) {
          this.isOtherUser = true;
          this.userService.getUser(componentRef.otherUserId).subscribe((user) => {
            this.user = user;
            this.countFollow(this.user.id);
          });
        }
      }, 0);
    }
  }

  goBack() {
    window.history.back();
  }

  closeDrawer() {
    this.variables.isDrawerOpen = false;
  }

  /**
   * 배경 이미지 교체
   * @param background
   */
  async onChangeFile(background: any) {
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

  changeBackgroundEditMode(value: boolean): void {
    this.backgroundEditMode = value;
  }

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
  async changeBackground(background) {
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

  async logout() {
    await this.storageService.removeUser();
    this.router.navigateByUrl('/').then(() => {
      let message = this.textService.getText('auth:logout:001');
      this.globalService.showToast(message);
    });
  }

  openFollowView(): void {
    this.followView.userId = this.user.id;
    this.followView.onFollowViewModalShow();
  }
}
