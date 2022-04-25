import { EditionCell } from './edition-cell';
import { EditionStore } from '../store';
import { range } from 'lodash';

export interface IEditionRowProps {
  manuscripts: number;
  unitId: string;
  unitIdx: number;
  store: EditionStore;
}

export const EditionRow = ({
  manuscripts,
  unitId,
  unitIdx,
  store,
}: IEditionRowProps) => {
  return (
    <>
      {range(manuscripts)
        .map((manuscriptIndex) => store.get_cell(unitId, manuscriptIndex))
        .map((cellData, index) => (
          <EditionCell
            key={cellData.get_key()}
            bgcolor={
              index % 2
                ? unitIdx % 2 === 0
                  ? 'white'
                  : '#F1F1F1'
                : unitIdx % 2
                ? 'white'
                : '#F1F1F1'
            }
            data={cellData}
            store={store}
            width="200px"
          />
        ))}
    </>
  );
};
