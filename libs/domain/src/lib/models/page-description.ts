import * as Yup from 'yup';

export interface IPageDescription {
  Editor: string;
  EditionProgress: string;
  AdditionalCommentary: string;
  Id: string;
  ManuscriptId: string;
  Number: number;
  PresentPageNumbering: string[];
  Pagination?: number | string;
  Foliation: string;
  Tags: string[];
  FacsimileImageUrl?: string;
  TranscriptionFinalized: boolean;
  Body: string;
  CreatedAt?: Date;
  Version?: Date;
}

export class PageDescription implements IPageDescription {
  Editor: string;
  EditionProgress: string = 'not started';
  AdditionalCommentary: string;
  Number: number;
  PresentPageNumbering: string[];
  Pagination?: number | string;
  Foliation: string;
  Tags: string[];
  FacsimileImageUrl: string;
  TranscriptionFinalized: boolean;
  Body: string;
  CreatedAt: Date | undefined;
  Version: Date | undefined;

  private constructor(public Id: string, public ManuscriptId: string) {}

  static create(Id: string, ManuscriptId: string) {
    return new PageDescription(Id, ManuscriptId);
  }

  withPagination(data: {
    PresentPageNumbering: string[];
    Pagination?: number | string;
    Foliation?: string;
  }) {
    this.PresentPageNumbering = data.PresentPageNumbering;
    this.Pagination = data.Pagination;
    this.Foliation = data.Foliation;
    return this;
  }

  withEditionProgress(editionProgress?: string) {
    this.EditionProgress = editionProgress;
    return this;
  }

  withFacsimileUrl(url?: string) {
    this.FacsimileImageUrl = url;
    return this;
  }

  withEditor(editor: string) {
    this.Editor = editor;
    return this;
  }

  withTags(tags: string[]) {
    this.Tags = tags;
    return this;
  }

  withCommentary(commentary: string) {
    this.AdditionalCommentary = commentary;
    return this;
  }

  validationSchemaFactory(
    attributes: Record<
      'EditionProgress' | 'Tags' | 'PresentPageNumbering',
      string[]
    >
  ) {
    return () =>
      Yup.object().shape({
        EditionProgress: Yup.string()
          .optional()
          .oneOf(attributes['EditionProgress']),
        Foliation: Yup.string().optional(),
        PresentPageNumbering: Yup.array().of(
          Yup.string().oneOf(attributes['PresentPageNumbering'])
        ),
        Tags: Yup.array().of(Yup.string().oneOf(attributes['Tags'])),
        Pagination: Yup.number().integer().positive().optional(),
      });
  }
}
