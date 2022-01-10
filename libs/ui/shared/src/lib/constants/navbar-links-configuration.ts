export interface INavbarLink {
  Name: string,
  Link: string
}

export interface INavbarLinksConfiguration {
  UserLinks: INavbarLink[],
  AdminLinks: INavbarLink[],
}

export const NavbarLinksConfiguration: INavbarLinksConfiguration = {
  "UserLinks": [
    {
      "Name": "Editions",
      "Link": "editions"
    },
    {
      "Name": "Manuscript Description",
      "Link": "activity/ManuscriptDescription"
    },
    {
      "Name": "Page Description",
      "Link": "activity/PageDescription"
    },
    {
      "Name": "Text Analysis",
      "Link": "activity/TextAnalysis"
    },
    {
      "Name": "Image Cycle Analysis",
      "Link": "activity/ImageCycleAnalysis"
    },
    {
      "Name": "Intertextuality Analysis",
      "Link": "activity/IntertextualityAnalysis"
    },
    {
      "Name": "Visualizations",
      "Link": "visualizations"
    },
    {
      "Name": "Account settings",
      "Link": "account"
    }
  ],
  "AdminLinks": [
    {
      "Name": "Administration",
      "Link": "administration"
    }
  ]
}
