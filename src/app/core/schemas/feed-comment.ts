import { User } from './user';
import { FeedCommentMention } from '@schemas/feed-comment-mention';

export class FeedComment {
  constructor(
    public id: string,
    public parentId: string,
    public writer: User,
    public text: string,
    public mentions: FeedCommentMention[],
    public sub_comment_count: number,
    public likeCount: number,
    public isLike: boolean,
    public deletedAt: string,
    public createdAt: string,
    public updatedAt: string,
    public begin_timestamp: number,
    public begin_time_text: string,
    public page: number,
    public limit: number
  ) {
    this.id = id;
    this.parentId = parentId;
    this.writer = writer;
    this.text = text;
    this.sub_comment_count = sub_comment_count;
    this.likeCount = likeCount;
    this.isLike = isLike;
    this.deletedAt = deletedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
