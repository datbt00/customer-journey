"use client";

import * as campaignApi from "@/api/campaignApi";
import * as collectionCampaignApi from "@/api/collectionCampaign";
import * as masterCampaignApi from "@/api/masterCampaignApi";
import { usePartnerName } from "@/app/(dashboard)/partner-context";
import DateTimePicker from "@/components/ui/datepicker/datetimepicker";
import { FormField } from "@/components/ui/form/form";
import { Input } from "@/components/ui/input/input";
import { Select } from "@/components/ui/select/select";
import { Textarea } from "@/components/ui/textarea/textarea";
import { useDraft } from "@/contexts/draft-context";
import { loadDraftCampaign } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

interface SelectOptionType {
    label: string;
    value: string;
    code?: string;
}

export default function FormPage() {
    const form = useFormContext();
    const [masterCampaign, setMasterCampaign] = useState<SelectOptionType[]>(
        []
    );
    const [collectionTest, setCollectionTest] = useState<SelectOptionType[]>(
        []
    );
    const [serviceList, setServiceList] = useState<SelectOptionType[]>([]);

    const [bankList, setBankList] = useState<SelectOptionType[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const { selectedPartner } = usePartnerName();

    // Draft store logic: provides current draft data, load status, and a debounced save function
    const { draftData, isDraftLoaded, isClone, draftType, debouncedSaveDraft } = useDraft();

    const handleChangeBankCode = (bankCode: string) => {
        const selectedBank = bankList.find(
            m => m.value === bankCode
        );
        if (selectedBank) {
            form.setValue(
                "bankCode",
                selectedBank.value || ""
            );
            form.setValue(
                "bankName",
                selectedBank.label || ""
            );
        }
    }

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const collectionResponse = await collectionCampaignApi.filter({
                    status: 1,
                });
                if (collectionResponse.data) {
                    const listCollectionId = collectionResponse.data.map(
                        item => item.id
                    );
                    if (
                        form.getValues("collectionTestId") && !listCollectionId.includes(
                            form.getValues("collectionTestId")
                        )
                    ) {
                        form.setValue("collectionTestId", "");
                        form.setValue("collectionTestName", "");
                    }
                    setCollectionTest(
                        collectionResponse.data.map(item => ({
                            label: item.name,
                            value: item.id,
                        }))
                    );
                }

                const masterResponse = await masterCampaignApi.filterCampaign({
                    status: 1,
                    partnerName: selectedPartner?.partnerName,
                });
                if (masterResponse.data?.length > 0) {
                    const listMasterCampId = masterResponse.data.map(
                        item => item.id
                    );
                    if (
                        form.getValues("masterCampaignId") && !listMasterCampId.includes(
                            form.getValues("masterCampaignId")
                        )
                    ) {
                        form.setValue("masterCampaignId", "");
                        form.setValue("masterCampaignCode", "");
                        form.setValue("masterCampaignName", "");
                    }
                    setMasterCampaign(
                        masterResponse.data.map(item => ({
                            label: item.campaignName,
                            value: item.id,
                            code: item.campaignCode,
                        }))
                    );
                }

                const serviceResponse = await campaignApi.getServiceList();
                if (serviceResponse.data) {
                    setServiceList(
                        serviceResponse.data.map(item => ({
                            label: item.name,
                            value: item.id,
                            code: item.code,
                        }))
                    );
                }

                const bankResponse = await campaignApi.getBankApp(
                    selectedPartner?.partnerName
                );
                if (bankResponse.data?.length > 0) {
                    setBankList(
                        bankResponse.data.map(item => ({
                            label: item.appName,
                            value: item.appCode,
                        }))
                    );
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (selectedPartner) {
            loadData();
        }
    }, [selectedPartner]);

    useEffect(() => {
        if (isClone) return;
        if (isDraftLoaded && draftData && draftData['data']) {
            const draft = loadDraftCampaign(draftType);
            const data = draft['data']
            if (typeof data.startDate === 'string') {
                data.startDate = new Date(data.startDate);
            }
            if (typeof data.endDate === 'string') {
                data.endDate = new Date(data.endDate);
            }
            form.reset(data);
            if (data.bankCode) {
                handleChangeBankCode(data.bankCode);
            }
        }
    }, [isDraftLoaded, draftData, isClone, bankList]);

    useEffect(() => {
        if (isClone) return;
        const subscription = form.watch(value => {
            debouncedSaveDraft(draftType, value);
        });
        return () => subscription.unsubscribe();
    }, [form.watch, isClone]);

    if (isLoading) {
        return <div />;
    }

    return (
        <div className="grid gap-4">
            <FormField
                control={form.control}
                name="masterCampaignId"
                render={({ field }) => (
                    <Select
                        placeholder="Tên chiến dịch tổng đã chọn ở màn danh sách"
                        options={masterCampaign}
                        formComposition={{
                            label: "Chiến dịch tổng",
                        }}
                        value={field.value || ""}
                        onValueChange={value => {
                            const selectedCampaign = masterCampaign.find(
                                m => m.value === value
                            );
                            if (selectedCampaign) {
                                field.onChange(selectedCampaign.value);
                                form.setValue(
                                    "masterCampaignCode",
                                    selectedCampaign.code || ""
                                );
                                form.setValue(
                                    "masterCampaignName",
                                    selectedCampaign.label
                                );
                            }
                        }}
                    />
                )}
            />

            <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="campaignName"
                    render={({ field }) => (
                        <Input
                            placeholder="Nhập tên chiến dịch"
                            type="text"
                            autoComplete="true"
                            formComposition={{
                                label: "Tên chiến dịch",
                            }}
                            {...field}
                        />
                    )}
                />

                <FormField
                    control={form.control}
                    name="campaignCode"
                    render={({ field }) => (
                        <Input
                            placeholder="Nhập mã chiến dịch"
                            type="text"
                            autoComplete="true"
                            formComposition={{
                                label: "Mã chiến dịch",
                            }}
                            {...field}
                        />
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <Textarea
                        placeholder="Nhập mô tả, ghi chú, mục đích của chiến dịch để theo dõi và lưu lại"
                        formComposition={{
                            label: "Mô tả",
                        }}
                        {...field}
                    />
                )}
            />

            <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                        <DateTimePicker
                            placeholder="dd/mm/yyyy hh:mm"
                            label="Thời gian bắt đầu"
                        />
                    )}
                />

                <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                        <DateTimePicker
                            placeholder="dd/mm/yyyy hh:mm"
                            label="Thời gian kết thúc"
                        />
                    )}
                />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="bankCode"
                    render={({ field }) => (
                        <Select
                            placeholder="Chọn"
                            options={bankList}
                            formComposition={{
                                label: "Ứng dụng",
                            }}
                            onValueChange={handleChangeBankCode}
                        />
                    )}
                />

                <FormField
                    control={form.control}
                    name="services"
                    render={({ field }) => (
                        <Select
                            placeholder="Chọn"
                            options={serviceList}
                            formComposition={{
                                label: "Dịch vụ",
                            }}
                            value={field.value}
                            onValueChange={value => {
                                const selectedService = serviceList.find(
                                    s => s.value === value
                                );
                                if (selectedService) {
                                    form.setValue(
                                        "services",
                                        selectedService.value || ""
                                    );
                                    form.setValue(
                                        "serviceCode",
                                        selectedService.code || ""
                                    );
                                }
                            }}
                        />
                    )}
                />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="collectionTestId"
                    render={({ field }) => (
                        <Select
                            placeholder="Chọn"
                            options={collectionTest}
                            formComposition={{
                                label: "Nhóm khách hàng test",
                            }}
                            value={field.value}
                            onValueChange={value => {
                                const selectedcollectionTest =
                                    collectionTest.find(m => m.value === value);
                                if (selectedcollectionTest) {
                                    form.setValue(
                                        "collectionTestId",
                                        selectedcollectionTest.value || ""
                                    );
                                    form.setValue(
                                        "collectionTestName",
                                        selectedcollectionTest.label || ""
                                    );
                                }
                            }}
                        />
                    )}
                />
            </div>
        </div>
    );
}
