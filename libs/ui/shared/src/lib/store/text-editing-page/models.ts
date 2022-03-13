import {
  IFacsimileRegion,
  IImageElement,
  ILine,
  IPageInfo,
  ITextElement,
  IToken,
  IUnitSummary,
} from '@frontend/domain';

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

export type TextEditingToolMode =
  | 'default'
  | 'reorder'
  | 'generate'
  | 'automatic-detection';

export type TextEditingAccessMode = 'view' | 'edit';

export interface ITextEditingPageState {
  accessMode: TextEditingAccessMode;
  activeWorkspace: TextEditingActiveWorkspace;
  toolMode: TextEditingToolMode;
  regionHoveredInToolSpace: (IFacsimileRegion & { Id: string }) | null;
  regionHoveredInFacsimileSpace: (IFacsimileRegion & { Id: string }) | null;
  selectedElementId: string | null;
  regionUnderEditPolygon: IFacsimileRegion | null;
  pageInfoBeforeChange: IPageInfo;
  textElementsBeforeChanges: Omit<ITextElement, 'Lines'>[];
  imageElementsBeforeChanges: IImageElement[];
  linesBeforeChanges: (Omit<ILine, 'Tokens'> & { ElementId: string })[];
  tokensBeforeChanges: IToken[];
  unitSummariesBeforeChanges: IUnitSummary[];
  regionUnderEditUrl: string | null;
  deleteLayoutImages: string[];
  deleteLayoutTextElements: string[];
  deleteLines: string[];
  moveLines: Record<string, string>; // line id to target element
  postLayoutImages: string[];
  postLayoutTextElements: string[];
  postLines: string[];
  postTokens: string[];
  putImages: string[];
  putLines: string[];
  putTextElements: string[];
}
