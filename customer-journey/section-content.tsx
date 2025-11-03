"use client";

import * as campaignApi from "@/api/campaignApi";
import * as campaignJourneyApi from "@/api/campaignJourneyApi";
import { usePartnerName } from "@/app/(dashboard)/partner-context";
import { Card, CardContent } from "@/components/ui/card/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ColumnVisibilityTargetProvider } from "@/components/ui/table/ColumnVisibilityTargetContext";
import {
    CampaignJourneyFilterRequest,
    CampaignJourneyResponse,
} from "@/types/campaignJourney";
import { addDays, format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import SearchForm from "./_components/search-form";
import Table from "./_components/table/table";

function SectionContent() {
    const [serviceOptions, setServiceOptions] = useState<
        { label: string; value: string; code: string }[]
    >([]);
    const [campaigns, setCampaigns] = useState<CampaignJourneyResponse[]>([]);
    const [total, setTotal] = useState<number>(0);
    const { selectedPartner } = usePartnerName();
    const [query, setQuery] = useState<CampaignJourneyFilterRequest>({
        campaignCode: "",
        campaignName: "",
        status: "",
        service: "",
        limit: 10,
        page: 1,
        startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
        endDate: format(addDays(new Date(), 30), "yyyy-MM-dd"),
        partnerName: selectedPartner.partnerName
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        campaignApi.getServiceList().then(serviceResponse => {
            if (
                serviceResponse?.result?.success &&
                serviceResponse?.data?.length > 0
            ) {
                const services = serviceResponse.data.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                    code: item.code,
                }));
                setServiceOptions(services);
            }
        });
    }, []);

    const callApi = () => {
        campaignJourneyApi
            .filterCampaignV2(query)
            .then(body => {
                if (body?.result?.success) {
                    setCampaigns(body.data || []);
                    setTotal(body.metadata.total);
                }
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                callApi();
            } catch (error) {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [query]);

    const onSearch = (data: CampaignJourneyFilterRequest) => {
        setQuery({
            ...query,
            campaignCode: data.campaignCode,
            campaignName: data.campaignName,
            status: data.status,
            service: data.service,
            startDate: data.startDate,
            endDate: data.endDate,
        });
    };

    const handleChangePage = (page: number) => {
        setQuery({
            ...query,
            page,
        });
    };

    const handleQuantityChange = (limit: number) => {
        setQuery({
            ...query,
            limit,
            page: 1,
        });
    };

    return (
        <ColumnVisibilityTargetProvider>
            <div className="space-y-6">
                <Card className="rounded-none border-x-0 border-b-0 p-6">
                    <div className="max-w-[1200px] mx-auto flex flex-row justify-between items-center">
                        <SearchForm
                            serviceOptions={serviceOptions}
                            onSearch={onSearch}
                        />
                    </div>
                </Card>
                <Card className="rounded-none border-x-0 !mt-0">
                    {isLoading ? (
                        <Skeleton className="flex-1 h-[300px] border-b rounded-none backdrop-blur" />
                    ) : (
                        <CardContent className="px-0 pb-0">
                            <Table
                                data={campaigns}
                                onPageChange={handleChangePage}
                                quantityPerPage={query.limit}
                                page={query.page}
                                dataLength={total}
                                onQuantityChange={handleQuantityChange}
                                reload={() => callApi()}
                            />
                        </CardContent>
                    )}
                </Card>
            </div>
        </ColumnVisibilityTargetProvider>
    );
}

export default SectionContent;
