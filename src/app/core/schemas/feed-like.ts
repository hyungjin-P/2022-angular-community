import { User } from '@schemas/user';

export class FeedLike {
  constructor(public feedId: string, public userId: string, public user: User, public createdAt: string) {
    this.feedId = feedId;
    this.userId = userId;
    this.user = user;
    this.createdAt = createdAt;
  }
}
