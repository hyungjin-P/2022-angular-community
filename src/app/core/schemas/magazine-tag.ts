import { Tag } from '@schemas/tag';

export class MagazineTag {
  constructor(public id: string, public tagId: string, public tagInfo: Tag) {
    this.id = id;
    this.tagId = tagId;
    this.tagInfo = tagInfo;
  }
}
