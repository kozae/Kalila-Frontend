import { IFacsimileRegion, ILine, IToken } from '@frontend/domain';

export type requestType =
  | 'postLayoutImages'
  | 'postLayoutTextElements'
  | 'deleteLayoutImages'
  | 'deleteLayoutTextElements'
  | 'putTextElements'
  | 'putImages'
  | 'postLines'
  | 'putLines'
  | 'deleteLines'
  | 'postTokens';

export type TextEditingActiveWorkspace =
  | 'description'
  | 'transcription'
  | 'layout'
  | 'lines'
  | 'segmentation';

export type TextEditingAccessMode = 'view' | 'edit';

export interface ITextEditingPageState {
  accessMode: TextEditingAccessMode;
  activeWorkspace: TextEditingActiveWorkspace;
  regionHoveredInToolSpace: (IFacsimileRegion & { Id: string }) | null;
  regionHoveredInFacsimileSpace: (IFacsimileRegion & { Id: string }) | null;
  selectedElementId: string | null;
  regionUnderEditPolygon: IFacsimileRegion | null;
  regionUnderEditUrl: string | null;
  deleteLayoutImages: string[];
  deleteLayoutTextElements: string[];
  deleteLines: { ElementId: string; Lines: string[] }[];
  postLayoutImages: string[];
  postLayoutTextElements: string[];
  postLines: { ElementId: string; Lines: string[] }[];
  postTokens: {
    ElementId: string;
    LineId: string;
    Tokens: string[];
  }[];
  putImages: string[];
  putLines: string[];
  putTextElements: string[];
}
