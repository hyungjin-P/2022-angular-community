import { User } from './user'

export class FeedComment {
    constructor(
        public id: string,
        public writer: User,
        public text: string,
        public deleted_at: string,
        public created_at: string,
        public updated_at: string
    ) {
        this.id = id
        this.writer = writer
        this.text = text
        this.deleted_at = deleted_at
        this.created_at = created_at
        this.updated_at = updated_at
    }
}
