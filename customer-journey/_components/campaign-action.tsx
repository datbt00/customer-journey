"use client";

import * as campaignJourneyApi from "@/api/campaignJourneyApi";
import { usePartnerName } from "@/app/(dashboard)/partner-context";
import {
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog/alert-dialog";
import { BackButton } from "@/components/ui/button/back-button";
import { Button } from "@/components/ui/button/button";
import { useAlertDialog } from "@/hooks/use-alert-dialog";
import { toast } from "@/hooks/use-toast";
import { isValidAuthority } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { CampaignJourneyResponse } from "@/types/campaignJourney";
import { useRouter } from "next/navigation";

export default function CampaignAction({
    campaign,
}: {
    campaign?: CampaignJourneyResponse;
}) {
    const { selectedPartner } = usePartnerName();
    const router = useRouter();
    const account = useAppSelector(state => state.account);
    const { showAlertDialog, dismiss } = useAlertDialog();

    const updateCampaign = (
        campaignId: string,
        status: string,
        action: string
    ) => {
        campaignJourneyApi
            .updateCampaignV2(campaignId, { status })
            .then(body => {
                if (body?.result?.success) {
                    toast({
                        title: `Đã ${action} chiến dich thành công`,
                        variant: "success",
                    });
                    router.push(
                        `/campaign-management/${selectedPartner?.partnerName?.toLowerCase()}`
                    );
                } else {
                    toast({
                        title: body?.result?.message || "Có lỗi xảy ra",
                        variant: "destructive",
                    });
                }
            });
    };

    function checkSmsChannel(isJourney: boolean, nodes: Node[]): boolean {
        return nodes.some((node) => {
            // check channelId
            if (node && node?.data) {
                if (!isJourney && node?.data?.channelId === "sms") {
                    // check typeSms inside data.info.value
                    const typeSms = node.data?.info?.value?.typeSms;
                    return typeSms === "CSKH";
                }
                else if (isJourney && node.data?.channel === "SMS") {
                    const typeSms = node.data?.typeSms;
                    return typeSms === "CSKH";
                }
            }
            return false;
        });
    }

    const changeCampaignStatus = (
        campaignId: string,
        action: string,
        status: string,
        totalProfiles?: number
    ) => {
        if (campaignId && status) {
            const isLaunching = status === "LAUNCHING" && action !== "mở khóa";
            // const isPending = status === "PENDING";
            const isCancelled = status === "CANCELLED";
            // const isDeleted = status === "DELETED";
            // const isLocked = status === "LOCKED";
            // const isUnlocked = status === "LAUNCHING" && action === "mở khóa"
            const isJourney = campaign?.partnerName?.includes("GRAPH") as boolean;
            const hasSmsChannel = checkSmsChannel(isJourney, JSON.parse(campaign?.nodes as string) || []);

            showAlertDialog({
                description: (
                    <div className="space-y-4 my-4">
                        {/* Main confirmation question */}
                        <div className="text-start">
                            <p className="text-lg text-gray-700">
                                Bạn có chắc chắn muốn{" "}
                                <span className={`font-semibold`}>
                                    {action}
                                </span>{" "}
                                chiến dịch này?
                            </p>
                        </div>

                        {/* Campaign launch warning */}
                        {isLaunching && (
                            <>
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <span className="text-xl">📬</span>
                                            </div>
                                            {/* Total profiles info */}
                                            <div className="flex-1">
                                                <p className="text-blue-800 font-medium mb-1">Gửi tới khách hàng</p>
                                                <p className="text-gray-700 text-base leading-relaxed">
                                                    {campaign?.usedWhileList ? (
                                                        <>Chiến dịch sẽ gửi tin đến tệp khách hàng <span className="font-semibold">Whitelist</span>.</>
                                                    ) : (
                                                        <>
                                                            Chiến dịch sẽ gửi tin đến{" "}
                                                            <span className="text-blue-900 text-2xl font-bold">
                                                                {totalProfiles || 0}
                                                            </span>{" "}
                                                            khách hàng thỏa mãn điều kiện.
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {hasSmsChannel && <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                            <span className="text-red-600 text-sm font-bold">!</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-red-800 font-medium mb-1">
                                                Cảnh báo quan trọng
                                            </p>
                                            <p className="text-red-700 text-base leading-relaxed">
                                                Tin CSKH không thông qua DVVT kiểm duyệt, vui lòng đảm bảo nội dung tin nhắn chính xác và phù hợp với mục đích của chiến dịch.
                                            </p>
                                        </div>
                                    </div>
                                </div>}
                            </>
                        )}
                    </div>
                ),
                title: <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-[#005aa8]/10 to-[#005aa8]/20 flex items-center justify-center backdrop-blur-sm border border-[#005aa8]/20`}>
                        <svg className={`w-6 h-6 text-[#005aa8]`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Xác nhận hành động
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Vui lòng xem xét kỹ trước khi tiếp tục</p>
                    </div>
                </div>,
                action: (
                    <>
                        <AlertDialogCancel
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 font-medium py-2.5"
                            onClick={() => dismiss()}
                        >
                            <span className="mr-2">✕</span>
                            Hủy bỏ
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className={`flex-1 font-medium py-2.5 ${(isLaunching)
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                            onClick={() => {
                                updateCampaign(campaignId, status, action);
                            }}
                        >
                            <span className="mr-2">
                                {isLaunching ? "🚀" : "✓"}
                            </span>
                            {isCancelled || isLaunching ? "Xác nhận" : "Đồng ý"}
                        </AlertDialogAction>
                    </>
                ),
            });
        }
    };

    return (
        <div className="flex justify-center md:justify-end gap-2 pb-6">
            <BackButton
                className="min-w-[150px] -md:flex-1"
                variant="outline"
            />
            {campaign?.id &&
                campaign?.status === "PENDING" &&
                isValidAuthority(
                    account,
                    "MANAGE_CAMPAIGN_APPROVAL",
                    selectedPartner?.journeyRoleSuffix
                ) &&
                account?.user_name !== campaign?.createdBy && (
                    <>
                        <Button
                            className="min-w-[150px] -md:flex-1"
                            variant="destructive"
                            onClick={() =>
                                changeCampaignStatus(
                                    campaign.id,
                                    "từ chối duyệt",
                                    "CANCELLED"
                                )
                            }
                        >
                            Từ chối duyệt
                        </Button>
                        <Button
                            className="min-w-[150px] -md:flex-1 bg-green-600 hover:bg-green-600"
                            variant="default"
                            onClick={() =>
                                changeCampaignStatus(
                                    campaign.id,
                                    "duyệt",
                                    "LAUNCHING",
                                    campaign.totalProfiles
                                )
                            }
                        >
                            Duyệt
                        </Button>
                    </>
                )}
        </div>
    );
}
