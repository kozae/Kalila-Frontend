/* tslint:disable */
/* eslint-disable */
/**
*/
export class EditionCellData {
  free(): void;
/**
* @returns {number}
*/
  get_token_count(): number;
/**
* @returns {number | undefined}
*/
  get_unit_idx(): number | undefined;
/**
* @returns {number}
*/
  get_manuscript_idx(): number;
/**
* @returns {number}
*/
  get_unit_order(): number;
/**
* @param {number} idx
* @returns {string}
*/
  get_state(idx: number): string;
/**
* @param {number} idx
* @returns {string}
*/
  get_token(idx: number): string;
/**
* @param {any} update
* @returns {string}
*/
  static get_unit(update: any): string;
}
/**
*/
export class EditionRowTitle {
  free(): void;
/**
* @returns {string}
*/
  get_display(): string;
/**
* @param {number} index
* @param {string | undefined} title
* @param {number | undefined} order
* @returns {EditionRowTitle}
*/
  update_row(index: number, title?: string, order?: number): EditionRowTitle;
}
/**
*/
export class EditionStore {
  free(): void;
/**
* @param {number} index
* @returns {EditionRowTitle}
*/
  build_row(index: number): EditionRowTitle;
/**
* @param {string} id
* @returns {number | undefined}
*/
  get_row_index(id: string): number | undefined;
/**
* @param {number} idx
* @returns {EditionStore}
*/
  delete_row(idx: number): EditionStore;
/**
* @param {any} update
* @returns {EditionStore}
*/
  insert_row(update: any): EditionStore;
/**
* @param {number} unit_idx
* @param {number} manuscript_idx
* @returns {EditionCellData}
*/
  build_cell(unit_idx: number, manuscript_idx: number): EditionCellData;
/**
* @param {any} update
* @param {number} manuscript_idx
* @returns {EditionStore}
*/
  update_cells(update: any, manuscript_idx: number): EditionStore;
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
  get_no_rows(): number;
/**
* @param {string} id
* @returns {number | undefined}
*/
  get_manuscript_idx(id: string): number | undefined;
/**
* @param {number} manuscript_idx
* @param {number} page_number
* @returns {boolean}
*/
  is_page_in_edition(manuscript_idx: number, page_number: number): boolean;
}
