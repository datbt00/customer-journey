import { z } from "zod";

const FormSchema = z.object({
    bankCode: z.string().optional(),
    partnerName: z.string().optional(),
    nodes: z.array(z.any()).optional(),
    edges: z.array(z.any()).optional(),
    serviceCode: z.string().optional(),
});

export { FormSchema };

