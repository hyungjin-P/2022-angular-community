import { Tag } from '@schemas/tag';

export class MagazineTag {
  constructor(public id: string, public tagId: string, public nameKo: string, public nameEn: string) {
    this.id = id;
    this.tagId = tagId;
    this.nameKo = nameKo;
    this.nameEn = nameEn;
  }
}
