import { Element } from 'slate';
import {
  AppDispatch,
  IReplaceLineTokensPayload,
  replaceLinesTokens,
} from '@frontend/shared-ui';
import { IToken } from '@frontend/domain';

export function saveEditorValueToStore(
  value: Element[],
  tokenToLineIdMap: Record<string, IToken[]>,
  dispatch: AppDispatch
) {
  const payload: IReplaceLineTokensPayload[] = [];
  let orderInPageCounter: number = 0;
  for (const { children, id, order } of value) {
    const update: IReplaceLineTokensPayload = {
      LineId: id,
      LineOrder: order,
      newTokens: [],
    };
    let orderInLineCounter: number = 0;
    for (const { text, state } of children) {
      const tokens = text
        .trim()
        .split(/\s+/)
        .filter((t) => t.length > 1);
      for (const token of tokens) {
        update.newTokens.push({
          RawToken: token,
          OrderInPage: orderInPageCounter,
          OrderInLine: orderInLineCounter,
          State: state as string,
          MorphemeType: 'host',
          SpaceFollows: true,
          Id: '',
        });
        orderInPageCounter++;
        orderInLineCounter++;
      }
    }
    if (
      tokenToLineIdMap[id] === undefined ||
      update.newTokens.length !== tokenToLineIdMap[id].length ||
      update.newTokens.some((t, i) => {
        const oldToken = tokenToLineIdMap[id] && tokenToLineIdMap[id][i];
        if (oldToken === undefined) {
          return true;
        }
        return oldToken.RawToken !== t.RawToken || oldToken.State !== t.State;
      })
    ) {
      payload.push(update);
    }
  }
  dispatch(replaceLinesTokens({ data: payload }));
}
