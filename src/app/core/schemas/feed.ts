import { User } from './user';
import { File } from './file';
import { FeedTag } from './feed-tag';
import { FeedLike } from './feed-like';

export class Feed {
  constructor(
    public id: string,
    public writer: User,
    public content: string,
    public picture: string,
    public pictures: Array<File>,
    public tags: Array<FeedTag>,
    public tagsStr: string,
    public createdAt: string,
    public likeUsers: Array<FeedLike>,
    public likeCount: number,
    public commentCount: number,
    public pictureCount: number,
    public writerEmail: string, // join data
    public writerPictureUrl: string, // join data
    public writerNickname: string, // join data
    public isLike: boolean,
    public isBookmark: boolean,
    public otherCount: number,
    public exposureUser: User[],
    // 내부 로직 동작을 위함
    public onCheckPopover: boolean = false,
    public begin_timestamp: number,
    public begin_time_text: string,
    public contentViewVisible: boolean,
    public carouselIndex: number,
    public writingUser: User,
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
    this.createdAt = createdAt;
    this.pictureCount = pictureCount;
    this.writerEmail = writerEmail;
    this.writerPictureUrl = writerPictureUrl;
    this.writerNickname = writerNickname;
    this.isLike = isLike;
    this.isBookmark = isBookmark;
    this.otherCount = otherCount;
    this.onCheckPopover = onCheckPopover;
    this.exposureUser = exposureUser;
    this.writingUser = writingUser;
  }
}
