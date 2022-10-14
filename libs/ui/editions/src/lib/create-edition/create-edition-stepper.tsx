import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React, { FC, useCallback, useState } from 'react';
import Stack from '@mui/material/Stack';
import {
  NameAndSaveEdition,
  SelectAndOrderManuscripts,
  SelectChapter,
} from './create-unpdate-edition-operations';
import { stringHasValue } from '@frontend/util';
import { selectAccessToken, useAppSelector } from '@frontend/shared-ui';
import ObjectID from 'bson-objectid';
import axios from 'axios';

const steps = [
  'Select and order manuscripts',
  'Select chapter',
  'Name and save',
];

export const CreateEditionStepper: FC<{ handleClose: () => void }> = ({
  handleClose,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [selectedManuscripts, setSelectedManuscripts] = useState<string[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const accessToken = useAppSelector(selectAccessToken);
  const [editionName, setEditionName] = useState<string>('');
  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSave = useCallback(async () => {
    const editionDoc = {
      Id: ObjectID().toString(),
      Name: editionName,
      Type: 'chapter',
      editor: 'mk',
      EditionProgress: 'in work',
      UnitGroups: selectedManuscripts.map((mId, index) => ({
        ManuscriptId: mId,
        Order: index,
        Chapter: selectedChapter,
      })),
    };
    console.log({ editionDoc });
    await axios.post(
      `${process.env['NEXT_PUBLIC_API_URL']}Edition`,
      editionDoc,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    handleClose();
  }, [selectedManuscripts, selectedChapter, editionName]);

  return (
    <Stack sx={{ width: '100%' }}>
      <Stepper sx={{ width: '100%' }} activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </>
      ) : (
        <>
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ height: '50vh', width: '100%', mt: '10px' }}
          >
            {activeStep === 0 && (
              <SelectAndOrderManuscripts
                selectedManuscripts={selectedManuscripts}
                setSelectedManuscripts={setSelectedManuscripts}
              />
            )}
            {activeStep === 1 && (
              <SelectChapter
                chapter={selectedChapter}
                setChapter={setSelectedChapter}
              />
            )}
            {activeStep === 2 && (
              <NameAndSaveEdition
                editionName={editionName}
                setEditionName={setEditionName}
              />
            )}
          </Stack>

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep !== steps.length - 1 && (
              <Button
                disabled={
                  (activeStep === 0 && selectedManuscripts.length === 0) ||
                  (activeStep === 1 && !stringHasValue(selectedChapter))
                }
                onClick={handleNext}
              >
                Next
              </Button>
            )}
            {activeStep === steps.length - 1 && (
              <Button
                disabled={
                  (activeStep === 0 && selectedManuscripts.length === 0) ||
                  (activeStep === 1 && !stringHasValue(selectedChapter)) ||
                  !stringHasValue(editionName)
                }
                onClick={handleSave}
              >
                Finish
              </Button>
            )}
          </Box>
        </>
      )}
    </Stack>
  );
};
