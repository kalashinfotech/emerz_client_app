import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type AvatarUser = {
  firstName: string
  lastName: string
  profilePicId?: number | null
  userType?: unknown
}

type ProfileAvatarProps<T extends AvatarUser> = {
  user: T
  subText?: string
  tooltip?: string
}

const ProfileAvatar = <T extends AvatarUser>({ user, subText, tooltip }: ProfileAvatarProps<T>) => {
  const { firstName, lastName, profilePicId } = user
  const initials = `${firstName[0]}${lastName[0]}`

  const imageUrl = profilePicId
    ? 'userType' in user
      ? `${import.meta.env.VITE_BACKEND_URL}/admin/user-account/profile/${profilePicId}?size=thumbnail`
      : `${import.meta.env.VITE_BACKEND_URL}/client/participant/profile/${profilePicId}?size=thumbnail`
    : undefined

  const NameBlock = (
    <div>
      <p className="font-medium">
        {firstName} {lastName}
      </p>
      {subText && <p className="text-muted-foreground text-[0.7rem] font-medium">{subText}</p>}
    </div>
  )

  return (
    <div className="flex items-center gap-2">
      <Avatar className="ring-background ring-2">
        <AvatarImage className="object-cover" src={imageUrl} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      {tooltip ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help underline underline-offset-3">{NameBlock}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        NameBlock
      )}
    </div>
  )
}

export { ProfileAvatar }
