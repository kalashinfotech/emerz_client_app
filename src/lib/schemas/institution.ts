import { z } from 'zod/v4'

const baseInstitutionSchema = z.object({
  name: z.string().max(255),
})

export const institutionSchema = baseInstitutionSchema.extend({
  id: z.int(),
  isActive: z.boolean(),
})

export const bareInstitutionSchema = institutionSchema.pick({
  id: true,
  name: true,
})
