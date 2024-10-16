import z from "zod";

export const userInfoSchema = z.object({
    name: z.string(),  
    email: z.string().email(),
    phone: z.string().length(10),
    balance: z.number()
})