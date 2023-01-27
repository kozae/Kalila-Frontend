/* tslint:disable */
/* eslint-disable */
/**
*/
export class EditionCellData {
  free(): void;
/**
* @returns {number | undefined}
*/
  get_located_image_location(): number | undefined;
/**
* @returns {number | undefined}
*/
  get_unit_idx(): number | undefined;
/**
* @returns {number}
*/
  get_manuscript_idx(): number;
/**
* @returns {string}
*/
  get_manuscript_siglum(): string;
/**
* @returns {number}
*/
  get_unit_order(): number;
/**
* @param {number} idx
* @returns {number}
*/
  get_page(idx: number): number;
/**
* @param {number} idx
* @returns {number}
*/
  get_line_number(idx: number): number;
/**
* @returns {Uint32Array}
*/
  get_lines(): Uint32Array;
/**
* @param {number} line_idx
* @returns {any[]}
*/
  get_tokens(line_idx: number): any[];
/**
* @param {number} line_idx
* @returns {Uint32Array}
*/
  get_tokens_indexes(line_idx: number): Uint32Array;
/**
* @returns {Uint16Array}
*/
  get_page_range(): Uint16Array;
/**
* @param {number} line_idx
* @returns {boolean}
*/
  is_first_token(line_idx: number): boolean;
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
* @returns {boolean}
*/
  get_row_has_images(): boolean;
/**
* @returns {Uint16Array}
*/
  get_order(): Uint16Array;
/**
* @returns {boolean}
*/
  get_is_divider(): boolean;
/**
* @param {number} index
* @param {string | undefined} title
* @param {Uint16Array} order
* @returns {EditionRowTitle}
*/
  update_row(index: number, title: string | undefined, order: Uint16Array): EditionRowTitle;
}
/**
*/
export class EditionStore {
  free(): void;
/**
* @param {number} unit_idx
* @param {number} manuscript_idx
* @returns {EditionCellData}
*/
  build_cell(unit_idx: number, manuscript_idx: number): EditionCellData;
/**
* @param {number} manuscript_idx
* @param {Uint32Array} lacunae
* @returns {EditionStore}
*/
  update_ms_lacunae(manuscript_idx: number, lacunae: Uint32Array): EditionStore;
/**
* @param {any} update
* @param {number} manuscript_idx
* @returns {EditionStore}
*/
  update_cells(update: any, manuscript_idx: number): EditionStore;
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
* @param {any} update
* @returns {EditionStore}
*/
  replace_rows(update: any): EditionStore;
/**
* @param {any} data
* @returns {EditionStore}
*/
  static load(data: any): EditionStore;
/**
* @returns {string}
*/
  get_edition_id(): string;
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
* @param {number} idx
* @returns {string}
*/
  get_ms_id(idx: number): string;
/**
* @param {number} idx
* @returns {Int32Array}
*/
  get_ms_unit_presence_array(idx: number): Int32Array;
/**
* @returns {Uint32Array}
*/
  get_dividers(): Uint32Array;
/**
* @param {number} idx
* @returns {Uint8Array}
*/
  get_ms_image_presence_array(idx: number): Uint8Array;
/**
* @returns {string}
*/
  get_ms_sigla(): string;
/**
* @returns {number}
*/
  get_no_rows(): number;
/**
* @param {string} id
* @returns {boolean}
*/
  unit_is_in_edition(id: string): boolean;
/**
* @param {number} numeric_order
* @returns {boolean}
*/
  unit_is_in_range(numeric_order: number): boolean;
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
/**
* @param {number} manuscript_idx
* @param {number} unit_idx
* @returns {boolean}
*/
  is_unit_lacuna(manuscript_idx: number, unit_idx: number): boolean;
/**
* @param {string} key
* @returns {string | undefined}
*/
  get_url(key: string): string | undefined;
/**
* @param {string} key
* @returns {Uint32Array | undefined}
*/
  get_line_region(key: string): Uint32Array | undefined;
/**
* @param {number} ms_idx
* @param {number} unit_idx
* @returns {Uint32Array | undefined}
*/
  get_image_region(ms_idx: number, unit_idx: number): Uint32Array | undefined;
/**
* @param {number} ms_idx
* @param {number} unit_idx
* @returns {Uint32Array | undefined}
*/
  get_image_legend_region(ms_idx: number, unit_idx: number): Uint32Array | undefined;
/**
* @param {number} ms_idx
* @param {number} unit_idx
* @returns {number | undefined}
*/
  get_image_legend_page_number(ms_idx: number, unit_idx: number): number | undefined;
/**
* @param {number} ms_idx
* @param {number} unit_idx
* @returns {number | undefined}
*/
  get_image_legend_token_count(ms_idx: number, unit_idx: number): number | undefined;
/**
* @param {number} ms_idx
* @param {number} unit_idx
* @param {number} token_idx
* @returns {string | undefined}
*/
  get_image_legend_token(ms_idx: number, unit_idx: number, token_idx: number): string | undefined;
/**
* @param {number} ms_idx
* @param {number} unit_idx
* @returns {number | undefined}
*/
  get_unit_image_page_number(ms_idx: number, unit_idx: number): number | undefined;
/**
* @param {number} ms_idx
* @param {number} unit_idx
* @returns {Uint32Array | undefined}
*/
  get_unit_image_region(ms_idx: number, unit_idx: number): Uint32Array | undefined;
/**
* @param {number} ms_idx
* @param {number} unit_idx
* @returns {number | undefined}
*/
  get_unit_image_legend_token_count(ms_idx: number, unit_idx: number): number | undefined;
/**
* @param {number} ms_idx
* @param {number} unit_idx
* @param {number} token_idx
* @returns {string | undefined}
*/
  get_unit_image_legend_token(ms_idx: number, unit_idx: number, token_idx: number): string | undefined;
/**
* @param {number} order
* @returns {number | undefined}
*/
  find_unit_by_order(order: number): number | undefined;
/**
* @param {string} filter
* @returns {Int32Array}
*/
  find_unit_by_title(filter: string): Int32Array;
/**
* @returns {Uint32Array}
*/
  get_page_breaks(): Uint32Array;
/**
* @returns {Uint32Array}
*/
  get_located_images(): Uint32Array;
/**
* @param {string} filter
* @returns {Uint32Array | undefined}
*/
  find_words(filter: string): Uint32Array | undefined;
}
