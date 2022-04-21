import { Feed } from '@schemas/feed';

export class FeedBookmark {
  constructor(public id: string, public createdAt: string, public feed: Feed) {
    this.id = id;
    this.createdAt = createdAt;
    this.feed = feed;
  }
}
