export class File {

  constructor(
    public id: string,
    public url: string,
    public originalname: string,
    public mimetype: string,
    public size: number
  ) {
    this.id = id;
    this.url = url;
    this.originalname = originalname;
    this.mimetype = mimetype;
    this.size = size;
  }

}
