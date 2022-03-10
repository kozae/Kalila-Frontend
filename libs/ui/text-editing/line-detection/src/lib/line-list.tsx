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

export const LineList = () => {
  const textElements = useAppSelector(selectAllTextElements);
  const lines = useAppSelector(selectAllLines);
  const urls = useAppSelector((state) =>
    selectManyRegionDataUrlById(state, [
      ...textElements.map((el) => el._id),
      ...lines.map((l) => l._id),
    ])
  );
  const elementSummaries: ILayoutElementSummaryProps[] = orderBy(
    textElements.map((el) => ({
      ...el,
      url: urls[el._id],
      icon: 'text',
      maxHeight: '5vh',
      width: '90%',
      buttons: false,
      color: kalilaTheme.palette.secondary.dark,
    })),
    'Order'
  );
  const linesOfElement = (id: string) =>
    lines.filter((l) => l.ElementId === id);
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
        {elementSummaries.map((el, index) => (
          <LayoutElementSummary key={el._id} {...el}>
            <Stack
              sx={{
                width: '100%',
              }}
              alignItems="center"
              spacing={1}
            >
              <Divider />
              {linesOfElement(el._id).map((l) => (
                <LineSummary
                  key={l._id}
                  url={urls[l._id]}
                  line={l}
                  maxHeight="5vh"
                />
              ))}
            </Stack>
          </LayoutElementSummary>
        ))}
      </Stack>
    </Stack>
  );
};
