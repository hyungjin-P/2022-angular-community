import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@schemas/user';
import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';
import { MagazineService } from '@services/magazine.service';
import { Magazine } from '@schemas/magazine';
import { MagazineBookmark } from '@schemas/magazine-bookmark';
import { TextService } from '@services/text.service';

@Component({
  selector: 'app-scrap-magazine',
  templateUrl: './scrap-magazine.component.html',
  styleUrls: ['./scrap-magazine.component.scss'],
})
export class ScrapMagazineComponent implements OnInit {
  variables: any;
  user: User;
  language: any;
  magazineBookmarkList: MagazineBookmark[];
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

  isScrapMagazine = true;

  constructor(
    private router: Router,
    private globalService: GlobalService,
    private storageService: StorageService,
    private textService: TextService,
    private magazineService: MagazineService
  ) {}

  ngOnInit(): void {
    this.variables = this.globalService.variables;
    this.user = this.storageService.getUser();
    this.language = localStorage.getItem('language');

    this.page = 1;
    this.getScrapMagazineList();
  }

  findNextPage() {
    if (this.pageLink?.next) {
      this.page += 1;
      this.getScrapMagazineList();
    }
  }

  getScrapMagazineList() {
    this.magazineService.getScrapMagazineList(this.page, this.limit, this.user.id).subscribe(
      (magazineList) => {
        this.pageMeta = magazineList.meta;
        this.pageLink = magazineList.links;
        if (this.page > 1) {
          this.magazineBookmarkList = [...this.magazineBookmarkList, ...magazineList?.items];
        } else {
          this.magazineBookmarkList = magazineList.items;
        }

        this.totalCount = magazineList.meta.totalCount;
        this.changeBody(this.magazineBookmarkList);
      },
      (e) => {
        // 스크랩 게시물이 없음
        this.magazineBookmarkList = [];
        console.log('Scrap magazine list find failed', e);
      }
    );
  }

  changeBody(magazineList: MagazineBookmark[]) {
    if (this.language === 'ko') {
      magazineList.forEach((v) => {
        v.magazine.body = v.magazine.ko;

        if (v.magazine.tags.length > 0) {
          let tagsStr = '';
          v.magazine.tags.forEach((tag) => {
            tagsStr += '#' + tag.tagInfo.nameKo + ' ';
          });
          v.magazine.tagsStr = tagsStr;
        }
      });
    } else {
      magazineList.forEach((v) => {
        v.magazine.body = v.magazine.en;

        if (v.magazine.tags.length > 0) {
          let tagsStr = '';
          v.magazine.tags.forEach((tag) => {
            tagsStr += '#' + tag.tagInfo.nameEn + ' ';
          });
          v.magazine.tagsStr = tagsStr;
        }
      });
    }
  }

  goRouter(path: string): void {
    this.router.navigateByUrl(path).then();
  }

  toggleBookmark(magazine: Magazine) {
    if (magazine.isBookmark) {
      this.deleteBookmark(magazine);
    } else {
      this.createBookmark(magazine);
    }
  }

  createBookmark(magazine: Magazine) {
    this.magazineService.createBookmark(magazine.id, this.user.id).subscribe(
      (data) => {
        magazine.isBookmark = true;
        let message = this.textService.getText('scrap:001');
        this.globalService.showToast(message);
      },
      (error) => {
        console.error('bookmark add failed: ', error);
      }
    );
  }

  deleteBookmark(magazine: Magazine) {
    this.magazineService.deleteBookmark(magazine.id, this.user.id).subscribe(
      (data) => {
        magazine.isBookmark = false;
        let message = this.textService.getText('scrap:002');
        this.globalService.showToast(message);
      },
      (error) => {
        console.error('bookmark cancel failed: ', error);
      }
    );
  }

  moveMagazineDetail(magazine: Magazine) {
    //조회수 증가
    this.createMagazineView(magazine);
    //링크 이동
    window.location.href = magazine.body.body;
  }

  createMagazineView(magazine: Magazine) {
    this.magazineService.createView(magazine.id, this.user.id).subscribe((v) => {});
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
    this.magazineService.deleteBookmarkAll(this.user.id).subscribe((v) => {});
    this.magazineBookmarkList = [];
    this.isConfirmModalVisible = false;
  }
}
