"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card/card";
import { SectionGrid } from "@/components/ui/grid/grid";
import { H4 } from "@/components/ui/typography/typography";
import { ReactFlowProvider } from "@xyflow/react";
import { ArrowRight } from "lucide-react";
import { BackStepButton } from "../back-step-button";
import { SubmitStepButton } from "../submit-step-button";
import DataFieldStep1 from "./data-field-step-1-review";
import Flow from "./flow-review";

export default function Review({
    onSubmitCampaign,
}: {
    onSubmitCampaign: () => object;
}) {
    return (
        <SectionGrid className="space-y-6 mx-auto max-w-[1200px] w-full">
            <Card className="bg-primary border-none text-primary-foreground">
                <CardHeader>
                    <div className="flex sm:items-center gap-4 -sm:flex-col">
                        <div className="space-y-1 flex-1">
                            <CardTitle>
                                <H4>Tổng quan chiến dịch</H4>
                            </CardTitle>
                            <CardDescription className="text-inherit opacity-80">
                                Xem lại các thông tin thiết lập chiến dịch trước
                                khi hoàn tất!
                            </CardDescription>
                        </div>
                        <SubmitStepButton
                            className="w-[170px] text-foreground"
                            variant="outline"
                            onSubmitCampaign={onSubmitCampaign}
                        >
                            Tạo chiến dịch <ArrowRight />
                        </SubmitStepButton>
                    </div>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>
                        <H4>1. Thiết lập chung</H4>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DataFieldStep1 />
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
                        <Flow />
                    </ReactFlowProvider>
                </CardContent>
            </Card>
            <div className="flex justify-center md:justify-end gap-2 pb-6">
                <BackStepButton />
                <SubmitStepButton
                    className="-md:flex-1"
                    onSubmitCampaign={onSubmitCampaign}
                >
                    Tạo chiến dịch
                </SubmitStepButton>
            </div>
        </SectionGrid>
    );
}
