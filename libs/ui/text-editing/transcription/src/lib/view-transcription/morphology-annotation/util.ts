import { ISelectedToken } from '../view-transcription';

export type ITokenCounts = Record<
  'main' | 'other',
  Record<number, { count: number; id: string }>
>;

export function getNextTokenUp(
  current: ISelectedToken,
  counts: ITokenCounts
): ISelectedToken {
  if (current.line === undefined || current.token === undefined) {
    return current;
  }
  if (
    current.line === 0 ||
    counts[current.elementType][current.line - 1] === undefined
  ) {
    if (current.elementType === 'main') {
      return { elementType: 'main' };
    } else {
      return {
        token: 0,
        line: Object.keys(counts['main']).length - 1,
        elementType: 'main',
      };
    }
  }
  if (counts[current.elementType][current.line - 1].count <= current.token) {
    return {
      ...current,
      line: current.line - 1,
      token: counts[current.elementType][current.line - 1].count - 1,
    };
  }

  return {
    ...current,
    line: current.line - 1,
  };
}

export function getNextTokenDown(
  current: ISelectedToken,
  counts: ITokenCounts
): ISelectedToken {
  if (current.line === undefined || current.token === undefined) {
    return current;
  }
  if (counts[current.elementType][current.line + 1] === undefined) {
    if (current.elementType === 'main') {
      return { line: 0, token: 0, elementType: 'other' };
    }
    if (current.elementType === 'other') {
      return { elementType: 'main' };
    }
  }
  if (counts[current.elementType][current.line + 1].count <= current.token) {
    return {
      ...current,
      line: current.line + 1,
      token: counts[current.elementType][current.line + 1].count - 1,
    };
  }

  return {
    ...current,
    line: current.line + 1,
  };
}

export function getNextTokenLeft(
  current: ISelectedToken,
  counts: ITokenCounts
): ISelectedToken {
  if (current.line === undefined || current.token === undefined) {
    return current;
  }
  if (current.token === counts[current.elementType][current.line].count - 1) {
    if (current.line === Object.keys(counts[current.elementType]).length - 1) {
      if (current.elementType === 'main') {
        return { line: 0, token: 0, elementType: 'other' };
      }
      if (current.elementType === 'other') {
        return { elementType: 'main' };
      }
    }
    return { ...current, line: current.line + 1, token: 0 };
  }
  return { ...current, token: current.token + 1 };
}

export function getNextTokenRight(
  current: ISelectedToken,
  counts: ITokenCounts
): ISelectedToken {
  if (current.line === undefined || current.token === undefined) {
    return current;
  }
  if (current.token === 0) {
    if (current.line === 0) {
      if (current.elementType === 'main') {
        return { elementType: 'main' };
      } else {
        const line = Object.keys(counts['main']).length - 1;
        const token = counts['main'][line].count - 1;
        return { token, line, elementType: 'main' };
      }
    }
    return {
      ...current,
      line: current.line - 1,
      token: counts[current.elementType][current.line - 1].count - 1,
    };
  }

  return { ...current, token: current.token - 1 };
}
