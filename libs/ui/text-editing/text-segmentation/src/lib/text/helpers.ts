import { IToken, IUnitSummary } from '@frontend/domain';

export type IUnitTag = IUnitSummary & {
  type: 'start' | 'end' | 'from previous';
};

export type ILineItem =
  | IUnitTag
  | (IToken & { LineId: string; type: 'token' | 'blocking' });

export function getLineItems(
  tokens: (IToken & { LineId: string })[],
  units: IUnitSummary[],
  lineOrder: number,
  pageNumber: number
) {
  const items: ILineItem[] = [];
  const unitStartingInLine = units.filter(
    (u) =>
      u.StartsInPageNumber === pageNumber && u.StartsInLineNumber === lineOrder
  );

  if (lineOrder === 0) {
    const unitFromPrevPage = units.find(
      (u) =>
        u.StartsInPageNumber === pageNumber - 1 &&
        u.EndsInPageNumber === pageNumber
    );
    if (unitFromPrevPage) {
      items.push({
        ...unitFromPrevPage,
        type: 'from previous',
      });
    }
  }
  tokens.forEach((token, i) => {
    const unitStart = unitStartingInLine.find(
      (u) => u.FirstTokenOrderInLine === token.OrderInLine
    );
    if (unitStart) {
      items.push({ ...unitStart, type: 'start' });
      items.push({ ...token, type: 'blocking' });
    } else {
      items.push({ ...token, type: 'token' });
    }

    const unitEnd = units.findIndex(
      (u) =>
        u.EndsInPageNumber == pageNumber &&
        u.EndsInLineNumber === lineOrder &&
        u.LastTokenOrderInLine === token.OrderInLine
    );

    if (unitEnd !== -1 && units[unitEnd + 1] !== undefined) {
      if (
        units[unitEnd].EndsInLineNumber ===
          units[unitEnd + 1].StartsInLineNumber &&
        units[unitEnd].LastTokenOrderInLine !==
          units[unitEnd + 1].FirstTokenOrderInLine - 1
      ) {
        items.push({ ...units[unitEnd], type: 'end' });
      } else if (
        units[unitEnd].EndsInLineNumber !==
          units[unitEnd + 1].StartsInLineNumber &&
        units[unitEnd + 1].FirstTokenOrderInLine !== 0
      ) {
        items.push({ ...units[unitEnd], type: 'end' });
      }
    }
  });
  return items;
}
