import { IEdition, IEditionBookUnit, IEditionUnit } from '@frontend/domain';
import { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import { EditionRow } from './edition-row';
import { flatten } from 'lodash';

export interface IEditionPageProps {
  edition: IEdition;
}

export const EditionPage = ({ edition }: IEditionPageProps) => {
  const getUnits = useCallback(
    (bu: IEditionBookUnit) => {
      const units: {
        id: string;
        manuscriptId: string;
        siglum: string;
        tokens: string[];
      }[] = [];

      edition.Manuscripts.forEach((m) => {
        const unit = m.Units.find((u) => u.BuID === bu.Id) as IEditionUnit;
        if (unit) {
          const tokens = m.Text.filter(
            (page) => page.PageNumber >= unit.SP && page.PageNumber <= unit.EP
          ).map((page) => {
            if (unit.EP !== unit.SP) {
              if (page.PageNumber !== unit.EP && page.PageNumber !== unit.SP) {
                return flatten(page.Lines) as string[];
              }
              if (page.PageNumber === unit.EP) {
                return flatten(page.Lines.slice(0, unit.EL)) as string[];
              }
              if (page.PageNumber === unit.SP) {
                return flatten(page.Lines.slice(unit.SL)) as string[];
              }
            }
            return flatten(page.Lines.slice(unit.SL, unit.EL)) as string[];
          });

          units.push({
            id: unit.Id,
            manuscriptId: m.Id,
            siglum: m.Siglum,
            tokens: flatten(tokens),
          });
        } else {
          units.push({
            id: 'missing',
            manuscriptId: m.Id,
            siglum: m.Siglum,
            tokens: [],
          });
        }
      });

      return units;
    },
    [edition]
  );
  return (
    <Stack sx={{ width: '100%', height: 'calc(100vh - 110px)' }}>
      <Stack
        sx={{
          maxWidth: '100%',
          maxHeight: '100%',
          overflowX: 'scroll',
          overflowY: 'scroll',
          width: 'fit-content',
          height: 'fit-content',
        }}
        justifyContent={'flex-start'}
        alignItems={'flex-start'}
      >
        {edition.BookUnits.map((bu) => (
          <EditionRow key={bu.Id} bookUnit={bu} units={getUnits(bu)} />
        ))}
      </Stack>
    </Stack>
  );
};
