export const intRegEx = new RegExp('^[0-9]+$');
export const latinLettersRegex = new RegExp('^[a-zA-Z]+$');
export const floatRegEx = new RegExp('^[0-9]*\\.?[0-9]?[0-9]?[0-9]?$');

export const pageAdminPathRegEx = new RegExp(
  '^\\/administration\\/pages\\/[\\w\\d\\?\\=&]+'
);
