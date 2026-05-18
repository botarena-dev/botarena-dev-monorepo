import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  Box,
  Button,
  Paper,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

import { BotInformation } from "./components/BotInformation";
import { BotInitialization } from "./components/BotInitialization";

const steps = [
  "Bot Information",
  "Initialization Matches",
  "Registration Complete",
];

export const RegisterBot = () => {
  const methods = useForm({
    defaultValues: {
      name: "",
      description: "",
      isTeam: false,
      teamMembers: [{ name: "" }],
    },
  });

  const {
    formState: { isValid },
  } = methods;

  const [activeStep, setActiveStep] = useState(0);

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  return (
    <FormProvider {...methods}>
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 2 }}
      >
        <Typography variant="h1" color="textPrimary">
          Register Bot
        </Typography>

        <Typography variant="body1" color="textPrimary">
          Register your bot by providing details and passing the initialization
          process.
        </Typography>

        <Stepper sx={{ margin: 4 }} activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepButton
                aria-controls="stepper-content"
                color="inherit"
                onClick={handleStep(index)}
              >
                <StepLabel>{label}</StepLabel>
              </StepButton>
            </Step>
          ))}
        </Stepper>

        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: 4,
            alignSelf: "center",
          }}
        >
          {activeStep === 0 && <BotInformation />}

          {activeStep === 1 && <BotInitialization />}

          <Box
            sx={{
              display: "flex",
            }}
          >
            {activeStep > 0 && (
              <Button
                variant="outlined"
                color="text"
                sx={{ alignSelf: "flex-start" }}
                onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
              >
                Back
              </Button>
            )}

            <Button
              variant="contained"
              color="success"
              sx={{ alignSelf: "flex-end", marginLeft: "auto" }}
              disabled={!isValid}
              onClick={() =>
                setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))
              }
            >
              Continue
            </Button>
          </Box>
        </Paper>
      </Box>
    </FormProvider>
  );
};
