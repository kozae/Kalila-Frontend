import { ITextElement } from './text-element';
import { IImageElement } from './image-element';
import { IUnitSummary } from '../manuscript-unit';
import { IPageDescription } from '../page-description';

export interface IPageTranscriptionInfo extends IPageDescription {
  ManuscriptSiglum: string;
  NearestOpenUnit: IUnitSummary | null;
}

export interface IPageTranscription extends IPageTranscriptionInfo {
  TextElements: ITextElement[];
  ImageElements: IImageElement[];
  Units: IUnitSummary[];
}
