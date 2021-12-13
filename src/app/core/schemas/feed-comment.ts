import { User } from './user'

export class FeedComment {
    constructor(
        public id: string,
        public parent_id: string,
        public writer: User,
        public text: string,
        public sub_comment_count: number,
        public deleted_at: string,
        public created_at: string,
        public updated_at: string
    ) {
        this.id = id
        this.parent_id = parent_id
        this.writer = writer
        this.text = text
        this.sub_comment_count = sub_comment_count
        this.deleted_at = deleted_at
        this.created_at = created_at
        this.updated_at = updated_at
    }
}
