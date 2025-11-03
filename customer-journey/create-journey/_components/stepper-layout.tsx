"use client";

import { Stepper } from "@/components/ui/stepper/stepper";
import { useEffect, useState } from "react";
import { stepConfig, WizardActorContext } from "../wizard-machine";

const StepperLayout = () => {
  const [activeStep, setActiveStep] = useState("step-1");
  const wizardActorRef = WizardActorContext.useActorRef();

  useEffect(() => {
    const subscription = wizardActorRef.subscribe((state) => {
      setActiveStep(state.value as string);
    });

    return subscription.unsubscribe;
  }, [wizardActorRef]);

  return (
    <div>
      <Stepper steps={stepConfig} active={activeStep} />
    </div>
  );
};

export { StepperLayout };
