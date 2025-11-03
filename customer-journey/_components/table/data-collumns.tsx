"use client";

import * as campaignJourneyApi from "@/api/campaignJourneyApi";
import { PartnerData } from "@/app/(dashboard)/partner-context";
import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import { Checkbox } from "@/components/ui/selectionControls/checkbox";
import { Switch } from "@/components/ui/selectionControls/switch";
import { toast } from "@/hooks/use-toast";
import { isValidAuthority } from "@/lib/utils";
import { AccountState } from "@/redux/reducers/account";
import {
    CampaignJourneyRequest,
    CampaignJourneyResponse,
} from "@/types/campaignJourney";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye, MoreHorizontal, Pin, PinOff, SquarePen, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CAMPAIGN_STATUS } from "../../common";

const handleUpdateCampaign = (
    campaignId: string,
    request: CampaignJourneyRequest
) => {
    const router = useRouter();
    campaignJourneyApi.updateCampaignV2(campaignId, request).then(body => {
        if (body.data) {
            toast({
                title: "Thành công",
                description: "Thay đổi trạng thái chiến dịch thành công",
            });
            setTimeout(() => {
                router.refresh();
            }, 2000);
        } else {
            toast({
                title: "Lỗi",
                description: "Có lỗi xảy ra khi cập nhật trạng thái",
            });
        }
    });
};

function StatusCell({
    id,
    status,
    account,
    roleSuffix,
}: {
    id: string;
    status: string;
    account: AccountState;
    roleSuffix: string;
}) {
    const handleStatusChange = async () => {
        try {
            const havePermission = isValidAuthority(
                account,
                "MANAGE_CAMPAIGN_LOCK_UNLOCK_JOURNEY",
                roleSuffix
            );
            if (havePermission) {
                const newStatus = ["LOCKED"].includes(status)
                    ? "LAUNCHING"
                    : !["TESTING", "TESTED", "EXPIRED", "PENDING"].includes(
                        status
                    )
                        ? "LOCKED"
                        : "";
                if (newStatus) {
                    handleUpdateCampaign(id, { status: newStatus });
                }
            } else {
                toast({
                    title: "Lỗi",
                    description: "Bạn không có quyền Tắt/Bật chiến dịch",
                });
            }
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Có lỗi xảy ra khi cập nhật trạng thái",
            });
        }
    };

    return (
        <Switch
            checked={status === "LAUNCHING"}
            onCheckedChange={handleStatusChange}
        />
    );
}

export const getColumns = (
    account: AccountState,
    selectedPartner: PartnerData
): ColumnDef<CampaignJourneyResponse>[] => [
        {
            id: "select",
            size: 56,
            enableHiding: false,
            meta: {
                align: "center",
                hideActiionsButton: true,
            },
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={value =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={value => row.toggleSelected(!!value)}
                    />
                </div>
            ),
        },
        {
            id: "lock/unlock",
            accessorKey: "status",
            header: "Tắt/Bật",
            size: 80,
            enableHiding: false,
            meta: {
                align: "center",
                hideActiionsButton: true,
            },
            cell: ({ row }) => {
                const status = row.original.status as string;
                const id = row.original.id as string;
                return (
                    <StatusCell
                        id={id}
                        status={status}
                        account={account}
                        roleSuffix={selectedPartner.roleSuffix}
                    />
                );
            },
        },
        {
            id: "actions-column",
            enableHiding: false,
            size: 56,
            meta: {
                align: "center",
                hideActiionsButton: true,
            },
            cell: ({ row }) => {
                const id = row.original.id as string;
                const status = row.original.status as string;
                const createdBy = row.original.createdBy as string;
                return (
                    <div className="flex items-center justify-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    iconOnly
                                    variant="outline"
                                    className="h-8 w-8"
                                >
                                    <span className="sr-only">Mở hành động</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {isValidAuthority(
                                    account,
                                    "MANAGE_CAMPAIGN_VIEW_JOURNEY",
                                    selectedPartner.roleSuffix
                                ) ? (
                                    <Link
                                        href={`/campaign-management/${selectedPartner.partnerName.toLowerCase()}/customer-journey/detail-journey/${id}`}
                                    >
                                        <DropdownMenuItem>
                                            <Eye className="h-4 w-4 mr-2" />
                                            Xem chi tiết
                                        </DropdownMenuItem>
                                    </Link>
                                ) : null}
                                {isValidAuthority(
                                    account,
                                    "MANAGE_CAMPAIGN_CLONE_JOURNEY",
                                    selectedPartner.roleSuffix
                                ) ? (
                                    <Link
                                        href={`/campaign-management/${selectedPartner.partnerName.toLowerCase()}/customer-journey/clone-journey/${id}`}
                                    >
                                        <DropdownMenuItem>
                                            <Copy className="h-4 w-4 mr-2" />
                                            Sao chép
                                        </DropdownMenuItem>
                                    </Link>
                                ) : null}
                                {isValidAuthority(
                                    account,
                                    "MANAGE_CAMPAIGN_UPDATE_JOURNEY",
                                    selectedPartner.roleSuffix
                                ) ? (
                                    <Link
                                        href={`/campaign-management/${selectedPartner.partnerName.toLowerCase()}/customer-journey/edit-journey/${id}`}
                                    >
                                        <DropdownMenuItem>
                                            <SquarePen className="h-4 w-4 mr-2" />
                                            Chỉnh sửa
                                        </DropdownMenuItem>
                                    </Link>
                                ) : null}
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleUpdateCampaign(id, {
                                            status: "DELETED",
                                        })
                                    }
                                >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Xoá
                                </DropdownMenuItem>
                                {status === "TESTED" &&
                                    account?.user_name === createdBy ? (
                                    <DropdownMenuItem
                                        onClick={() =>
                                            handleUpdateCampaign(id, {
                                                status: "PENDING",
                                            })
                                        }
                                    >
                                        Gửi duyệt
                                    </DropdownMenuItem>
                                ) : null}
                                {status === "PENDING" &&
                                    isValidAuthority(
                                        account,
                                        "MANAGE_CAMPAIGN_APPROVAL_JOURNEY",
                                        selectedPartner.roleSuffix
                                    ) ? (
                                    <DropdownMenuItem
                                        onClick={() =>
                                            handleUpdateCampaign(id, {
                                                status: "LAUNCHING",
                                            })
                                        }
                                    >
                                        Duyệt
                                    </DropdownMenuItem>
                                ) : null}
                                {
                                    row.getIsPinned() ? (
                                        <DropdownMenuItem onClick={
                                            () => row.pin(false)
                                        }>
                                            <PinOff className="h-4 w-4 mr-2" />
                                            Bỏ Gim
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem onClick={() =>
                                            row.pin('top')
                                        }>
                                            <Pin className="h-4 w-4 mr-2" />
                                            Gim
                                        </DropdownMenuItem>
                                    )
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        {
            accessorKey: "campaignName",
            header: "Chiến dịch tùy chỉnh",
            size: 200,
            cell: ({ row }) => {
                const campaignName = row.original.campaignName as string;
                const id = row.original.id as string;
                return (
                    <Button
                        asChild
                        variant="link"
                        className="text-primary p-0 h-auto justify-start underline"
                    >
                        <Link
                            href={`/campaign-management/${selectedPartner.partnerName.toLowerCase()}/customer-journey/detail-journey/${id}`}
                        >
                            {campaignName}
                        </Link>
                    </Button>
                );
            },
        },
        {
            accessorKey: "masterCampaignName",
            header: "Chiến dịch tổng",
            size: 200,
        },
        {
            accessorKey: "serviceCode",
            header: "Dịch vụ",
            size: 200,
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ cell }) => {
                const status = cell.getValue() as string;
                return (
                    <div>
                        <Badge
                            variant={
                                status === "LAUNCHING"
                                    ? "lightGreen"
                                    : status === "PENDING"
                                        ? "lightOrange"
                                        : "default"
                            }
                        >
                            {CAMPAIGN_STATUS.find(s => s.value === status)?.label}
                        </Badge>
                    </div>
                );
            },
            size: 120,
        },
        {
            accessorKey: "totalProfiles",
            header: "Số KH dự kiến",
            meta: {
                align: "right",
            },
            cell: ({ cell }) => {
                const totalProfiles = cell.getValue() as number;
                return (
                    <div>
                        {typeof totalProfiles === "number"
                            ? totalProfiles.toLocaleString()
                            : totalProfiles}
                    </div>
                );
            },
            size: 200,
        },
        {
            accessorKey: "totalBlacklists",
            meta: {
                align: "right",
            },
            header: "Số KH trong blacklist",
            cell: ({ cell }) => {
                const totalBlacklists = cell.getValue() as number;
                return (
                    <div>
                        {typeof totalBlacklists === "number"
                            ? totalBlacklists.toLocaleString()
                            : totalBlacklists}
                    </div>
                );
            },
            size: 200,
        },
    ];
