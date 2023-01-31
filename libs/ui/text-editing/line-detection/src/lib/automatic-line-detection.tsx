import Stack from '@mui/material/Stack';
import { useCallback, useEffect, useState } from 'react';
import {
  loadGeneratedLines,
  selectAllTextElements,
  selectPageFacsimileUrl,
  setTextEditingToolMode,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import { useLineDetector } from '@frontend/ui/facsimile-line-detector';
import { useFormik } from 'formik';
import {
  ILayoutElementSummaryProps,
  LayoutElementSummary,
} from '@frontend/ui/text-editing/shared';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { ILine } from '@frontend/domain';
import { detectLines } from './hooks';

export const AutomaticLineDetection = () => {
  const [detector, setDetector] = useState<any>(null);

  const textElements = useAppSelector(selectAllTextElements);
  const url = useAppSelector(selectPageFacsimileUrl);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLineDetector(url as string).then((detector) => {
      setDetector(detector);
    });

    return () => {
      if (detector !== null) {
        detector.free();
      }
    };
  }, []);

  const formik = useFormik({
    initialValues: textElements.reduce((acc: Record<string, number>, el) => {
      acc[`${el.Id}_threshold`] = 125;
      acc[`${el.Id}_density`] = 65;
      return acc;
    }, {}),
    onSubmit: () => {},
  });

  const elementSummaries: ILayoutElementSummaryProps[] = textElements.map(
    (el) => ({
      ...el,
      icon: 'text',
      maxHeight: '10vh',
      width: '80%',
      buttons: false,
    })
  );

  const lineDetector = useCallback(
    (values: any) => {
      const mainLines: (Omit<ILine, 'Tokens'> & { ElementId: string })[] = [];
      const glossLines: (Omit<ILine, 'Tokens'> & { ElementId: string })[] = [];
      textElements.forEach((el) => {
        const lines = detectLines(
          el.Id,
          el.FacsimileRegion,
          detector,
          values[`${el.Id}_threshold`],
          values[`${el.Id}_density`]
        );
        if (el.Position.startsWith('main')) {
          lines.forEach((line) =>
            mainLines.push({ ...line, LineOrder: mainLines.length })
          );
        } else {
          lines.forEach((line) =>
            glossLines.push({ ...line, LineOrder: glossLines.length })
          );
        }
      });
      dispatch(loadGeneratedLines([...mainLines, ...glossLines]));
      dispatch(setTextEditingToolMode('default'));
    },
    [detector]
  );

  return (
    <Stack
      sx={{ width: '100%', maxHeight: '100%', mt: '5px' }}
      spacing={1}
      alignItems="center"
    >
      <Alert severity="info">
        <Typography variant="body1">
          <strong> Binarization threshold:&nbsp;</strong>
          how dark the ink is in contrast to the page; a recommended value is
          between 100 and 175. Use smaller values for less contrast.
        </Typography>
        <Typography variant="body1">
          <strong>Line black density threshold:&nbsp;</strong> a composite
          measure of how far apart each two lines are and how thick the pen is;
          a recommended value is between 40 and 100. Use lower values if the
          lines are closer together or the pen is thin.
        </Typography>
      </Alert>

      {elementSummaries.map((el, index) => (
        <LayoutElementSummary key={el.Id} {...el}>
          <Stack
            sx={{
              m: '10px',
              width: '100%',
            }}
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
          >
            <TextField
              id={`${el.Id}_threshold`}
              name={`${el.Id}_threshold`}
              label="binarization threshold"
              autoComplete="off"
              value={formik.values[`${el.Id}_threshold`]}
              onChange={formik.handleChange}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
            <TextField
              id={`${el.Id}_density`}
              name={`${el.Id}_density`}
              label="line black density threshold"
              autoComplete="off"
              value={formik.values[`${el.Id}_density`]}
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
        onClick={() => lineDetector(formik.values)}
      >
        Detect
      </Button>
    </Stack>
  );
};
