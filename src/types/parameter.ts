import type { z } from 'zod/v4'

import type { fetchCountryListRsSchema, fetchStateListRsSchema } from '@/lib/schemas/parameter'

export type FetchStateListRsSchema = z.infer<typeof fetchStateListRsSchema>
export type FetchCountryListRsSchema = z.infer<typeof fetchCountryListRsSchema>
