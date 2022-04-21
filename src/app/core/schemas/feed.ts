import { User } from './user';
import { File } from './file';
import { FeedTag } from './feed-tag';
import { FeedLike } from './feed-like';
import { FeedComment } from '@schemas/feed-comment';

export class Feed {
  constructor(
    public id: string,
    public writer: User,
    public content: string,
    public picture: string,
    public pictures: Array<File>,
    public tags: Array<FeedTag>,
    public tagsStr: string,
    public uploadedAt: string,
    public createdAt: string,
    public likeUsers: Array<FeedLike>,
    public likeCount: number,
    public commentCount: number,
    public pictureCount: number,
    public isLike: boolean,
    public isBookmark: boolean,
    public otherCount: number,
    public exposureUser: User[],
    // 내부 로직 동작을 위함
    public onCheckPopover: boolean = false,
    public begin_timestamp: number,
    public begin_time_text: string,
    public contentViewVisible: boolean,
    public writingUser: User,
    public comments: FeedComment[]
  ) {
    this.id = id;
    this.writer = writer;
    this.content = content;
    this.picture = picture;
    this.pictures = pictures;
    this.tags = tags;
    this.tagsStr = tagsStr;
    this.likeUsers = likeUsers;
    this.likeCount = likeCount;
    this.commentCount = commentCount;
    this.uploadedAt = uploadedAt;
    this.createdAt = createdAt;
    this.pictureCount = pictureCount;
    this.isLike = isLike;
    this.isBookmark = isBookmark;
    this.otherCount = otherCount;
    this.onCheckPopover = onCheckPopover;
    this.exposureUser = exposureUser;
    this.writingUser = writingUser;
    this.comments = comments;
  }
}
