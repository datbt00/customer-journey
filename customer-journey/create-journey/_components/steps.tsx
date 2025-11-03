"use client";

import { CampaignJourneyRequest } from "@/types/campaignJourney";
import { WizardActorContext } from "../wizard-machine";
import Review from "./review/review";
import Step1Form from "./step-1/step-1";
import Step2Form from "./step-2/step-2";
import Success from "./success/success";

function Steps({
    request,
    setRequest,
    onSubmitCampaign,
    onCheckCampaignCodeExisted,
}: {
    request: CampaignJourneyRequest;
    setRequest: (data: CampaignJourneyRequest) => void;
    onSubmitCampaign: () => object;
    onCheckCampaignCodeExisted: (campaignCode: string) => Promise<boolean>;
}) {
    const currentStep = WizardActorContext.useSelector(state => state.value);

    switch (currentStep) {
        case "step-1":
            return (
                <Step1Form
                    request={request}
                    setRequest={setRequest}
                    onCheckCampaignCodeExisted={onCheckCampaignCodeExisted}
                />
            );
        case "step-2":
            return <Step2Form request={request} setRequest={setRequest} />;
        case "review":
            return <Review onSubmitCampaign={onSubmitCampaign} />;
        case "success":
            return <Success />;
    }
}

export default Steps;
