"use client";

import { Button, ButtonProps } from "@/components/ui/button/button";
import React from "react";
import { WizardActorContext } from "../wizard-machine";

const BackStepButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }: ButtonProps, ref) => {
    const wizardActorRef = WizardActorContext.useActorRef();

    return (
      <Button
        type="button"
        className="min-w-[120px]"
        variant={"outline"}
        ref={ref}
        {...props}
        onClick={() =>
          wizardActorRef.send({
            type: "PREV",
          })
        }
      >
        Quay lại
      </Button>
    );
  }
);
BackStepButton.displayName = "BackStepButton";

export { BackStepButton };
