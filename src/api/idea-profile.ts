import type { FetchIdeaProfileQuestionRsDto } from '@/types/idea-profile'

import { fetchQuery } from '.'

const baseSuburl = '/ideas'
const queryKey = ['ideas', 'questions']

export const fetchIdeaProfileQuestions = (enabled: boolean = true) => {
  const endpoint = `${baseSuburl}/profile-questions`
  return fetchQuery<FetchIdeaProfileQuestionRsDto>(endpoint, { queryKey: [...queryKey], enabled })
}
