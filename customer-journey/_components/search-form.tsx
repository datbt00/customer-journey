"use client";

import { Button } from "@/components/ui/button/button";
import { DateRangePicker } from "@/components/ui/dateRangePicker/dateRangePicker";
import { Form, FormField } from "@/components/ui/form/form";
import { SearchFormGrid } from "@/components/ui/grid/grid";
import { Input } from "@/components/ui/input/input";
import { Select } from "@/components/ui/select/select";
import { useColumnVisibilityTarget } from "@/components/ui/table/ColumnVisibilityTargetContext";
import { CampaignJourneyFilterRequest } from "@/types/campaignJourney";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format, subDays } from "date-fns";
import { Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CAMPAIGN_STATUS } from "../common";

// Form Schema Definition (Order Matters)
const FormSchema = z.object({
    campaignName: z.string().optional(),
    service: z.string().optional(),
    status: z.string().optional(),
    appliedTime: z.object({
        from: z.date().optional(),
        to: z.date().optional(),
    }),
});

export default function SearchForm({
    serviceOptions,
    onSearch,
}: {
    serviceOptions: { label: string; value: string; code: string }[];
    onSearch: (data: z.infer<typeof FormSchema>) => void;
}) {
    const targetRef = useRef<HTMLDivElement>(null);
    const { setColumnVisibilityTargetRef } = useColumnVisibilityTarget();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            campaignName: "",
            service: "",
            status: "",
            appliedTime: {
                from: subDays(new Date(), 30),
                to: addDays(new Date(), 30),
            },
        },
    });

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        const newQuey: CampaignJourneyFilterRequest = {
            campaignCode: "",
            campaignName: data.campaignName,
            status: data.status,
            service: data.service,
            limit: 10,
            page: 1,
            startDate: format(data.appliedTime.from, "yyyy-MM-dd"),
            endDate: format(data.appliedTime.to, "yyyy-MM-dd"),
        };
        onSearch(newQuey);
    };

    useEffect(() => {
        setColumnVisibilityTargetRef(targetRef);
    }, []);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 w-full"
            >
                <SearchFormGrid className="xl:grid-cols-4">
                    <div className="xl:col-span-2">
                        <FormField
                            control={form.control}
                            name="campaignName"
                            render={() => (
                                <Input
                                    placeholder="Nhập tìm kiếm"
                                    formComposition={{
                                        label: "Tìm kiếm",
                                        iconLeft: <Search />,
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="xl:col-span-2">
                        <FormField
                            control={form.control}
                            name="appliedTime"
                            render={() => (
                                <DateRangePicker
                                    formComposition={{
                                        label: "Thời gian áp dụng",
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="xl:col-span-2">
                        <FormField
                            control={form.control}
                            name="service"
                            render={() => (
                                <Select
                                    placeholder="Chọn dịch vụ"
                                    options={serviceOptions}
                                    formComposition={{
                                        label: "Dịch vụ",
                                    }}
                                />
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="status"
                        render={() => (
                            <Select
                                placeholder="Chọn trạng thái"
                                options={CAMPAIGN_STATUS}
                                formComposition={{
                                    label: "Trạng thái",
                                }}
                            />
                        )}
                    />
                    {/* <div className="div" ref={targetRef}></div> */}
                    <div className="flex flex-col">
                        <span className="opacity-0">cdp searching</span>
                        <Button
                            className="w-full mx-auto !bg-[#005BAA] flex flex-row items-center justify-center gap-2"
                            type="submit"
                        >
                            <Search className="size-[12px]" />
                            Tra cứu
                        </Button>
                    </div>
                </SearchFormGrid>
            </form>
        </Form>
    );
}
