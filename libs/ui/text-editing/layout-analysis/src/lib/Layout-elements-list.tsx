import Stack from '@mui/material/Stack';
import {
  selectAllImageElements,
  selectAllTextElements,
  selectManyRegionDataUrlById,
  useAppSelector,
} from '@frontend/shared-ui';
import {
  ImageElementSummary,
  TextElementSummary,
} from './layout-element-summary';

export const LayoutElementsList = () => {
  const imageElements = useAppSelector(selectAllImageElements);
  const textElements = useAppSelector(selectAllTextElements);
  const dataUrls = useAppSelector(
    selectManyRegionDataUrlById(
      [...imageElements, ...textElements].map((i) => i._id)
    )
  );
  return (
    <Stack
      sx={{ flexGrow: 1, mt: '5px', width: '100%', overflowY: 'scroll' }}
      direction="row"
      flexWrap="wrap"
      justifyContent="space-around"
      alignItems="flex-start"
      spacing={1}
    >
      {textElements.map((el) => (
        <TextElementSummary key={el._id} {...el} url={dataUrls[el._id]} />
      ))}
      {imageElements.map((el) => (
        <ImageElementSummary key={el._id} {...el} url={dataUrls[el._id]} />
      ))}
    </Stack>
  );
};
