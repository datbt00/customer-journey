"use client";

import * as campaignJourneyApi from "@/api/campaignJourneyApi";
import { SectionGrid } from "@/components/ui/grid/grid";
import { H2 } from "@/components/ui/typography/typography";
import { useToast } from "@/hooks/use-toast";
import { CampaignJourneyResponse } from "@/types/campaignJourney";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Detail from "./detail";

const metadata = {
    title: "Chi tiết chiến dịch",
};

export default function DetailPage() {
    const { id } = useParams();
    const { toast } = useToast();
    const [request, setRequest] = useState<CampaignJourneyResponse>();

    useEffect(() => {
        if (!id) return;
        campaignJourneyApi.getDetailCampaignV2(id).then(body => {
            if (body.data) {
                setRequest({
                    id: body.data.id,
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
                    usedWhileList: body.data.usedWhileList,
                    createdBy: body.data.createdBy,
                    updatedBy: body.data.updatedBy,
                } as CampaignJourneyResponse);
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
    // const m = format(formData.startDate, "dd/MM/yyyy");
    return (
        <div className="flex flex-col h-full">
            <SectionGrid className="px-6 !my-[24px]">
                <div className="max-w-[1200px] mx-auto flex flex-row justify-between items-center">
                    <H2 className="flex-1">{metadata.title}</H2>
                </div>
            </SectionGrid>
            <Detail request={request} />
        </div>
    );
}
