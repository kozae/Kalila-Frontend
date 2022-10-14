export interface IUnitSummary {
  Id: string;
  BookUnitId: string;
  BookUnit: string;
  Order: number[];
  FrameTags: string[];
  Type: string;
  Start: [number, number, number];
  End: [number, number, number];
}
