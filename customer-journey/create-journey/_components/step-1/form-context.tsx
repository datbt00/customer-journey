"use client";

import { AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog/alert-dialog";
import { Form } from "@/components/ui/form/form";
import { useAlertDialog } from "@/hooks/use-alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { CampaignJourneyRequest } from "@/types/campaignJourney";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { createContext, useContext } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { WizardActorContext } from "../../wizard-machine";
import { FormSchema } from "./schema";

// Define the type for the form context
type PageFormContextType = {
    form: UseFormReturn<z.infer<typeof FormSchema>>;
    onSubmit: (data: z.infer<typeof FormSchema>) => void;
};

// Create the context
const PageFormContext = createContext<PageFormContextType | undefined>(
    undefined
);

// Provider component
interface PageFormProviderProps {
    children: React.ReactNode;
    request: CampaignJourneyRequest;
    setRequest: (data: CampaignJourneyRequest) => void;
    onCheckCampaignCodeExisted: (campaignCode: string) => Promise<boolean>;
}

function PageFormProvider({
    children,
    request,
    setRequest,
    onCheckCampaignCodeExisted,
}: PageFormProviderProps) {
    const wizardActorRef = WizardActorContext.useActorRef();
    const { toast } = useToast();
    // Form Initialization with Default Values (Order Matters)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            campaignCode: request.campaignCode || "",
            campaignName: request.campaignName || "",
            bankCode: request.bankCode || "",
            bankName: request.bankName || "",
            masterCampaignId: request.masterCampaignId || "",
            masterCampaignCode: request.masterCampaignCode || "",
            masterCampaignName: request.masterCampaignName || "",
            startDate: request.startDate
                ? new Date(request.startDate)
                : undefined,
            partnerName: request.partnerName,
            endDate: request.endDate ? new Date(request.endDate) : undefined,
            description: request.description || "",
            services: request.services || "",
            serviceCode: request.serviceCode || "",
            usedBlackList: request.usedBlackList != null ? request.usedBlackList : true,
            blackListServiceIds: request.blackListServiceIds || [],
            collectionTestId: request.collectionTestId || "",
            collectionTestName: request.collectionTestName || "",
            usedWhileList: request.usedWhileList != null ? request.usedWhileList : true,
        },
    });
    const { showAlertDialog, dismiss } = useAlertDialog();

    const nextStep = (data: z.infer<typeof FormSchema>) => {
        wizardActorRef.send({
            type: "NEXT",
            data: data,
            isValid: form.formState.isValid,
        });
    }

    const checkBlacklist = (data: z.infer<typeof FormSchema>) => {
        if (!data.usedBlackList) {
            showAlertDialog({
                description: `Bạn chắc chắn KHÔNG kiểm tra BLACK LIST không?`,
                title: "Xác nhận",
                action: (
                    <>
                        <AlertDialogCancel onClick={() => dismiss}>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => nextStep(data)}
                        >
                            Xác nhận
                        </AlertDialogAction>
                    </>
                ),
            });
        } else {
            nextStep(data);
        }
    }

    const checkWhiteList = (data: z.infer<typeof FormSchema>) => {
        if (!data.usedWhileList) {
            showAlertDialog({
                description: `Bạn chắc chắn KHÔNG kiểm tra WHITE LIST không?`,
                title: "Xác nhận",
                action: (
                    <>
                        <AlertDialogCancel onClick={() => dismiss}>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => checkBlacklist(data)}
                        >
                            Xác nhận
                        </AlertDialogAction>
                    </>
                ),
            });
        } else {
            checkBlacklist(data);
        }
    }

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        const isNotCodeExisted = await onCheckCampaignCodeExisted(
            data.campaignCode
        );
        if (!isNotCodeExisted) {
            toast({
                title: "Lỗi",
                description: "Mã chiến dịch đã tồn tại",
            });
            return;
        }
        setRequest({
            ...request,
            ...data,
        });
        checkWhiteList(data);
    };

    return (
        <PageFormContext.Provider value={{ form, onSubmit }}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
            </Form>
        </PageFormContext.Provider>
    );
}

// Custom hook to use the form context
function usePageFormContext() {
    const context = useContext(PageFormContext);
    if (context === undefined) {
        throw new Error(
            "usePageFormContext must be used within an PageFormProvider"
        );
    }
    return context;
}

export { PageFormProvider, usePageFormContext };

