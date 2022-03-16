import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { IImageElement, ITextElement } from '@frontend/domain';
import { orderBy } from 'lodash';
import { LayoutElementSummary } from '@frontend/ui/text-editing/shared';

export interface ILayoutElementsListProps {
  dataUrls: Record<string, string>;
  textElements: Omit<ITextElement, 'Lines'>[];
  imageElements: IImageElement[];
}

export const LayoutElementsList = ({
  dataUrls,
  textElements,
  imageElements,
}: ILayoutElementsListProps) => {
  const elements = orderBy(
    [
      ...textElements.map((el) => ({
        ...el,
        url: dataUrls[el.Id],
        icon: 'text',
      })),
      ...imageElements.map((el) => ({
        ...el,
        url: dataUrls[el.Id],
        icon: 'image',
      })),
    ],
    'Order'
  );

  return (
    <Stack
      sx={{ flexGrow: 1, mt: '5px', width: '100%' }}
      direction="row"
      flexWrap="wrap"
      justifyContent="space-around"
      alignItems="flex-start"
      spacing={1}
    >
      {elements.length === 0 && (
        <Alert severity="info">No elements defined.</Alert>
      )}
      {elements.map((el) => (
        <LayoutElementSummary buttons={true} key={el.Id} {...el} />
      ))}
    </Stack>
  );
};
