"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card/card";
import { mapRequestToFormChannel } from "@/components/ui/flows/journey/common";
import { SectionGrid } from "@/components/ui/grid/grid";
import { H4 } from "@/components/ui/typography/typography";
import { CampaignJourneyResponse } from "@/types/campaignJourney";
import { ReactFlowProvider } from "@xyflow/react";
import CampaignAction from "../../_components/campaign-action";
import DataFieldStep1 from "../../create-journey/_components/review/data-field-step-1";
import Flow from "../../create-journey/_components/review/flow";

export default function Detail({
    request,
}: {
    request: CampaignJourneyResponse;
}) {
    return (
        <SectionGrid className="space-y-6 mx-auto max-w-[1200px] w-full">
            <Card>
                <CardHeader>
                    <CardTitle>
                        <H4>1. Thiết lập chung</H4>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DataFieldStep1 formData={request} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>
                        <H4>2. Kịch bản</H4>
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[800px] px-0 border-t">
                    <ReactFlowProvider>
                        <Flow
                            formData={{
                                bankCode: request.bankCode,
                                partnerName: request.partnerName,
                                nodes: request?.nodes
                                    ? JSON.parse(request.nodes)?.map(node =>
                                        mapRequestToFormChannel(
                                            node.channel,
                                            node
                                        )
                                    )
                                    : [],
                                edges: request?.edges
                                    ? JSON.parse(request.edges)
                                    : [],
                            }}
                        />
                    </ReactFlowProvider>
                </CardContent>
            </Card>
            {/* <div className="flex justify-center md:justify-end gap-2 pb-6">
                <Button
                    variant="outline"
                    asChild
                    className="-sm:w-full min-w-[150px] -md:flex-1"
                >
                    <Link
                        onClick={() => setSelectedTab("sub")}
                        href={`/campaign-management/${selectedPartner?.partnerName?.toLowerCase()}`}
                    >
                        Về danh sách
                    </Link>
                </Button>
            </div> */}
            <CampaignAction campaign={request} />
        </SectionGrid>
    );
}
