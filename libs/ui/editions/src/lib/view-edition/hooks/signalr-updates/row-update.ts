import { Dispatch, SetStateAction, useCallback } from 'react';
import updateImm from 'immutability-helper';
import { EditionRowTitle, EditionStore } from '../../../store';

export function useRowUpdate(
  edition: EditionStore,
  setRows: Dispatch<SetStateAction<EditionRowTitle[]>>
) {
  return useCallback(
    async (id: string, newTitle?: string) => {
      const index = edition.get_row_index(id);
      if (index !== undefined) {
        setRows((rows) =>
          updateImm(rows, {
            [index]: {
              $set: rows[index].update_row(
                index,
                newTitle,
                new Uint16Array([])
              ),
            },
          })
        );
      }
    },
    [edition]
  );
}
