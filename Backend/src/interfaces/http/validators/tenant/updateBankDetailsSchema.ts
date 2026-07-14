import { z } from "zod";

export const updateBankDetailsSchema = z.object({
    accountHolderName: z
        .string()
        .trim()
        .min(3, "Account holder name must be at least 3 characters")
        .max(100, "Account holder name must not exceed 100 characters"),

    accountNumber: z
        .string()
        .trim()
        .regex(/^\d{9,18}$/, "Account number must contain 9 to 18 digits"),

    ifscCode: z
        .string()
        .trim()
        .toUpperCase()
        .regex(
            /^[A-Z]{4}0[A-Z0-9]{6}$/,
            "Please enter a valid IFSC code"
        ),
});

export type UpdateBankDetailsRequest = z.infer<
    typeof updateBankDetailsSchema
>;