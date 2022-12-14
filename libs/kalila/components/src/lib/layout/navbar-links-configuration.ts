export interface INavbarLink {
  Name: string;
  Ref: string;
}

export interface INavbarLinksConfiguration {
  UserLinks: INavbarLink[];
  AdminLinks: INavbarLink[];
  GuestLinks: INavbarLink[];
  BookUnitTaggerLinks: INavbarLink[];
}

export const NavbarLinksConfiguration: INavbarLinksConfiguration = {
  UserLinks: [
    {
      Name: 'Editions',
      Ref: 'editions',
    },
    {
      Name: 'Text Editing',
      Ref: 'text-editing',
    },
    {
      Name: 'Manuscript Description',
      Ref: 'manuscript-description',
    },

    {
      Name: 'Image Cycle Analysis',
      Ref: 'image-cycle-analysis',
    },
    {
      Name: 'Visualizations',
      Ref: 'visualizations',
    },
  ],
  BookUnitTaggerLinks: [
    {
      Name: 'Book Analysis',
      Ref: 'book-analysis',
    },
  ],
  AdminLinks: [
    {
      Name: 'Administration',
      Ref: 'administration',
    },
  ],
  GuestLinks: [
    {
      Name: 'Editions',
      Ref: 'editions',
    },
  ],
};
