export interface IUnitSummary {
  Id: string;
  BookUnitId: string;
  BookUnit: string;
  Order: number[];
  FrameTags: string[];
  Type: string;
  Lacuna?: boolean;
  Start: [number, number, number];
  End: [number, number, number];
}
