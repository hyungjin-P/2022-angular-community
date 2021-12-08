import { User } from './user'
import { File } from './file'
import { FeedTag } from './feed-tag'

export class Feed {
    constructor(
        public id: string,
        public writer: User,
        public content: string,
        public pictures: Array<File>,
        public tags: Array<FeedTag>,
        public like: boolean,
        public like_count: number,
        public comment_count: number
    ) {
        this.id = id
        this.writer = writer
        this.content = content
        this.pictures = pictures
        this.tags = tags
        this.like = like
        this.like_count = like_count
        this.comment_count = comment_count
    }
}
