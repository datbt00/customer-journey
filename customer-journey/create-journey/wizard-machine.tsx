"use client";

import { createActorContext } from "@xstate/react";
import { FileCheck, Settings, Users, View } from "lucide-react";
import { assign, createMachine } from "xstate";

interface WizardContext {
    formData: Record<string, any>;
}

export const stepConfig = {
    "step-1": { title: "Thiết lập chung", icon: <Settings /> },
    "step-2": { title: "Tạo kịch bản", icon: <Users /> },
    review: { title: "Xem lại", icon: <View /> },
    success: { title: "Thành công", icon: <FileCheck /> },
} as const;

export const wizardMachine = createMachine({
    id: "wizard",
    initial: "step-1",
    context: {
        formData: {},
    } as WizardContext,
    states: {
        "step-1": {
            meta: stepConfig["step-1"],
            on: {
                NEXT: {
                    target: "step-2",
                    actions: assign({
                        formData: ({ context, event }) => ({
                            ...context.formData,
                            ...("data" in event ? event.data : {}),
                        }),
                    }),
                },
            },
        },
        "step-2": {
            meta: stepConfig["step-2"],
            on: {
                PREV: "step-1",
                NEXT: {
                    target: "review",
                    actions: assign({
                        formData: ({ context, event }) => ({
                            ...context.formData,
                            ...("data" in event ? event.data : {}),
                        }),
                    }),
                },
            },
        },
        review: {
            meta: stepConfig.review,
            on: {
                PREV: "step-2",
                SUBMIT: {
                    target: "success",
                    actions: assign({
                        formData: ({ context, event }) => ({
                            ...context.formData,
                            ...("data" in event ? event.data : {}),
                        }),
                    }),
                },
            },
        },
        success: {
            meta: stepConfig.success,
            on: {
                RESTART: {
                    target: "step-1",
                    actions: assign({ formData: {} }),
                },
            },
        },
    },
});

const WizardActorContext = createActorContext(wizardMachine);

const WizardProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <WizardActorContext.Provider>{children}</WizardActorContext.Provider>
    );
};

export { WizardActorContext, WizardProvider };
