"use client";

import { BackButton } from "@/components/ui/button/back-button";
import { Button } from "@/components/ui/button/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card/card";
import { SectionGrid } from "@/components/ui/grid/grid";
import { H4 } from "@/components/ui/typography/typography";
import { CampaignJourneyRequest } from "@/types/campaignJourney";
import FormPage from "./form";
import { PageFormProvider } from "./form-context";
import FormPageAdditional from "./formAdditional";

export default function Step1Form({
    request,
    setRequest,
    onCheckCampaignCodeExisted,
}: {
    request: CampaignJourneyRequest;
    setRequest: (data: CampaignJourneyRequest) => void;
    onCheckCampaignCodeExisted: (campaignCode: string) => Promise<boolean>;
}) {
    return (
        <PageFormProvider
            request={request}
            setRequest={setRequest}
            onCheckCampaignCodeExisted={onCheckCampaignCodeExisted}
        >
            <SectionGrid className="space-y-6 mx-auto max-w-[1200px] w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <H4>Thiết lập chung</H4>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormPage />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <H4>Cấu hình bổ sung</H4>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormPageAdditional />
                    </CardContent>
                </Card>
                <div className="flex justify-center md:justify-end gap-2 pb-6">
                    <BackButton
                        className="min-w-[120px] -md:flex-1"
                        variant="outline"
                    />
                    <Button className="min-w-[120px] -md:flex-1" type="submit">
                        Tiếp tục
                    </Button>
                </div>
            </SectionGrid>
        </PageFormProvider>
    );
}
