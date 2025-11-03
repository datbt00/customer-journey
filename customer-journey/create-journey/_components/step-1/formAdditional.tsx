"use client";

import * as campaignApi from "@/api/campaignApi";
import { CardDescription, CardTitle } from "@/components/ui/card/card";
import { FormField, FormLabel } from "@/components/ui/form/form";
import { MultiSelect } from "@/components/ui/select/multiselect";
import { SwitchFormLabel } from "@/components/ui/selectionControls/switch-form";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

interface SelectOptionType {
    label: string;
    value: string;
    code?: string;
}

export default function FormPageAdditional() {
    const form = useFormContext();
    const [serviceMappings, setServiceMappings] = useState<SelectOptionType[]>(
        []
    );
    const [isLoading, setIsLoading] = useState(true);
    const account = useAppSelector(state => state.account);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
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
                    .catch(() => setServiceMappings([]));
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    if (isLoading) {
        return <div />;
    }

    return (
        <div className="grid gap-6">
            <FormField
                control={form.control}
                name="usedWhileList"
                render={({ field }) => (
                    <SwitchFormLabel
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={account.isTester}
                    >
                        <FormLabel className="font-medium text-base">
                            <CardTitle>
                                <p className="font-medium text-base text-[#18181B]">
                                    Sử dụng tập khách hàng Whitelist
                                </p>
                            </CardTitle>
                            <CardDescription>
                                <span className="text-[#71717A] text-sm font-normal">
                                    Description
                                </span>
                            </CardDescription>
                        </FormLabel>
                    </SwitchFormLabel>
                )}
            />
            <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="usedBlackList"
                    render={({ field }) => (
                        <SwitchFormLabel
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        >
                            <FormLabel className="font-medium text-base">
                                <CardTitle>
                                    <p className="font-medium text-base text-[#18181B]">
                                        Sử dụng loại trừ tập khách hàng
                                        Blacklist
                                    </p>
                                </CardTitle>
                                <CardDescription>
                                    <span className="text-[#71717A] text-sm font-normal">
                                        Description
                                    </span>
                                </CardDescription>
                            </FormLabel>
                        </SwitchFormLabel>
                    )}
                />
                {form.getValues("usedBlackList") && (
                    <div className="max-w-[50%]">
                        <FormField
                            control={form.control}
                            name="blackListServiceIds"
                            render={() => (
                                <MultiSelect options={serviceMappings} />
                            )}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
