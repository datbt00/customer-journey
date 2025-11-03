"use client";

import { Button, ButtonProps } from "@/components/ui/button/button";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { WizardActorContext } from "../wizard-machine";

const SubmitStepButton = React.forwardRef<
    HTMLButtonElement,
    ButtonProps & { onSubmitCampaign?: () => object }
>(({ onSubmitCampaign, ...props }, ref) => {
    const { toast } = useToast();
    const wizardActorRef = WizardActorContext.useActorRef();

    return (
        <Button
            type="button"
            className="min-w-[120px]"
            ref={ref}
            {...props}
            onClick={async () => {
                const dattaResponse = await onSubmitCampaign();
                if (dattaResponse) {
                    wizardActorRef.send({
                        type: "SUBMIT",
                    });
                } else {
                    toast({
                        title: "Lỗi",
                        description: "Đã xảy ra lỗi. Vui lòng thử lại",
                    });
                }
            }}
        >
            {props.children}
        </Button>
    );
});
SubmitStepButton.displayName = "SubmitStepButton";

export { SubmitStepButton };
