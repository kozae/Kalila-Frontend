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
  pageNumber: number,
  nearestOpenUnit?: IUnitSummary | null
) {
  const items: ILineItem[] = [];
  const unitStartingInLine = units.filter(
    (u) => u.Start[0] === pageNumber && u.Start[1] === lineOrder
  );

  const unitEndingInLine = units.filter(
    (u) => u.End[0] === pageNumber && u.End[1] === lineOrder
  );

  if (lineOrder === 0) {
    const unitFromPrevPage = units.find(
      (u) => u.Start[0] === pageNumber - 1 && u.End[0] === pageNumber
    );
    if (unitFromPrevPage) {
      items.push({
        ...unitFromPrevPage,
        type: 'from previous',
      });
    }
    if (nearestOpenUnit) {
      items.push({
        ...nearestOpenUnit,
        type: 'from previous',
      });
    }
  }
  tokens.forEach((token, i) => {
    const unitStart = unitStartingInLine.find(
      (u) => u.Start[2] === token.OrderInLine
    );
    const unitEnd = unitEndingInLine.find(
      (u) => u.End[2] === token.OrderInLine
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
                u.Start[0] === pageNumber &&
                u.Start[1] === lineOrder + 1 &&
                u.Start[2] === 0
            )
          : units.find(
              (u) =>
                u.Start[0] === pageNumber &&
                u.Start[1] === lineOrder &&
                u.Start[2] === token.OrderInLine + 1
            );
      if (unitAtTheNextToken === undefined) {
        items.push({ ...unitEnd, type: 'end' });
      }
    }
  });
  return items;
}
