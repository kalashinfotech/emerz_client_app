import { z } from 'zod/v4'

export const sortQySchema = z.object({
  sorting: z
    .object({
      id: z.string(),
      desc: z
        .union([z.boolean(), z.string()])
        .transform((val) => (typeof val === 'boolean' ? val : val === 'true'))
        .default(false),
    })
    .array()
    .optional(),
})

export type SortSchemaQyDto = z.infer<typeof sortQySchema>
