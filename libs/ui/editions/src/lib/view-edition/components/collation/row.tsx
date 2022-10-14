import { range } from 'lodash';
import { useMemo } from 'react';
import { useData, useLayoutData } from '../../contexts';
import { WIDTH_OPTIONS } from '../../constants';
import { Cell } from './cell';

export interface IEditionRowProps {
  unitIdx: number;
}

export const Row = ({ unitIdx }: IEditionRowProps) => {
  const { size } = useLayoutData();
  const { edition } = useData();
  const manuscripts = edition.get_no_manuscripts();
  const width = useMemo(() => `${WIDTH_OPTIONS[size]}px`, [size]);
  return (
    <>
      {range(manuscripts).map((manuscriptIndex) => (
        <Cell
          key={manuscriptIndex}
          style={{
            width,
            p: '5px',
            minHeight: '50px',
            borderRadius: '5px',
            bgcolor: manuscriptIndex % 2 ? 'white' : '#F1F1F1',
          }}
          unitIndex={unitIdx}
          msIndex={manuscriptIndex}
          flexWrap="wrap"
        />
      ))}
    </>
  );
};
