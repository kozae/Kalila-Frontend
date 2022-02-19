export interface IUnitSummary {
  Id: string;
  BookUnitId: string;
  BookUnit: string;
  BookUnitOrder: number;
  Chapter: string;
  Type: string;
  StartsInPageNumber: number;
  StartsInLineNumber: number;
  FirstTokenOrderInLine: number;
  Order: number;
  EndsInPageNumber: number;
  EndsInLineNumber: number;
  LastTokenOrderInLine: number;
}
