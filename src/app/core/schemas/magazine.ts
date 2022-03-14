import { User } from '@schemas/user';

export class Magazine {
  constructor(
    public id: string,
    public writer: User,
    public category: string,
    public title: string,
    public content: string,
    public picture: string,
    public tagsStr: string,
    public createdAt: string,
    public likeCount: number,
    public writerEmail: string,
    public writerPictureUrl: string,
    public writerNickname: string,
    public isLike: boolean,
    public isBookmark: boolean
  ) {
    this.id = id;
    this.writer = writer;
    this.category = category;
    this.title = title;
    this.content = content;
    this.picture = picture;
    this.tagsStr = tagsStr;
    this.createdAt = createdAt;
    this.likeCount = likeCount;
    this.writerEmail = writerEmail;
    this.writerPictureUrl = writerPictureUrl;
    this.writerNickname = writerNickname;
    this.isLike = isLike;
    this.isBookmark = isBookmark;
  }
}
