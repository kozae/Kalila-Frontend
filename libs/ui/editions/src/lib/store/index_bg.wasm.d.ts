/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function editionstore_build_cell(a: number, b: number, c: number): number;
export function editioncelldata_get_token_count(a: number): number;
export function editioncelldata_get_unit_idx(a: number, b: number): void;
export function editioncelldata_get_manuscript_idx(a: number): number;
export function editioncelldata_get_unit_order(a: number): number;
export function editioncelldata_get_token(a: number, b: number, c: number): void;
export function editionstore_load(a: number, b: number): void;
export function editionstore_get_name(a: number, b: number): void;
export function editionstore_get_id(a: number, b: number): void;
export function editionstore_get_no_manuscripts(a: number): number;
export function editionstore_get_ms_siglum(a: number, b: number, c: number): void;
export function editionstore_get_no_rows(a: number): number;
export function editionstore_build_row(a: number, b: number): number;
export function editionstore_get_row_index(a: number, b: number, c: number, d: number): void;
export function editionrowtitle_get_display(a: number, b: number): void;
export function editionrowtitle_update_row(a: number, b: number, c: number, d: number, e: number, f: number): number;
export function __wbg_editioncelldata_free(a: number): void;
export function __wbg_editionrowtitle_free(a: number): void;
export function __wbg_editionstore_free(a: number): void;
export function __wbindgen_malloc(a: number): number;
export function __wbindgen_realloc(a: number, b: number, c: number): number;
export function __wbindgen_add_to_stack_pointer(a: number): number;
export function __wbindgen_free(a: number, b: number): void;
