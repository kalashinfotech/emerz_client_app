import { z } from 'zod/v4'

export const UserTypeEnum = {
  SUPERADMIN: 'SUPERADMIN',
  FACULTY: 'FACULTY',
  REGULAR: 'REGULAR',
} as const

export type UserTypeEnum = (typeof UserTypeEnum)[keyof typeof UserTypeEnum]

export const baseUserAccountSchema = z.object({
  salutation: z.string().max(20).nullable(),
  firstName: z.string().max(100),
  middleName: z.string().max(100).nullable(),
  lastName: z.string().max(100),
  emailId: z.email().max(255),
  mobileNo: z.string().max(15).nullable(),
  dateOfBirth: z.string().nullable(),
  addressLine1: z.string().max(50),
  addressLine2: z.string().max(50).nullable(),
  countryId: z.coerce.number().nullable(),
  stateId: z.coerce.number().nullable(),
  userType: z.enum(UserTypeEnum),
  tosAgreed: z.boolean().nullable(),
})

export const bareUserAccountSchema = z
  .object({
    id: z.uuid(),
    displayId: z.string().max(20),
    salutation: z.string().max(20).nullable(),
    firstName: z.string().max(100),
    middleName: z.string().max(100).nullable(),
    lastName: z.string().max(100),
    userType: z.enum(UserTypeEnum),
  })
  .extend({ fullName: z.string().optional() })
  .transform((data) => {
    const fn = data.firstName
    const mn = data.middleName ?? ''
    const ln = data.lastName
    const sl = data.salutation ?? ''
    const fullName = [sl, fn, mn, ln]
      .filter((part) => part && part.trim().length > 0)
      .join(' ')
      .trim()
    return { ...data, fullName }
  })
