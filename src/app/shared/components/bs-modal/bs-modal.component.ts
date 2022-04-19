import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';
import {Feed} from "@schemas/feed";
import {FeedComment} from "@schemas/feed-comment";
import {FeedService} from "@services/feed.service";
import {DateUtils} from "../../../core/utils/date.utils";
import {User} from "@schemas/user";
import {StorageService} from "@services/storage.service";

declare const $;

@Component({
  selector: 'app-bs-modal',
  templateUrl: './bs-modal.component.html',
  styleUrls: ['./bs-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BsModalComponent implements OnInit, AfterViewInit {

  @Input() originFeed: Feed;

  @Output() modalShow = new EventEmitter();

  feedComments: FeedComment[];

  sortedComments: any[] = [];

  hasCommentingMention: boolean = false;

  selectedMentionUser: User;

  selectedComment: any;

  loginUser: User;

  writingComment: string = '';

  constructor(
    private feedService: FeedService,
    private dateUtils: DateUtils,
    private renderer: Renderer2,
    private storageService: StorageService,
  ) {
    this.loginUser = this.storageService.getUser();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  closeModal(): void {
    $('#bs-comment-modal').modal('hide');
    setTimeout(() => {
      this.sortedComments = [];
    }, 1000);

  }

  onModalShow(feed: Feed): void {
    $('#bs-comment-modal').modal('show');

    this.originFeed = feed;

    this.findFeedComments(feed.id);

  }

  findFeedComments(feedId: string): void {
    this.feedService
      .findFeedCommentsWithRelations(feedId)
      .subscribe((feedComments) => {
        if (feedComments) {
          this.feedComments = feedComments;
          this.setSortedComments(feedComments);
        }
      });
  }

  setSortedComments(feedComments: FeedComment[]): void {
    // 1 depth
    this.sortedComments =
      feedComments.filter(feedComment => feedComment.parentId === null);

    // 2 depth
    this.sortedComments.forEach(parent => {
      parent.children = feedComments
        .filter(feedComment => feedComment.parentId === parent.id);
    });
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

    this.onShowCommentMention();

    this.renderer.selectRootElement('#bs-writing-comment').focus();
  }

  // ~ 에게 댓글 남기는 중 메세지 보이기
  onShowCommentMention(): void {
    this.hasCommentingMention = true;
  }

  // ~ 에게 댓글 남기는 중 메세지 숨기기
  onHiddenCommentMention(): void {
    this.selectedMentionUser = null;
    this.selectedComment = null;
    this.hasCommentingMention = false;
  }

  // 최근에 남긴 게시물인지 여부
  isNewComment(date): boolean {
    const timeStamp = this.dateUtils.getTimeStamp(date);
    return timeStamp / 1000 >= 60 * 60 && timeStamp / 1000 < 60 * 60 * 24;
  }

  // 좋아요 눌렀는지 여부
  isCommentLike(commentLikes: any[], compareId: string): boolean {
    return commentLikes.filter(like => like.userId === compareId).length > 0;
  }

  createComment(): void {

    const params: any = {
      feedId: this.originFeed.id,
      userId: this.loginUser.id,
      text: this.writingComment,
    };

    if (this.selectedComment?.id) {
      params.parentId = this.selectedComment.id;
    }

    this.feedService
      .createFeedComment({...params})
      .subscribe((comment) => {

        if (params.parentId) {
          const mention = {
            feedCommentId: comment.id,
            mentionUserId: this.selectedMentionUser.id
          };

          this.feedService
            .addFeedCommentMention({...mention})
            .subscribe(mention => {
              this.findFeedComments(this.originFeed.id);
              this.onHiddenCommentMention();
            });
        } else {
          this.findFeedComments(this.originFeed.id);
          this.onHiddenCommentMention();
        }
        this.writingComment = '';
      });

  }

}
