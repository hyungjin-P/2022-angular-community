import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { Feed } from '@schemas/feed';
import { FeedService } from '@services/feed.service';
import { DateUtils } from '../../../core/utils/date.utils';
import { User } from '@schemas/user';
import { StorageService } from '@services/storage.service';
import { Router } from '@angular/router';
import { GlobalService } from '@services/global.service';
import { TextService } from '@services/text.service';

declare const $;

@Component({
  selector: 'app-feed-comment-modal',
  templateUrl: './feed-comment-modal.component.html',
  styleUrls: ['./feed-comment-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FeedCommentModalComponent implements OnInit, AfterViewInit {
  /* 기준 피드 */
  @Input() originFeed: Feed;

  /* 이벤트 */
  @Output() modalShow = new EventEmitter();

  /* ↓ Components Status */
  feedComments: any[];

  sortedComments: any[] = [];

  hasBottomWritingMessage: boolean = false;

  hasBottomWritingMessageType = 'mention';

  modifyWritingMessage = '댓글을 수정하는 중..';

  selectedMentionUser: User;

  selectedComment: any;

  loginUser: User;

  writingComment: string = '';

  isLoginModalVisible = false;

  isConfirmModalVisible = false;

  confirmModalStatus: string;

  confirmComment: any = {};

  confirmTitleText: string;

  confirmSubTitleText: string;

  constructor(
    private feedService: FeedService,
    private dateUtils: DateUtils,
    private renderer: Renderer2,
    private storageService: StorageService,
    private textService: TextService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private globalService: GlobalService
  ) {
    this.loginUser = this.storageService.getUser();
  }

  ngOnInit(): void {
    $('#bs-comment-modal').on('hidden.bs.modal', (event) => {
      if ($(event.target).attr('id') === 'bs-comment-modal') {
        this.clearData();
      }

      if ($(event.target).attr('id') === 'confirm-modal') {
        this.confirmComment = {};
      }
    });
  }

  ngAfterViewInit(): void {}

  textAreaAutoHeight(): void {
    $('#bs-writing-comment').height($('#bs-writing-comment').prop('scrollHeight') - 40);

    setTimeout(() => {
      const outerHeight = $('.write-comments').outerHeight();
      $('.comment-mention').css('bottom', outerHeight - 4 + 'px');
    }, 100);
  }

  closeModal(): void {
    $('#bs-comment-modal').modal('hide');
  }

  closeConfirmModal(): void {
    $('#confirm-modal').modal('hide');
  }

  loginModalVisible(): void {
    this.isLoginModalVisible = true;
  }

  clearData(): void {
    this.sortedComments = [];
    this.writingComment = '';
    this.selectedComment = {};
    this.selectedMentionUser = null;
    this.hasBottomWritingMessage = false;
    this.feedComments = [];
  }

  onModalShow(feed: Feed): void {
    $('body').css('overflow', 'hidden');
    $('#bs-writing-comment').height(0);
    $('#bs-comment-modal').modal('show');
    this.originFeed = feed;
    this.findFeedComments(feed.id);
    this.modalShow.emit();
  }

  findFeedComments(feedId: string, tagId?: string): void {
    console.log('feedId', feedId);

    this.feedService.findFeedCommentsWithRelations(feedId).subscribe((feedComments) => {
      if (feedComments) {
        this.feedComments = feedComments;
        this.setSortedComments(feedComments, tagId);
      }
    });
  }

  setSortedComments(feedComments: any[], tagId?: string): void {
    // 1 depth
    this.sortedComments = feedComments.filter((feedComment) => feedComment.parentId === null);

    // 2 depth
    this.sortedComments.forEach((parent) => {
      parent.children = feedComments.filter((feedComment) => feedComment.parentId === parent.id);
    });

    if (tagId) {
      setTimeout(() => {
        $('#' + tagId).addClass('show');
      }, 0);
    }
  }

  getFeedTimeText(createdAt: any): string {
    return this.translateDateTime(this.translateTimeStamp(createdAt));
  }

  getTimeText(feedComment: any): string {
    return this.translateDateTime(this.translateTimeStamp(feedComment.createdAt));
  }

  translateTimeStamp(date: string): number {
    return this.dateUtils.getTimeStamp(date);
  }

  translateDateTime(timeStamp: number): string {
    return this.dateUtils.transTimeType(timeStamp);
  }

  onClickWritingComment(writer: User, feedComment: any): void {
    this.selectedMentionUser = writer;
    this.selectedComment = feedComment;
    this.writingComment = '';

    this.onShowCommentMention();

    $('#bs-writing-comment').height(0);

    setTimeout(() => {
      this.textAreaAutoHeight();
    }, 100);

    this.renderer.selectRootElement('#bs-writing-comment').focus();
  }

  // ~ 에게 댓글 남기는 중 메세지 보이기
  onShowCommentMention(type?: string): void {
    this.hasBottomWritingMessage = true;
    this.hasBottomWritingMessageType = type ? type : 'mention';
  }

  // ~ 에게 댓글 남기는 중 메세지 숨기기
  onHiddenBottomMessage(): void {
    this.selectedMentionUser = null;
    this.selectedComment = null;
    this.confirmComment = {};
    this.hasBottomWritingMessage = false;
    this.hasBottomWritingMessageType = 'mention';
    this.writingComment = '';

    setTimeout(() => {
      $('#bs-writing-comment').height(0);
      $('.comment-mention').css('bottom', '68px');
    }, 100);
  }

  // 최근에 남긴 게시물인지 여부
  isNewComment(date): boolean {
    const timeStamp = this.dateUtils.getTimeStamp(date);
    return timeStamp / 1000 >= 60 * 60 && timeStamp / 1000 < 60 * 60 * 24;
  }

  // 좋아요 눌렀는지 여부
  isCommentLike(commentLikes: any[], compareId: string): boolean {
    return commentLikes.filter((like) => like.userId === compareId).length > 0;
  }

  isMyComment(writerId: any, userId): boolean {
    return writerId === userId;
  }

  createCommentAndModify(): void {
    if (!this.loginUser) {
      this.loginModalVisible();
      return;
    }

    // 수정
    if (this.hasBottomWritingMessageType === 'modify') {
      if (this.confirmComment) {
        this.modifyComment(this.confirmComment, this.writingComment);
      }
    } else {
      // 삭제
      this.createComment();
    }
  }

  /* 댓글창 클릭 (댓글 입력 시도) */
  onClickCommentInput() {
    if (!this.loginUser) {
      this.loginModalVisible();
      return;
    }
  }

  /* 댓글 작성 */
  createComment(): void {
    const params: any = {
      feedId: this.originFeed.id,
      userId: this.loginUser.id,
      text: this.writingComment,
    };

    if (this.selectedComment?.id) {
      params.parentId = this.selectedComment.id;
    }

    this.feedService.createFeedComment({ ...params }).subscribe((comment) => {
      if (params.parentId) {
        const mention = {
          feedCommentId: comment.id,
          mentionUserId: this.selectedMentionUser.id,
        };

        this.feedService.addFeedCommentMention({ ...mention }).subscribe((mention) => {
          this.findFeedComments(this.originFeed.id);
          this.onHiddenBottomMessage();
        });
      } else {
        this.findFeedComments(this.originFeed.id);
        this.onHiddenBottomMessage();
      }

      this.writingComment = '';
    });
  }

  /**
   * 좋아요 추가/수정
   * @param feedComment
   * @param userId
   * @param tagId
   */
  toggleLike(feedComment: any, userId: string, tagId?: string): void {
    if (!feedComment || !userId) {
      this.loginModalVisible();
      return;
    }

    const isLike = this.isCommentLike(feedComment?.likes, userId);

    if (!isLike) {
      this.addLikeComment(feedComment, userId, tagId);
    } else {
      this.cancelLikeComment(feedComment, userId, tagId);
    }
  }

  /* 댓글 좋아요 */
  addLikeComment(feedComment, userId: string, tagId?: string): void {
    this.feedService.createFeedCommentLike(feedComment.id, userId).subscribe((data) => {
      this.findFeedComments(this.originFeed.id, tagId);
    });
  }

  /* 댓글 좋아요 취소 */
  cancelLikeComment(feedComment, userId: string, tagId?: string): void {
    this.feedService.deleteFeedCommentLike(feedComment.id, userId).subscribe((data) => {
      this.findFeedComments(this.originFeed.id, tagId);
    });
  }

  onClickModifyComment(feedComment: any, userId: string): void {
    if (feedComment?.writer.id === userId) {
      this.confirmComment = feedComment;
      this.writingComment = feedComment.text;
      this.hasBottomWritingMessageType = 'modify';
      this.hasBottomWritingMessage = true;
      this.renderer.selectRootElement('#bs-writing-comment').focus();

      setTimeout(() => {
        this.textAreaAutoHeight();
      }, 200);
    }
  }

  /* 댓글 수정 */
  modifyComment(feedComment, text): void {
    this.feedService.modifyFeedComment(feedComment.id, text).subscribe((data) => {
      this.findFeedComments(this.originFeed.id);
      this.onHiddenBottomMessage();
      this.writingComment = '';
      let message = this.textService.getText('comment:002');
      this.globalService.showToast(message);
    });
  }

  onConfirmModalShow(data?: any, type?: string): void {
    if (this.confirmComment) {
      this.confirmComment = data;
    }

    if (type) {
      switch (type) {
        case 'delete':
          this.confirmTitleText = '댓글 삭제';
          this.confirmSubTitleText = '정말 삭제 하시겠어요?';
          break;
        case 'modify':
          this.confirmTitleText = '댓글 수정';
          this.confirmSubTitleText = '정말 수정 하시겠어요?';
          break;
      }
    }

    $('#confirm-modal').modal('show');
  }

  onConfirmModalConfirm(): void {
    console.log('this.confirmComment : ', this.confirmComment);

    if (this.confirmComment) {
      this.removeComment(this.confirmComment);
    }
  }

  /* 댓글 삭제 */
  removeComment(feedComment: any): void {
    if (this.loginUser?.id === feedComment.userId) {
      this.feedService.removeFeedComment(feedComment.id).subscribe((data) => {
        this.findFeedComments(this.originFeed.id);
        this.closeConfirmModal();
        let message = this.textService.getText('comment:001');
        this.globalService.showToast(message);
      });
    }
  }

  loginModalConfirm() {
    this.isLoginModalVisible = false;
    this.closeConfirmModal();
    this.closeModal();
    this.router.navigateByUrl('/auth/login').then();
  }

  loginModalCancel() {
    this.isLoginModalVisible = false;
  }

  loginModalAnother() {
    this.isLoginModalVisible = false;
    this.closeConfirmModal();
    this.closeModal();
    this.router.navigateByUrl('/auth/registration').then();
  }

  textAreaResize(textareaId: string): void {}
}
