"use client";

import { mapRequestToFormChannel } from "@/components/ui/flows/journey/common";
import { useDraft } from "@/contexts/draft-context";
import { loadDraftCampaign } from "@/lib/utils";
import { CampaignJourneyRequest } from "@/types/campaignJourney";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, ReactNode, useContext, useEffect } from "react";
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
type PageFormProviderProps = {
    children: ReactNode;
    request: CampaignJourneyRequest;
    setRequest: (data: CampaignJourneyRequest) => void;
};

function PageFormProvider({
    children,
    request,
    setRequest,
}: PageFormProviderProps) {
    const wizardActorRef = WizardActorContext.useActorRef();
    // Draft store logic: provides current draft data, load status, and a debounced save function
    const { draftData, isDraftLoaded, draftType, isClone, debouncedSaveDraft } = useDraft();

    // Form Initialization with Default Values (Order Matters)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            bankCode: request.bankCode,
            partnerName: request.partnerName,
            serviceCode: request.serviceCode,
            nodes: request?.nodes
                ? JSON.parse(request.nodes)?.map(node =>
                    mapRequestToFormChannel(node.channel, node)
                )
                : [],
            edges: request?.edges ? JSON.parse(request.edges) : [],
        },
    });

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        setRequest({
            ...request,
            nodes:
                data?.nodes?.length > 0
                    ? JSON.stringify(data.nodes)
                    : request.nodes,
            edges:
                data?.edges?.length > 0
                    ? JSON.stringify(data.edges)
                    : request.edges,
        });
        wizardActorRef.send({
            type: "NEXT",
            data,
            isValid: form.formState.isValid,
        });
    };

    useEffect(() => {
        if (isClone) return;
        if (isDraftLoaded && draftData && draftData['data']) {
            const draft = loadDraftCampaign(draftType);
            const data = draft['data']
            form.reset(data);
        }
    }, [isDraftLoaded, draftData, isClone]);

    useEffect(() => {
        if (isClone) return;
        const subscription = form.watch(value => {
            debouncedSaveDraft(draftType, value);
        });
        return () => subscription.unsubscribe();
    }, [form.watch, isClone]);

    return (
        <PageFormContext.Provider value={{ form, onSubmit }}>
            <form
                id="form-step-2-journey"
                className="flex flex-1 flex-col h-full"
                onSubmit={form.handleSubmit((data, event) => {
                    if (event?.target?.id === "form-step-2-journey") {
                        onSubmit(data);
                    }
                })}
            >
                {children}
            </form>
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

