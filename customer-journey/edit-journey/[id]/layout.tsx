import { SectionGrid } from "@/components/ui/grid/grid";
import { H2 } from "@/components/ui/typography/typography";
import { StepperLayout } from "../../create-journey/_components/stepper-layout";
import { WizardProvider } from "../../create-journey/wizard-machine";

export const metadata = {
    title: "Chỉnh sửa chiến dịch",
};

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <WizardProvider>
            <div className="flex flex-col h-full">
                <SectionGrid className="px-6 !my-[24px]">
                    <div className="max-w-[1200px] mx-auto flex flex-row justify-between items-center">
                        <H2 className="flex-1">{metadata.title}</H2>
                        <StepperLayout />
                    </div>
                </SectionGrid>
                {children}
            </div>
        </WizardProvider>
    );
}
