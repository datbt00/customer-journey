import { z } from "zod";

// Helper function cho required string với default value
const zodRequiredString = (message: string) =>
    z
        .string()
        .default("")
        .refine(value => value.length > 0, {
            message,
        });

const FormSchema = z.object({
    // Các trường required với validation
    campaignCode: zodRequiredString("Vui lòng nhập mã chiến dịch"),
    campaignName: zodRequiredString("Vui lòng nhập tên chiến dịch"),
    bankCode: zodRequiredString("Vui lòng chọn ứng dụng"),
    bankName: z.string().optional(),
    masterCampaignId: zodRequiredString("Vui lòng chọn chiến dịch tổng"),

    // Các trường optional với default value
    masterCampaignCode: zodRequiredString("Vui lòng chọn chiến dịch tổng"),
    masterCampaignName: z.string().default(""),

    // Các trường date với validation
    startDate: z
        .date()
        .optional()
        .refine(date => date !== undefined, {
            message: "Vui lòng chọn ngày bắt đầu (*)",
        }),
    endDate: z
        .date()
        .optional()
        .refine(date => date !== undefined, {
            message: "Vui lòng chọn ngày kết thúc (*)",
        }),

    // Các trường optional
    description: z.string().default(""),

    // Trường required với validation
    services: zodRequiredString("Vui lòng chọn dịch vụ"),

    // Các trường optional với default value
    serviceCode: z.string().default(""),
    partnerName: z.string().default(""),
    usedBlackList: z.boolean().default(false),
    blackListServiceIds: z.array(z.string()).default([]),
    collectionTestId: zodRequiredString("Vui lòng chọn nhóm khách hàng test"),
    collectionTestName: z.string().default(""),
    usedWhileList: z.boolean().default(false),
});

// Thêm validation cho ngày bắt đầu và kết thúc
const FormSchemaWithDateValidation = FormSchema.refine(
    data => {
        if (data.startDate && data.endDate) {
            return data.endDate >= data.startDate;
        }
        return true;
    },
    {
        message: "Ngày kết thúc phải sau ngày bắt đầu",
        path: ["endDate"],
    }
);

export { FormSchemaWithDateValidation as FormSchema };

