import Stack from '@mui/material/Stack';
import { LineToolCommandBar } from './line-tool-command-bar';
import {
  kalilaTheme,
  selectAllLines,
  selectAllTextElements,
  selectManyRegionDataUrlById,
  useAppSelector,
} from '@frontend/shared-ui';
import {
  ILayoutElementSummaryProps,
  LayoutElementSummary,
} from '@frontend/ui/text-editing/shared';
import { orderBy } from 'lodash';
import { LineSummary } from './line-summary';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export const LineList = () => {
  const textElements = useAppSelector(selectAllTextElements);
  const lines = useAppSelector(selectAllLines);
  const urls = useAppSelector((state) =>
    selectManyRegionDataUrlById(state, [
      ...textElements.map((el) => el.Id),
      ...lines.map((l) => l.Id),
    ])
  );
  const elementSummaries: ILayoutElementSummaryProps[] = orderBy(
    textElements.map((el) => ({
      ...el,
      url: urls[el.Id],
      icon: 'text',
      maxHeight: '5vh',
      width: '90%',
      buttons: false,
      color: kalilaTheme.palette.secondary.dark,
    })),
    'Order'
  );

  const mainBodyElements = elementSummaries
    .filter((el) => el.Position.startsWith('main'))
    .map((el, i) => ({ ...el, Order: i }));

  const otherElements = elementSummaries
    .filter((el) => !el.Position.startsWith('main'))
    .map((el, i) => ({ ...el, Order: i }));

  const linesOfElement = (id: string) =>
    orderBy(
      lines.filter((l) => l.ElementId === id),
      'LineOrder'
    );

  const createElementLineList = (el: ILayoutElementSummaryProps) => {
    const presentLines = linesOfElement(el.Id);
    const title =
      presentLines.length === 0
        ? 'no lines'
        : presentLines.length > 1
        ? `[${presentLines.length} lines]`
        : '[one line]';
    return (
      <LayoutElementSummary key={el.Id} {...el} title={title}>
        <Stack
          sx={{
            width: '100%',
          }}
          alignItems="center"
          spacing={1}
        >
          <Divider />
          {presentLines.length === 0 && (
            <Typography variant="button">
              No lines defined in this element
            </Typography>
          )}
          {presentLines.map((l) => (
            <LineSummary
              buttons={true}
              key={l.Id}
              url={urls[l.Id]}
              line={l}
              maxHeight="5vh"
            />
          ))}
        </Stack>
      </LayoutElementSummary>
    );
  };

  return (
    <Stack
      sx={{
        mt: '5px',
        width: '100%',
        height: '100%',
        bgcolor: '#DDDDDD',
        overflowY: 'scroll',
      }}
    >
      <LineToolCommandBar />
      <Stack
        sx={{
          flexGrow: 1,
          width: '100',
          height: 'fit-content',
          bgcolor: '#DDDDDD',
        }}
        alignItems="center"
      >
        <Box sx={{ pt: '5px' }}>
          <Typography variant="h2">
            Main text, {mainBodyElements.length}
            {mainBodyElements.length > 1 ? ' elements' : ' element'}
          </Typography>
        </Box>
        {mainBodyElements.map(createElementLineList)}
        <Box sx={{ pt: '5px' }}>
          <Typography variant="h2">
            Glosses, legends, and marginalia, {otherElements.length}
            {otherElements.length > 1 ? ' elements' : ' element'}
          </Typography>
        </Box>
        {otherElements.map(createElementLineList)}
      </Stack>
    </Stack>
  );
};
