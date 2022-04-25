/* tslint:disable */
/* eslint-disable */
/**
*/
export class BookUnit {
  free(): void;
}
/**
*/
export class EditionCellData {
  free(): void;
/**
* @returns {string}
*/
  get_key(): string;
/**
* @returns {number}
*/
  get_token_count(): number;
/**
* @returns {number}
*/
  get_unit_idx(): number;
/**
* @returns {number}
*/
  get_manuscript_idx(): number;
}
/**
*/
export class EditionStore {
  free(): void;
/**
* @param {any} data
* @returns {EditionStore}
*/
  static load(data: any): EditionStore;
/**
* @returns {string}
*/
  get_name(): string;
/**
* @returns {string}
*/
  get_id(): string;
/**
* @returns {number}
*/
  get_no_manuscripts(): number;
/**
* @param {number} idx
* @returns {string}
*/
  get_ms_siglum(idx: number): string;
/**
* @returns {number}
*/
  get_no_book_units(): number;
/**
* @param {number} index
* @returns {string}
*/
  get_book_unit_display_title(index: number): string;
/**
* @param {number} index
* @returns {string}
*/
  get_book_unit_id(index: number): string;
/**
* @param {string} unit_id
* @param {number} manuscript_idx
* @returns {EditionCellData}
*/
  get_cell(unit_id: string, manuscript_idx: number): EditionCellData;
/**
* @param {number} unit_idx
* @param {number} manuscript_idx
* @param {number} token_idx
* @returns {string}
*/
  get_token(unit_idx: number, manuscript_idx: number, token_idx: number): string;
/**
* @param {string} file
* @param {number} manuscript_idx
* @param {number} page_number
*/
  static store_image_data(file: string, manuscript_idx: number, page_number: number): void;
}
/**
*/
export class Facsimile {
  free(): void;
}
/**
*/
export class ImageStore {
  free(): void;
/**
* @returns {ImageStore}
*/
  static new(): ImageStore;
}
/**
*/
export class Line {
  free(): void;
}
/**
*/
export class Manuscript {
  free(): void;
}
/**
*/
export class Point {
  free(): void;
}
/**
*/
export class Region {
  free(): void;
}
/**
*/
export class Unit {
  free(): void;
}
