export class Tag {
  constructor(
    public id: string,
    public nameKo: string,
    public nameEn: string,
    public feedCount: number,
    public magazineCount: number
  ) {
    this.id = id;
    this.nameKo = nameKo;
    this.nameEn = nameEn;
    this.feedCount = feedCount;
    this.magazineCount = magazineCount;
  }
}
