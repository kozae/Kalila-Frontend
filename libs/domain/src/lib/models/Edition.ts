import { IUnitSummary } from "@frontend/domain";

export interface ISegmentGroup{
  ManuscriptId: string;
  ManuscriptSiglum: string;
  Segments: IUnitSummary[];
}

export interface IEdition {
  Id: string,
  Name: string,
  SegmentGroups: ISegmentGroup[],
}
