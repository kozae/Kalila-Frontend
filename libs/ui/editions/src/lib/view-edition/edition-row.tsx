import { IEditionBookUnit } from '@frontend/domain';
import { EditionCell } from './edition-cell';

export interface IEditionRowProps {
  bookUnit: IEditionBookUnit;
  units: {
    id: string;
    manuscriptId: string;
    siglum: string;
    tokens: string[];
  }[];
}

export const EditionRow = ({ bookUnit, units }: IEditionRowProps) => {
  return (
    <>
      {units.map((u) => (
        <EditionCell
          key={u.manuscriptId}
          tokens={u.tokens}
          unitId={u.id}
          manuscriptId={u.manuscriptId}
          width="200px"
        />
      ))}
    </>
  );
};
