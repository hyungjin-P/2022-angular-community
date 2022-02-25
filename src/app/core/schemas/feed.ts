import {User} from './user'
import {File} from './file'
import {FeedTag} from './feed-tag'

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
    public like: boolean,
    public likeUsers: Array<User>,
    public likeCount: number,
    public commentCount: number,
    public pictureCount: number,
    public writerEmail: string, // join data
    public writerPictureUrl: string, // join data
    public writerNickname: string, // join data
  ) {
    this.id = id
    this.writer = writer
    this.content = content
    this.picture = picture
    this.pictures = pictures
    this.tags = tags
    this.tagsStr = tagsStr
    this.like = like
    this.likeUsers = likeUsers
    this.likeCount = likeCount
    this.commentCount = commentCount
    this.createdAt = createdAt
    this.pictureCount = pictureCount
    this.writerEmail = writerEmail
    this.writerPictureUrl = writerPictureUrl
    this.writerNickname = writerNickname
  }
}
