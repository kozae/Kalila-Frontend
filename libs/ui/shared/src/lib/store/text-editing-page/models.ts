import {
  FacsimileRegion,
  IImageElement,
  ILine,
  ITextElement,
  IToken,
  IUnitSummary,
} from '@frontend/domain';
import { textEditingPageSlice } from './slice';

export type TextEditingActiveWorkspace =
  | 'description'
  | 'transcription'
  | 'layout'
  | 'lines'
  | 'segmentation'
  | 'image';

export type TextEditingToolMode =
  | 'default'
  | 'edit-description'
  | 'edit-facsimile'
  | 'main-body'
  | 'secondary-text'
  | 'reorder'
  | 'generate'
  | 'automatic-detection';

export type TextEditingAccessMode = 'view' | 'edit' | 'admin';

export interface ITextEditingPageState {
  accessMode: TextEditingAccessMode;
  activeWorkspace: TextEditingActiveWorkspace;
  toolMode: TextEditingToolMode;
  regionHoveredInToolSpace: {
    Region: FacsimileRegion;
    Id: string;
    HighlightColor?: string;
  } | null;
  regionHoveredInFacsimileSpace: {
    Region: FacsimileRegion;
    Id: string;
    HighlightColor?: string;
  } | null;
  selectedElementId: string | null;
  regionUnderEditPolygon: FacsimileRegion | null;
  textElementsBeforeChanges: Omit<ITextElement, 'Lines'>[];
  imageElementsBeforeChanges: IImageElement[];
  linesBeforeChanges: (Omit<ILine, 'Tokens'> & { ElementId: string })[];
  tokensBeforeChanges: (IToken & { LineId: string })[];
  unitSummariesBeforeChanges: IUnitSummary[];
  nearestOpenUnitBeforeChanges: IUnitSummary | null;
  textSegmentationTouched: boolean;
  deleteLacunae: string[];
  regionUnderEditUrl: string | null;
  deleteLayoutImages: string[];
  deleteLayoutTextElements: string[];
  deleteLines: string[];
  moveLines: Record<string, string>; // line id to target element
  postLayoutImages: string[];
  postLayoutTextElements: string[];
  postLines: string[];
  postTokens: string[]; // array of line ids, whose tokens to be replaced
  putImages: string[];
  putLines: string[];
  putTextElements: string[];
  saving: boolean;
}
