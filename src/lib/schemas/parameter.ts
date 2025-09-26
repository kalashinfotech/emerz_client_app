import { z } from 'zod/v4'

const baseCountrySchema = z.object({
  name: z.string(),
})

export const countrySchema = baseCountrySchema.extend({
  id: z.int(),
})
export const bareCountrySchema = countrySchema.pick({
  id: true,
  name: true,
})

const baseStateSchema = z.object({
  name: z.string(),
  countryId: z.int(),
})

export const stateSchema = baseStateSchema.extend({
  id: z.int(),
  country: bareCountrySchema,
})
export const bareStateSchema = stateSchema.pick({
  id: true,
  name: true,
  countryId: true,
})

export const fetchStateListRsSchema = z.array(stateSchema)
export const fetchCountryListRsSchema = z.array(countrySchema)
