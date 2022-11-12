import { FacsimileRegion } from './page-transcription';

export interface IEditionBookUnit {
  Id: string;
  Order: number[];
  NumericOrder: number;
  Title: string;
  DepictingImages?: IEditionImage[];
  FrameTags: string[];
  Divider: boolean;
}

export interface IEditionUnit {
  Id: string;
  BuID: string;
  Order: number;
  Occ: number;
  Type: string;
  Tokens: string[];
  Lemmas: string[];
  States: string[];
  Pages: number[];
  Lines: number[];
  Breaks: number[];
  LocatedImage?: IEditionImage;
}

export interface IEditionFacsimile {
  PageNumber: number;
  Url: string;
  Lines: IEditionLine[];
}

export interface IEditionLine {
  Order: number;
  Region: FacsimileRegion;
}

export interface IEditionImage {
  Location: number[];
  PageNumber: number;
  Legend?: string;
  Region: FacsimileRegion;
}

export interface IEditionImageLegend {
  PageNumber: number;
  Tokens: string[];
  States: string[];
  Region: FacsimileRegion;
}

export interface IManuscriptEdition {
  Id: string;
  Siglum: string;
  Units: IEditionUnit[];
  Lacunae: string[];
  Facsimiles: IEditionFacsimile[];
}

export interface IEdition {
  Id: string;
  Name: string;
  Type: string;
  BookUnits: IEditionBookUnit[];
  Manuscripts: IManuscriptEdition[];
}
