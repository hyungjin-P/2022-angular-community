import { User } from '@schemas/user';
import { MagazineBody } from '@schemas/magazineBody';
import { MagazineTag } from '@schemas/magazine-tag';

export class Magazine {
  constructor(
    public id: string,
    public writer: User,
    public category: string,
    public en: MagazineBody,
    public ko: MagazineBody,
    public picture: string,
    public tags: MagazineTag[],
    public tagsStr: string,
    public createdAt: string,
    public likeCount: number,
    public isLike: boolean,
    public isBookmark: boolean,
    public viewCount: number,
    public body: MagazineBody
  ) {
    this.id = id;
    this.writer = writer;
    this.category = category;
    this.en = en;
    this.ko = ko;
    this.picture = picture;
    this.tags = tags;
    this.createdAt = createdAt;
    this.likeCount = likeCount;
    this.isLike = isLike;
    this.isBookmark = isBookmark;
    this.viewCount = viewCount;
  }
}
