import { Magazine } from '@schemas/magazine';

export class MagazineBookmark {
  constructor(public id: string, public createdAt: string, public magazine: Magazine) {
    this.id = id;
    this.createdAt = createdAt;
    this.magazine = magazine;
  }
}
