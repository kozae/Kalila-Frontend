export interface IEditionBookUnit {
  Id: string;
  Order: number;
  Title: string;
}

export interface IEditionUnit {
  Id: string;
  BuID: string;
  Type: string;
  SP: number;
  SL: number;
  FT: number;
  EP: number;
  EL: number;
  LT: number;
}

export interface IEditionText {
  Id: string;
  PageNumber: number;
  Lines: string[][];
}

export interface IManuscriptEdition {
  Id: string;
  Siglum: string;
  Units: IEditionUnit[];
  Text: IEditionText[];
}

export interface IEdition {
  Id: string;
  Name: string;
  BookUnits: IEditionBookUnit[];
  Manuscripts: IManuscriptEdition[];
}
