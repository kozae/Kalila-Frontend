import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import {
  NameAndSaveEdition,
  SelectAndOrderManuscripts,
  SelectAndOrderUnits
} from "../create-unpdate-edition-operations";

const steps = ["Select and order manuscripts", "Select and order units", "Customize manuscripts", "Name and save"];

export const CreateEditionStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [selectedManuscripts, setSelectedManuscripts] = useState<string[]>([]);
  const [selectedBookUnits, setSelectedBookUnits] = useState<string[]>([]);
  const [selectedBookUnitsTitles, setSelectedBookUnitsTitles] = useState<Record<string, string>>({});
  const [customManuscripts, setCustomManuscripts] = useState<Record<string, Record<string, string>>[]>([]);
  const [editionName, setEditionName] = useState<string>("");
  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  useEffect(()=> {
    console.log("selectedManuscripts", selectedManuscripts);
  }, [selectedManuscripts])

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

  return (
    <Stack sx={{ width: "100%" }}>
      <Stepper sx={{ width: "100%" }} activeStep={activeStep}>
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
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </>
      ) : (
        <>
          <Stack alignItems="center" justifyContent="center" sx={{ height: "50vh", width: "100%", mt: "10px" }}>
            {activeStep === 0 && <SelectAndOrderManuscripts selectedManuscripts={selectedManuscripts}
                                                            setSelectedManuscripts={setSelectedManuscripts} />}
            {activeStep === 1 && <SelectAndOrderUnits selectedBookUnits={selectedBookUnits}
                                                      selectedBookUnitsTitles={selectedBookUnitsTitles}
                                                      setSelectedBookUnitsTitles={setSelectedBookUnitsTitles}
                                                      setSelectedBookUnits={setSelectedBookUnits} />}
            {activeStep === 3 && <NameAndSaveEdition editionName={editionName} setEditionName={setEditionName} />}
          </Stack>

          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button
              disabled={(activeStep === 0 && selectedManuscripts.length === 0) || (activeStep === 1 && selectedBookUnits.length === 0)}
              onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </>
      )}
    </Stack>
  );
};
