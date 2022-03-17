import { Element } from 'slate';
import { AppDispatch, replaceLinesTokens } from '@frontend/shared-ui';
import { IToken } from '@frontend/domain';

export function saveEditorValueToStore(
  value: Element[],
  tokenToLineIdMap: Record<string, IToken[]>,
  dispatch: AppDispatch
) {
  console.log(value);
  const payload: { LineId: string; newTokens: IToken[] }[] = [];
  let orderInPageCounter: number = 0;
  for (const { children, id } of value) {
    const update: { LineId: string; newTokens: IToken[] } = {
      LineId: id,
      newTokens: [],
    };

    for (const { text, state } of children) {
      const tokens = text
        .trim()
        .split(/\s+/)
        .filter((t) => t.length !== 0);
      let orderInLineCounter: number = 0;
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
      update.newTokens.length !== 0 &&
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
  dispatch(replaceLinesTokens(payload));
}

// قد ركب فيها لصيانة نفسها وتباعدت عنه وقد جمعتكم
// لهذا الأمر لأنّكم أسري ومكان سرّي وموضع معرفتي وبكم أعتضد
