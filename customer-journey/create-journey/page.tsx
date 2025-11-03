"use client";

import * as campaignJourneyApi from "@/api/campaignJourneyApi";
import { usePartnerName } from "@/app/(dashboard)/partner-context";
import { DraftProvider } from "@/contexts/draft-context";
import { clearDraftCampaign } from "@/lib/utils";
import { CampaignJourneyRequest } from "@/types/campaignJourney";
import { useParams } from "next/navigation";
import { useState } from "react";
import { DRAFT_JOURNEY_CAMPAIGN } from "../common";
import Steps from "./_components/steps";

const defaultRequest = {
    campaignCode: "",
    campaignName: "",
    masterCampaignId: "",
    masterCampaignCode: "",
    masterCampaignName: "",
    bankCode: "",
    bankName: "",
    startDate: undefined,
    endDate: undefined,
    status: "",
    description: "",
    services: "",
    serviceCode: "",
    tags: "",
    partnerName: "",
    usedBlackList: true,
    blackListServiceIds: ['ALL'],
    nodes: "",
    edges: "",
    collectionTestId: "",
    collectionTestName: "",
    usedWhileList: true,
};
export default function StepPage() {
    const { selectedPartner } = usePartnerName();
    const { partner } = useParams();
    const [request, setRequest] =
        useState<CampaignJourneyRequest>(defaultRequest);

    const onCreateCampaign = async () => {
        const body = await campaignJourneyApi.createCampaignV2({
            ...request,
            partnerName: selectedPartner.journeyPartnerName,
        });
        if (body?.data) {
            setRequest(defaultRequest);
            // Clear draft if success
            clearDraftCampaign(`${partner}_${DRAFT_JOURNEY_CAMPAIGN}`);
        }
        return body.data;
    };

    const onCheckCampaignCodeExisted = async (campaignCode: string) => {
        const isNameExisted = await campaignJourneyApi.getCampaignV2ByCode(
            campaignCode
        );
        return isNameExisted.result.success;
    };

    return (
        <DraftProvider draftType={`${partner}_${DRAFT_JOURNEY_CAMPAIGN}`}>
            <Steps
                request={{
                    ...request,
                    partnerName: selectedPartner.journeyPartnerName,
                }}
                setRequest={setRequest}
                onSubmitCampaign={onCreateCampaign}
                onCheckCampaignCodeExisted={onCheckCampaignCodeExisted}
            />
        </DraftProvider>
    );
}
