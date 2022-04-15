import { ITextElement } from "./text-element";
import { IImageElement } from "./image-element";
import { IUnitSummary } from "../manuscript-unit";

export interface IPageInfo {
  ManuscriptSiglum: string;
  Editor: string;
  EditionProgress: string;
  AdditionalCommentary: string;
  Id: string;
  ManuscriptId: string;
  Number: number;
  PresentPageNumbering: string[];
  Pagination: number;
  Foliation: string;
  Tags: string[];
  FacsimileImageUrl: string;
  TranscriptionFinalized: boolean;
  Body: string;
  CreatedAt?: Date;
  Version?: Date;
  NearestOpenUnit?: IUnitSummary;
}

export interface IPageTranscription extends IPageInfo {
  TextElements: ITextElement[];
  ImageElements: IImageElement[];
  Units: IUnitSummary[];

}
