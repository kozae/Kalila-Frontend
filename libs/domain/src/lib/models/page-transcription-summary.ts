import {
  KalilaDocument,
  validationFn,
  validationWithParentFn,
} from './kalila-document';
import { IUnitSummary } from './manuscript-unit';

export interface IPageTranscriptionSummary {
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
  CreatedAt: Date;
  Version: Date;
  NumberOfTextElements: number;
  NumberOfLines: number;
  NumberOfImageElements: number;
  NumberOfTokens: number;
  Units: IUnitSummary[];
}

export class PageTranscriptionSummary
  extends KalilaDocument
  implements IPageTranscriptionSummary
{
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
  CreatedAt: Date;
  Version: Date;
  NumberOfTextElements: number;
  NumberOfLines: number;
  NumberOfImageElements: number;
  NumberOfTokens: number;
  Units: IUnitSummary[];

  CreateAdminUpdate(
    oldValue: any,
    mode: 'one' | 'many' | 'filtered'
  ): Promise<any> {
    return Promise.resolve(undefined);
  }

  validationSchemaFactory(
    editors: string[],
    validators: Record<any, validationFn | validationWithParentFn>
  ) {}
}
