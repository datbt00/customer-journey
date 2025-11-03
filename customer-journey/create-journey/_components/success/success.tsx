"use client";

import { useTab } from "@/app/(dashboard)/campaign-management/tab-context";
import { usePartnerName } from "@/app/(dashboard)/partner-context";
import { Button } from "@/components/ui/button/button";
import { Card, CardContent } from "@/components/ui/card/card";
import { EmptyState } from "@/components/ui/empty-state/empty-state";
import { SectionGrid } from "@/components/ui/grid/grid";
import { useDraft } from "@/contexts/draft-context";
import Link from "next/link";
import { WizardActorContext } from "../../wizard-machine";

export default function Success() {
    const wizardActorRef = WizardActorContext.useActorRef();
    const { selectedPartner } = usePartnerName();
    const { setSelectedTab } = useTab();
    const { discardDraft } = useDraft();

    return (
        <SectionGrid className="space-y-6 mx-auto max-w-[1200px] w-full">
            <Card>
                <CardContent className="p-0">
                    <EmptyState
                        className="border-0 p-8"
                        variant="success"
                        title="Bạn đã hoàn thành thiết lập chiến dịch"
                        description={
                            <>
                                Chiến dịch đang ở trạng thái{" "}
                                <b>&quot;Đã tạo&quot;</b>.
                            </>
                        }
                    >
                        <div className="flex justify-center flex-1 gap-3 -sm:flex-col">
                            <Button
                                variant="outline"
                                asChild
                                className="-sm:w-full min-w-[150px] -md:flex-1"
                            >
                                <Link
                                    onClick={() => setSelectedTab("sub")}
                                    href={`/campaign-management/${selectedPartner.partnerName.toLowerCase()}`}
                                >
                                    Về danh sách
                                </Link>
                            </Button>
                            <Button
                                className="-sm:w-full min-w-[150px] -md:flex-1"
                                onClick={() => {
                                    wizardActorRef.send({ type: "RESTART" })
                                    discardDraft();
                                }}
                            >
                                Tạo chiến dịch mới
                            </Button>
                        </div>
                    </EmptyState>
                </CardContent>
            </Card>
        </SectionGrid>
    );
}
