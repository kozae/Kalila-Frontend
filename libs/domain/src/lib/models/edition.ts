import { IFacsimileRegion } from './page-transcription';

export interface IEditionBookUnit {
  Id: string;
  Order: number;
  Title: string;
}

export interface IEditionUnit {
  Id: string;
  BuID: string;
  Type: string;
  Tokens: string[];
  States: string[];
  Pages: number[];
  Lines: number[];
}

export interface IEditionFacsimile {
  PageNumber: number;
  Url: string;
  Lines: IEditionLine[];
}

export interface IEditionLine {
  Order: number;
  Region: IFacsimileRegion;
}

export interface IManuscriptEdition {
  Id: string;
  Siglum: string;
  Units: IEditionUnit[];
  Facsimiles: IEditionFacsimile[];
}

export interface IEdition {
  Id: string;
  Name: string;
  BookUnits: IEditionBookUnit[];
  Manuscripts: IManuscriptEdition[];
}
