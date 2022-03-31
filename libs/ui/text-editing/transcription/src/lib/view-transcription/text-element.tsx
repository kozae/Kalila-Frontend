import { ILine, ITextElement } from '@frontend/domain';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Line } from './line';

export interface IElementProps {
  element: Omit<ITextElement, 'Lines'>;
  lines: (Omit<ILine, 'Tokens'> & { ElementId: string })[];
  elementType: 'main' | 'other';
}

export const TextElement = ({ element, lines, elementType }: IElementProps) => {
  return (
    <Stack sx={{ width: '100%', mt: '10px' }} alignItems="center">
      <Typography variant="h3">
        {element.Order + 1}. {element.Position}
      </Typography>
      {lines.length === 0 && (
        <Typography>This element does not have any lines defined</Typography>
      )}
      {lines.map((l) => (
        <Line key={l.Id} d={l} elementType={elementType} />
      ))}
    </Stack>
  );
};
