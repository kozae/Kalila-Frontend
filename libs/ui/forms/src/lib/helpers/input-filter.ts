import { intRegEx, stringHasValue } from '@frontend/util';

export function filterNonInteger(e: any, onChange: (e: any) => void) {
  if (!stringHasValue(e.target.value) || intRegEx.test(e.target.value)) {
    onChange(e);
  }
}
