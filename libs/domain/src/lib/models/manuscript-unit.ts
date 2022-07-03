export interface IUnitSummary {
  Id: string;
  BookUnitId: string;
  BookUnit: string;
  BookUnitOrder: number;
  Chapter: string;
  Type: string;
  Start: [number, number, number];
  End: [number, number, number];
}
