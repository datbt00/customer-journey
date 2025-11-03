import { usePartnerName } from "@/app/(dashboard)/partner-context";
import { DataTable } from "@/components/ui/table/custom-data-table";
import { useAppSelector } from "@/redux/hooks";
import { CampaignJourneyResponse } from "@/types/campaignJourney";
import { getColumns } from "./data-collumns";

export default function Table({
    data,
    quantityPerPage,
    page,
    dataLength,
    onPageChange,
    onQuantityChange,
    reload,
}: {
    data: CampaignJourneyResponse[];
    quantityPerPage: number;
    page: number;
    dataLength: number;
    onQuantityChange: (value: number) => void;
    onPageChange: (value: number) => void;
    reload: () => void;
}) {
    const account = useAppSelector(state => state.account);
    const { selectedPartner } = usePartnerName();
    return (
        <DataTable
            onPageChange={onPageChange}
            columns={getColumns(account, selectedPartner)}
            dataLength={dataLength}
            data={data}
            page={page}
            showFooter
            defaultPinLeft={[""]}
            quantityPerPage={quantityPerPage}
            onQuantityChange={onQuantityChange}
            reload={reload}
            isEmptyFilter
        />
    );
}
