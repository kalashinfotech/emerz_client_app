import z from 'zod/v4'

export const responseSchema = z.object({
  id: z.uuid().or(z.number()),
})
