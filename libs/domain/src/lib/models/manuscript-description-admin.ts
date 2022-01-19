export class ManuscriptDescriptionAdmin {
  constructor(
    public Id: string,
    public Siglum: string,
    public Editor: string,
    public EditionProgress: string,
    public CreatedAt: Date,
    public Version: Date
  ) {
  }

}
