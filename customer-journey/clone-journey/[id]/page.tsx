"use client";

import * as campaignJourneyApi from "@/api/campaignJourneyApi";
import { DraftProvider } from "@/contexts/draft-context";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/redux/hooks";
import { CampaignJourneyRequest } from "@/types/campaignJourney";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DRAFT_JOURNEY_CAMPAIGN } from "../../common";
import Steps from "../../create-journey/_components/steps";

export default function StepPage() {
    const { id, partner } = useParams();
    const { toast } = useToast();
    const [request, setRequest] = useState<CampaignJourneyRequest>(undefined);
    const account = useAppSelector(state => state.account);

    useEffect(() => {
        if (!id) return;
        campaignJourneyApi.getDetailCampaignV2(id).then(body => {
            if (body.data) {
                setRequest({
                    campaignCode: body.data.campaignCode,
                    campaignName: body.data.name,
                    masterCampaignId: body.data.masterCampaignId,
                    bankCode: body.data.bankCode,
                    bankName: body.data.bankName,
                    masterCampaignCode: body.data.masterCampaignCode,
                    masterCampaignName: body.data.masterCampaignName,
                    startDate: body.data.startDate,
                    endDate: body.data.endDate,
                    status: body.data.status,
                    description: body.data.description,
                    services: body.data.services,
                    serviceCode: body.data.serviceCode,
                    tags: body.data.tags,
                    partnerName: body.data.partnerName,
                    usedBlackList: body.data.usedBlackList,
                    blackListServiceIds: body.data.blackListServiceIds,
                    nodes: body.data.nodes,
                    edges: body.data.edges,
                    collectionTestId: body.data.collectionTestId,
                    collectionTestName: body.data.collectionTestName,
                    usedWhileList: account.isTester
                        ? true
                        : body.data.usedWhileList,
                });
            } else {
                toast({
                    title: "Lỗi",
                    description: body.result.message,
                });
            }
        });
    }, [id]);

    if (!id || !request) {
        return <div />;
    }

    const onCreateCampaign = async () => {
        const body = await campaignJourneyApi.createCampaignV2(request);
        return body.data;
    };

    const onCheckCampaignCodeExisted = async (campaignCode: string) => {
        const isNameExisted = await campaignJourneyApi.getCampaignV2ByCode(
            campaignCode
        );
        return isNameExisted.result.success;
    };

    return (
        <DraftProvider draftType={`${partner}_${DRAFT_JOURNEY_CAMPAIGN}`} isClone={true}>
            <Steps
                request={request}
                setRequest={setRequest}
                onSubmitCampaign={onCreateCampaign}
                onCheckCampaignCodeExisted={onCheckCampaignCodeExisted}
            />
        </DraftProvider>
    );
}
