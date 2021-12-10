import { User } from './user'
import { File } from './file'
import { FeedTag } from './feed-tag'

export class Feed {
    constructor(
        public id: string,
        public writer: User,
        public content: string,
        public picture: string,
        public pictures: Array<File>,
        public tags: Array<FeedTag>,
        public tags_str: string,
        public like: boolean,
        public like_users: Array<User>,
        public like_count: number,
        public comment_count: number
    ) {
        this.id = id
        this.writer = writer
        this.content = content
        this.picture = picture
        this.pictures = pictures
        this.tags = tags
        this.tags_str = tags_str
        this.like = like
        this.like_users = like_users
        this.like_count = like_count
        this.comment_count = comment_count
    }
}
