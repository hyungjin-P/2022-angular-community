import { Tag } from '@schemas/tag';

export class FeedTag {
  constructor(public id: string, public tagId: string, public tagInfo: Tag, public name: string) {
    this.id = id;
    this.tagId = tagId;
    this.tagInfo = tagInfo;
    this.name = name;
  }
}
