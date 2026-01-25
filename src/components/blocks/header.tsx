import { useEffect, useState } from 'react'

import { useNavigate, useRouter } from '@tanstack/react-router'
import { CircleX, IdCardLanyard, LogOut, MenuIcon, Settings, User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Loader } from '@/components/elements/loader'

import { useAuth } from '@/hooks/use-auth'

import { IdeasSearchCommand } from '../elements/idea-search-menu'
import { Kbd } from '../ui/kbd'
import { SidebarTrigger, SidebarTriggerMobile } from '../ui/sidebar'
import { NotificationMenu } from './notification-menu'
import { ThemeToggle } from './theme-toggle'

const Header = () => {
  const { signOut, sessionInfo, authInitialized } = useAuth()
  const [open, setOpen] = useState<boolean>(false)
  const router = useRouter()
  const navigate = useNavigate()
  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }

    return () => {
      document.body.classList.remove('overflow-hidden') // clean-up just in case
    }
  }, [open])

  // Keyboard shortcut: I
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === 'i' &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault()
        navigate({ to: '/idea/add' })
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!authInitialized) {
    return <Loader />
  }
  if (!sessionInfo) return null

  const initials = `${sessionInfo.firstName[0]}${sessionInfo.lastName[0]}`

  return (
    <>
      <header className="hidden h-16 items-center justify-between pr-8 pl-2 md:flex">
        <div className="py-4">
          <SidebarTrigger className="" size="icon" variant="ghost" />
        </div>
        <div className="flex items-center gap-4">
          <IdeasSearchCommand
            onSelect={(ideaId) => {
              navigate({ to: '/idea/$ideaId', params: { ideaId } })
            }}
          />
          <Button className="animate-wiggle-sm hover:animate-none">
            Create Idea
            <Kbd data-icon="inline-end" className="translate-x-0.5 font-mono">
              I
            </Kbd>
          </Button>
          <NotificationMenu />
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <Avatar>
                {sessionInfo.profilePicId && (
                  <AvatarImage
                    className="object-cover"
                    src={`${import.meta.env.VITE_BACKEND_URL}/client/participant/profile/${sessionInfo.profilePicId || 0}?size=thumbnail`}
                  />
                )}
                <AvatarFallback className="border">
                  <span className="text-xs">{initials}</span>
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-popover flex min-w-[200px] flex-col text-sm backdrop-blur-sm">
              <DropdownMenuItem className="pointer-events-none">
                <User />
                <div>
                  {sessionInfo.firstName}
                  <p className="text-muted-foreground text-xs">{sessionInfo.emailId}</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="pointer-events-none">
                  <IdCardLanyard />
                  <div>
                    Client ID
                    <p className="text-muted-foreground text-xs">{sessionInfo.displayId}</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="flex flex-col">
                <DropdownMenuItem
                  onClick={() => {
                    navigate({ to: '/settings' })
                  }}>
                  <Settings />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut()
                    router.invalidate()
                    navigate({ to: '/login', search: { redirect: '/dashboard' } })
                  }}>
                  <LogOut />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <header className="flex h-16 items-center justify-between px-4 md:hidden">
        <div className="flex items-center gap-4">
          <div className="py-4">
            <SidebarTriggerMobile className="size-8" size="icon" variant="ghost" />
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <MenuIcon className="size-7" />
        </Button>
      </header>
      {open && (
        <div className="absolute top-0 left-0 z-50 h-screen w-full bg-white/60 backdrop-blur-sm">
          <header className="flex h-16 items-center justify-end border border-b px-8 md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <CircleX className="size-7" />
            </Button>
          </header>
          <nav></nav>
        </div>
      )}
    </>
  )
}

export default Header
