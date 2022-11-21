import { FacsimileRegion } from './facsimile-region';
import * as Yup from 'yup';

export interface IImageElement {
  Id: string;
  Position: string;
  FacsimileRegion: FacsimileRegion;
  HighlightColor?: string;
  Order: number;
  Location?: number[];
  DepictsUnitId?: string;
  LegendId?: string;
  Motifs?: string[];
  StyleElements?: string[];
}

export class ImageElement implements IImageElement {
  DepictsUnitId?: string;
  FacsimileRegion: FacsimileRegion;
  Id: string;
  LegendId?: string;
  Location: number[];
  Motifs?: string[];
  Order: number;
  Position: string;
  StyleElements?: string[];
  constructor(d: IImageElement) {
    this.Id = d.Id;
    this.FacsimileRegion = d.FacsimileRegion;
    this.DepictsUnitId = d.DepictsUnitId;
    this.LegendId = d.LegendId;
    this.Motifs = d.Motifs ?? [];
    this.Order = d.Order;
    this.Position = d.Position;
    this.StyleElements = d.StyleElements ?? [];
  }

  static validationSchemaFactory(attributes: Record<string, string[]>) {
    return () =>
      Yup.object().shape({
        Motifs: Yup.array().of(Yup.string().oneOf(attributes['Motifs'])),
        StyleElements: Yup.array().of(
          Yup.string().oneOf(attributes['StyleElements'])
        ),
      });
  }
}
