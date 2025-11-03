"use client";

import * as campaignApi from "@/api/campaignApi";
import { Badge } from "@/components/ui/badge/badge";
import {
    DataRow,
    DataRowLabel,
    DataRowValue,
} from "@/components/ui/grid/data-row";
import { Switch } from "@/components/ui/selectionControls/switch";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface SelectOptionType {
    label: string;
    value: string;
    code?: string;
}


export default function DataFieldStep1({ formData }: { formData: any }) {
    const [serviceMappings, setServiceMappings] = useState<SelectOptionType[]>([]);

    useEffect(() => {
        campaignApi
            .getServiceMapping()
            .then(body => {
                if (body?.data) {
                    setServiceMappings([
                        {
                            label: "ALL",
                            value: "ALL",
                            code: "ALL",
                        },
                        ...body.data.map(item => ({
                            label: item.svcName,
                            value: item.svcId,
                            code: item.svcCode,
                        })),
                    ]);
                }
            })
    }, []);

    return (
        <div className="space-y-4">
            <DataRow>
                <DataRowLabel>Chiến dịch tổng</DataRowLabel>
                <DataRowValue>
                    {formData.masterCampaignCode} - {formData.masterCampaignName}
                </DataRowValue>
            </DataRow>
            <Separator />
            <DataRow>
                <DataRowLabel>Chiến dịch</DataRowLabel>
                <DataRowValue>
                    {formData.campaignName} - {formData.campaignCode}
                </DataRowValue>
            </DataRow>
            <Separator />
            <DataRow>
                <DataRowLabel>Thời gian</DataRowLabel>
                <DataRowValue>
                    {formData.startDate &&
                        format(new Date(formData.startDate), "dd/MM/yyyy")
                    }
                    -
                    {formData.endDate &&
                        format(new Date(formData.endDate), "dd/MM/yyyy")
                    }
                </DataRowValue>
            </DataRow>
            <Separator />
            <DataRow>
                <DataRowLabel>Ứng dụng</DataRowLabel>
                <DataRowValue>{formData.bankName}</DataRowValue>
            </DataRow>
            <Separator />
            <DataRow>
                <DataRowLabel>Dịch vụ</DataRowLabel>
                <DataRowValue>{formData.serviceCode}</DataRowValue>
            </DataRow>
            <Separator />
            <DataRow>
                <DataRowLabel>Nhóm khách hàng test</DataRowLabel>
                <DataRowValue>{formData.collectionTestName}</DataRowValue>
            </DataRow>
            <Separator />
            <DataRow>
                <DataRowLabel>
                    Sử dụng tập khách hàng Whitelist
                </DataRowLabel>
                <DataRowValue>
                    <Switch
                        disabled
                        checked={!!formData?.usedWhileList}
                    />
                </DataRowValue>
            </DataRow>
            <Separator />
            <DataRow>
                <DataRowLabel>
                    Sử dụng loại trừ tập khách hàng Blacklist
                </DataRowLabel>
                <DataRowValue>
                    {!!formData?.usedBlackList ? (
                        <div className="inline-flex flex-wrap gap-2 justify-end">
                            {formData?.blackListServiceIds?.map(
                                el => (
                                    <Badge variant="secondary">
                                        {serviceMappings?.find(r => r.value === el)?.label}
                                    </Badge>
                                )
                            )}
                        </div>
                    ) : (
                        <Switch disabled checked={false} />
                    )}
                </DataRowValue>
            </DataRow>
        </div>
    );
}
