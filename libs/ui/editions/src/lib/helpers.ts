import { IEdition, IEditionBookUnit, IEditionUnit } from '@frontend/domain';
import { flatten } from 'lodash';

export function getUnits(bu: IEditionBookUnit, edition: IEdition) {
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
            const lines = page.Lines.slice(0, unit.EL + 1);
            lines[lines.length - 1] = lines[lines.length - 1].slice(
              0,
              unit.LT + 1
            );
            return flatten(lines) as string[];
          }
          if (page.PageNumber === unit.SP) {
            const lines = page.Lines.slice(unit.SL);
            lines[0] = lines[0].slice(unit.FT);
            return flatten(lines) as string[];
          }
        }
        if (unit.EL === unit.SL) {
          return page.Lines[unit.EL].slice(unit.FT, unit.LT + 1);
        }

        const lines = page.Lines.slice(unit.SL, unit.EL + 1);
        lines[0] = lines[0].slice(unit.FT);
        lines[lines.length - 1] = lines[lines.length - 1].slice(0, unit.LT + 1);
        return flatten(lines) as string[];
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
}
