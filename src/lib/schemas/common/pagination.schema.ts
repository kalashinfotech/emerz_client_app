import { z } from 'zod/v4'

export const paginationQySchema = z.object({
  page: z.coerce.number().min(0).default(0),
  pageSize: z.coerce.number().min(1).max(1000).default(10),
})

export const paginationRsSchema = z.object({
  totalRows: z.number(),
  totalPages: z.number(),
  pageSize: z.number(),
  currentPage: z.number(),
})
