"use client";

import { Button } from "@/components/ui/button/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card/card";
import { SectionGrid } from "@/components/ui/grid/grid";
import { Separator } from "@/components/ui/separator";
import { H4 } from "@/components/ui/typography/typography";
import { CampaignJourneyRequest } from "@/types/campaignJourney";
import { ReactFlowProvider } from "@xyflow/react";
import { BackStepButton } from "../back-step-button";
import Flow from "./flow";
import { PageFormProvider } from "./form-context";

export default function Step2Form({
    request,
    setRequest,
}: {
    request: CampaignJourneyRequest;
    setRequest: (data: CampaignJourneyRequest) => void;
}) {
    return (
        <PageFormProvider request={request} setRequest={setRequest}>
            <SectionGrid className="space-y-6 mx-auto md:px-0 flex-1 flex flex-col w-full">
                <Card className="rounded-none border-x-0 h-full min-h-[400px] flex flex-col">
                    <CardHeader>
                        <CardTitle>
                            <H4>Thông tin kịch bản</H4>
                        </CardTitle>
                        <CardDescription>
                            Thiết lập kịch bản chiến dịch dựa trên hành vi giao
                            dịch (transaction), hành vi sự kiện (event) và đưa
                            ra quyết định đúng thời điểm tới Khách hàng như: Gửi
                            tin truyền thông, Tặng quà, Tặng lượt chơi, Quảng
                            cáo bán chéo, ...
                        </CardDescription>
                    </CardHeader>
                    <Separator />
                    <ReactFlowProvider>
                        <Flow />
                    </ReactFlowProvider>
                </Card>
                <div className="flex justify-center md:justify-end gap-2 px-4 md:px-6 max-w-[1248px] w-full mx-auto">
                    <BackStepButton />
                    <Button className="min-w-[120px] -md:flex-1" type="submit">
                        Tiếp tục
                    </Button>
                </div>
            </SectionGrid>
        </PageFormProvider>
    );
}
