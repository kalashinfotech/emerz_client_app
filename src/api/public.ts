import { queryOptions } from '@tanstack/react-query'

import type { FetchCountryListRsSchema, FetchStateListRsSchema } from '@/types/parameter'

import axios from './axios'

const baseSuburl = 'public'

export const validatePromoCode = async (promoCode: string, emailId?: string) => {
  const url = `${baseSuburl}/validate/promo-code`

  try {
    const response = await axios.get(url, {
      params: { promoCode, ...(emailId && { emailId }) },
      validateStatus: () => true, // let us handle 4xx/5xx manually
    })

    return {
      status: response.status,
      data: response.data,
    }
  } catch (error) {
    console.error('Error validating promo code', error)
    return {
      status: 500,
      data: { message: 'Server error while validating promo code' },
    }
  }
}

export const validatePromoCode1 = async (promoCode: string, emailId?: string) => {
  const url = `${baseSuburl}/validate/promo-code`
  try {
    const response = await axios.get(url, {
      params: { promoCode, ...(emailId && { emailId }) },
      validateStatus: () => true,
    })

    if (response.status === 204) {
      return true
    } else if (response.status === 400) {
      return false
    }
  } catch (error) {
    console.error('Error validating promo code', error)
    return false
  }
  return false
}

export const fetchCountryDropdown = (enabled: boolean = true) => {
  const endpoint = `${baseSuburl}/country`
  const queryKey = ['country']
  return queryOptions({
    queryKey,
    queryFn: async (): Promise<FetchCountryListRsSchema> => {
      const response = await axios.get(endpoint)
      return response.data
    },
    select: (data) => data.map((c) => ({ value: c.id.toString(), label: c.name })),
    enabled,
  })
}

export const fetchStateDropdown = (countryId: number, enabled: boolean = true) => {
  const endpoint = `${baseSuburl}/state`
  const queryKey = ['state', countryId]
  return queryOptions({
    queryKey,
    queryFn: async (): Promise<FetchStateListRsSchema> => {
      const response = await axios.get(endpoint, { params: { countryId } })
      return response.data
    },
    select: (data) => data.map((c) => ({ value: c.id.toString(), label: c.name })),
    enabled,
  })
}
