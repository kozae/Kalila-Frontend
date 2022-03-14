import {
  selectAllTextElements,
  selectManyRegionDataUrlById,
  useAppSelector,
} from '@frontend/shared-ui';
import {
  ILayoutElementSummaryProps,
  LayoutElementSummary,
} from '@frontend/ui/text-editing/shared';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useLinesGenerator } from './hooks/lines-generator.hook';
import { useFormik } from 'formik';

export const LineGeneration = () => {
  const textElements = useAppSelector(selectAllTextElements);
  const urls = useAppSelector((state) =>
    selectManyRegionDataUrlById(
      state,
      textElements.map((el) => el._id)
    )
  );

  const formik = useFormik({
    initialValues: textElements.reduce((acc: Record<string, number>, el) => {
      acc[el._id] = 1;
      return acc;
    }, {}),
    onSubmit: () => {},
  });

  const elementSummaries: ILayoutElementSummaryProps[] = textElements.map(
    (el) => ({
      ...el,
      url: urls[el._id],
      icon: 'text',
      maxHeight: '10vh',
      width: '80%',
      buttons: false,
    })
  );
  const linesGenerator = useLinesGenerator(textElements);
  return (
    <Stack
      sx={{ width: '100%', maxHeight: '100%' }}
      spacing={1}
      alignItems="center"
    >
      {elementSummaries.map((el, index) => (
        <LayoutElementSummary key={el._id} {...el}>
          <Stack
            sx={{
              m: '10px',
              width: '100%',
            }}
            alignItems="center"
            spacing={1}
          >
            <TextField
              id={el._id}
              name={el._id}
              label="number of lines"
              autoComplete="off"
              value={formik.values[el._id]}
              onChange={formik.handleChange}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
          </Stack>
        </LayoutElementSummary>
      ))}

      <Button
        variant="contained"
        disableElevation
        color="secondary"
        onClick={() => linesGenerator(formik.values)}
      >
        Generate
      </Button>
    </Stack>
  );
};
