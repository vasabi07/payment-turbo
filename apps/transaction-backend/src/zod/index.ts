import z from "zod";

export const transactionSchema = z.object({
    receiverId: z.string(), // Keep as string or convert it in your logic
    amount: z.number().positive() // Ensure it’s a positive number
});
