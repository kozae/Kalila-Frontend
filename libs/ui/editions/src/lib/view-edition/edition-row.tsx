import { EditionCell } from './edition-cell';
import { EditionCellData } from '../store';
import { range } from 'lodash';
import { useMemo } from 'react';
import { useLayoutOptions } from './contexts';
import { WIDTH_OPTIONS } from './constants';

export interface IEditionRowProps {
  manuscripts: number;
  data: EditionCellData[];
}

export const EditionRow = ({ manuscripts, data }: IEditionRowProps) => {
  const { size } = useLayoutOptions();
  const width = useMemo(() => `${WIDTH_OPTIONS[size]}px`, [size]);
  return (
    <>
      {range(manuscripts)
        .map((manuscriptIndex) => data[manuscriptIndex])
        .map((cellData, index) => (
          <EditionCell
            key={index}
            style={{
              width,
              p: '5px',
              minHeight: '50px',
              borderRadius: '5px',
              bgcolor: index % 2 ? 'white' : '#F1F1F1',
            }}
            data={cellData}
            flexWrap="wrap"
          />
        ))}
    </>
  );
};
