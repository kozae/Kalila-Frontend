import { IToken, IUnitSummary } from '@frontend/domain';

export type IUnitTag = IUnitSummary & {
  type: 'start' | 'end' | 'from previous';
};

export type ILineItem =
  | IUnitTag
  | (IToken & {
      LineId: string;
      type: 'token' | 'block-start' | 'block-end' | 'block-all';
    });

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

  const unitEndingInLine = units.filter(
    (u) => u.EndsInPageNumber === pageNumber && u.EndsInLineNumber === lineOrder
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
    const unitEnd = unitEndingInLine.find(
      (u) => u.LastTokenOrderInLine === token.OrderInLine
    );

    if (unitStart) {
      items.push({ ...unitStart, type: 'start' });
      if (unitEnd === undefined) {
        items.push({ ...token, type: 'block-start' });
      }
    }

    if (unitEnd === undefined && unitStart === undefined) {
      items.push({ ...token, type: 'token' });
    }

    if (unitEnd) {
      if (unitStart) {
        items.push({ ...token, type: 'block-all' });
      } else {
        items.push({ ...token, type: 'block-end' });
      }
      const unitAtTheNextToken =
        i === tokens.length - 1
          ? units.find(
              (u) =>
                u.StartsInPageNumber === pageNumber &&
                u.StartsInLineNumber === lineOrder + 1 &&
                u.FirstTokenOrderInLine === 0
            )
          : units.find(
              (u) =>
                u.StartsInPageNumber === pageNumber &&
                u.StartsInLineNumber === lineOrder &&
                u.FirstTokenOrderInLine === token.OrderInLine + 1
            );
      if (unitAtTheNextToken === undefined) {
        items.push({ ...unitEnd, type: 'end' });
      }
    }
  });
  return items;
}
