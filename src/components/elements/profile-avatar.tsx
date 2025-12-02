import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type ProfileAvatarProps = {
  firstName: string
  lastName: string
  imageUrl?: string
  subText?: string
}

const ProfileAvatar = ({ firstName, lastName, imageUrl, subText }: ProfileAvatarProps) => {
  const initials = `${firstName[0]}${lastName[0]}`
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage className="object-cover" src={imageUrl} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div>
        <p>
          {firstName} {lastName}
        </p>
        {subText && <p className="text-muted-foreground text-[0.7rem] font-medium">{subText}</p>}
      </div>
    </div>
  )
}

export { ProfileAvatar }
