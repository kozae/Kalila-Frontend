import { EditionCell } from './edition-cell';
import { EditionCellData } from '../store';
import { range } from 'lodash';

export interface IEditionRowProps {
  manuscripts: number;
  data: EditionCellData[];
}

export const EditionRow = ({ manuscripts, data }: IEditionRowProps) => {
  return (
    <>
      {range(manuscripts)
        .map((manuscriptIndex) => data[manuscriptIndex])
        .map((cellData, index) => (
          <EditionCell
            key={index}
            bgcolor={index % 2 ? 'white' : '#F1F1F1'}
            data={cellData}
          />
        ))}
    </>
  );
};
