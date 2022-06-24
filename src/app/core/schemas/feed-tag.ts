import { Tag } from '@schemas/tag';

export class FeedTag {
  constructor(public id: string, public name: string, public tagCount: number) {
    this.id = id;
    this.name = name;
    this.tagCount = tagCount;
  }
}
