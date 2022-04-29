import { floatRegEx, intRegEx, stringHasValue } from '@frontend/util';

export function filterNonInteger(e: any, onChange: (e: any) => void) {
  if (!stringHasValue(e.target.value) || intRegEx.test(e.target.value)) {
    onChange(e);
  }
}

export function filterNonFloat(e: any, onChange: (e: any) => void) {
  if (!stringHasValue(e.target.value) || floatRegEx.test(e.target.value)) {
    onChange(e);
  }
}
