/* tslint:disable */
/* eslint-disable */
/**
*/
export class LineDetector {
  free(): void;
/**
* @param {string} encoded_file
* @returns {LineDetector}
*/
  static new(encoded_file: string): LineDetector;
/**
* @param {Uint32Array} region
* @param {number} thresh
* @param {number} density
* @returns {Uint32Array}
*/
  detect_lines_in_region(region: Uint32Array, thresh: number, density: number): Uint32Array;
}
