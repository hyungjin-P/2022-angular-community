export class MagazineBody {
  constructor(public id: string, public magazineId: string, public title: string, public body: string) {
    this.id = id;
    this.magazineId = magazineId;
    this.title = title;
    this.body = body;
  }
}
