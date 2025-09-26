import { z } from 'zod/v4'

import { bareInstitutionSchema } from './institution'

const baseBatchSchema = z.object({
  name: z.string().max(100).optional(),
  noOfParticipants: z.number().gt(0),
})

export const batchSchema = baseBatchSchema.extend({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  institution: bareInstitutionSchema,
})
export const bareBatchSchema = batchSchema.pick({ id: true, name: true })
export const bareBatchSchemaWithInstitution = batchSchema.pick({
  id: true,
  name: true,
  institution: true,
})
