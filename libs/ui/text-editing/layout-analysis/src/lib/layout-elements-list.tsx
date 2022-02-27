import Stack from '@mui/material/Stack';
import {
  ImageElementSummary,
  TextElementSummary,
} from './layout-element-summary';
import Alert from '@mui/material/Alert';
import { IImageElement, ITextElement } from '@frontend/domain';

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
  return (
    <Stack
      sx={{ flexGrow: 1, mt: '5px', width: '100%', overflowY: 'scroll' }}
      direction="row"
      flexWrap="wrap"
      justifyContent="space-around"
      alignItems="flex-start"
      spacing={1}
    >
      {textElements.length === 0 && imageElements.length === 0 && (
        <Alert severity="info">No elements defined.</Alert>
      )}
      {textElements.map((el) => (
        <TextElementSummary key={el._id} {...el} url={dataUrls[el._id]} />
      ))}
      {imageElements.map((el) => (
        <ImageElementSummary key={el._id} {...el} url={dataUrls[el._id]} />
      ))}
    </Stack>
  );
};
