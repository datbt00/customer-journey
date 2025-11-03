import { ColumnVisibilityTargetProvider } from "@/components/ui/table/ColumnVisibilityTargetContext";
import SectionContent from "./section-content";

export default function CustomerJourney() {
    return (
        <ColumnVisibilityTargetProvider>
            <SectionContent />
        </ColumnVisibilityTargetProvider>
    );
}
