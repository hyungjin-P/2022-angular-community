import { Tag } from '@schemas/tag';

export class FeedTag {
  constructor(public id: string, public name: string) {
    this.id = id;
    this.name = name;
  }
}
