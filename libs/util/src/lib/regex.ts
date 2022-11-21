export const intRegEx = new RegExp('^[0-9]+$');
export const latinLettersRegex = new RegExp('^[a-zA-Z]+$');
export const arabicLettersRegex = new RegExp('^[\u0621-\u0655\\s]+$');
export const floatRegEx = new RegExp('^[0-9]*\\.?[0-9]?[0-9]?[0-9]?$');
export const numberSearchRegex = new RegExp('[\\d\\.]+');
export const pageAdminPathRegEx = new RegExp(
  '^\\/administration\\/pages\\/[\\w\\d\\?\\=&]+'
);
