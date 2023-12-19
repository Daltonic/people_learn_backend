import { number, object, string, z } from "zod";

export const createPromoSchema = object({
  body: object({
    code: string({ required_error: "Promo code is required" }),
    percentage: number({ required_error: "Percentage must be a number" }).min(
      0
    ),
    promoType: z.enum(["SiteWidePromo", "InstructorPromo", "ManualSalesPromo"]),
  }).refine(
    (data) =>
      data.promoType === "InstructorPromo"
        ? data.percentage <= Number(process.env.MAXIMUM_INSTRUCTOR_PROMO)
        : data.percentage <= 100,
    {
      message: `Maximum allowable percentage exceeded`,
      path: ["percentage"],
    }
  ),
});

export const validatePromoSchema = object({
  params: object({
    promoId: string(),
  }),
});

export const invalidatePromoSchema = object({
  params: object({
    promoId: string(),
  }),
});
