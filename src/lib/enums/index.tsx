export const CollaboratorStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  ACCEPTED_SHADOW: 'ACCEPTED_SHADOW',
  REJECTED: 'REJECTED',
  DELETED: 'DELETED',
} as const

export type CollaboratorStatus = (typeof CollaboratorStatus)[keyof typeof CollaboratorStatus]

export const UserTypeEnum = {
  SUPERADMIN: 'SUPERADMIN',
  FACULTY: 'FACULTY',
  REGULAR: 'REGULAR',
} as const

export type UserTypeEnum = (typeof UserTypeEnum)[keyof typeof UserTypeEnum]

export const IdeaStageEnum = {
  STAGE_0: 'STAGE_0',
  STAGE_1: 'STAGE_1',
  STAGE_2: 'STAGE_2',
  STAGE_3: 'STAGE_3',
} as const

export type IdeaStageEnum = (typeof IdeaStageEnum)[keyof typeof IdeaStageEnum]

export const IdeaStatusEnum = {
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING: 'PENDING',
  IN_REVIEW: 'IN_REVIEW',
  COACH_PENDING: 'COACH_PENDING',
  COACH_REVIEW: 'COACH_REVIEW',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
} as const

export type IdeaStatusEnum = (typeof IdeaStatusEnum)[keyof typeof IdeaStatusEnum]

export const IdeaActionEnum = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  SUBMIT: 'SUBMIT',
  ACCEPT: 'ACCEPT',
  REJECT: 'REJECT',
  REWORK: 'REWORK',
  ACCEPT_ASSIGN: 'ACCEPT_ASSIGN',
  ASSIGN: 'ASSIGN',
  RATE: 'RATE',
} as const

export type IdeaActionEnum = (typeof IdeaActionEnum)[keyof typeof IdeaActionEnum]

export const QuestionGroupEnum = {
  STAGE_0: 'STAGE_0',
  STAGE_2: 'STAGE_2',
  STAGE_3: 'STAGE_3',
} as const

export type QuestionGroupEnum = (typeof QuestionGroupEnum)[keyof typeof QuestionGroupEnum]
export const MeetingStatusEnum = {
  CREATED: 'CREATED',
  ACCEPTED: 'ACCEPTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  PARTICIPANT_CANCELLED: 'PARTICIPANT_CANCELLED',
  FACULTY_CANCELLED: 'FACULTY_CANCELLED',
} as const

export type MeetingStatusEnum = (typeof MeetingStatusEnum)[keyof typeof MeetingStatusEnum]

export const MeetingTypeEnum = {
  FREE: 'FREE',
  PAID: 'PAID',
} as const

export type MeetingTypeEnum = (typeof MeetingTypeEnum)[keyof typeof MeetingTypeEnum]

export const IdeaCapabilityEnum = {
  BIVR_EDIT: 'BIVR_EDIT',
  BIVR_VIEW: 'BIVR_VIEW',
  MEETING_BOOK: 'MEETING_BOOK',
  EVENT_ENROLL: 'EVENT_ENROLL',
} as const

export type IdeaCapabilityEnum = (typeof IdeaCapabilityEnum)[keyof typeof IdeaCapabilityEnum]
