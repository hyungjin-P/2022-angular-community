import { User } from '@schemas/user';

export class FeedCommentMention {
  constructor(public id: string, public feedCommentId: string, public mentionUser: User) {
    this.id = id;
    this.feedCommentId = feedCommentId;
    this.mentionUser = mentionUser;
  }
}
