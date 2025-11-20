import { useEffect, useState } from 'react'

import { Link, useCanGoBack, useNavigate, useRouter } from '@tanstack/react-router'
import { ChevronLeftIcon, CircleX, IdCardLanyard, LogOut, MenuIcon, Settings, User } from 'lucide-react'

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
import { SidebarTrigger } from '../ui/sidebar'
import { NotificationMenu } from './notification-menu'

// import { ThemeToggle } from './theme-toggle'

const Header = () => {
  const { signOut, sessionInfo, authInitialized } = useAuth()
  const [open, setOpen] = useState<boolean>(false)
  const router = useRouter()
  const canGoBack = useCanGoBack()
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
        <div className="flex gap-4">
          <IdeasSearchCommand />
          <Button asChild className="animate-wiggle-sm hover:animate-none">
            <Link to="/idea/add">Create Idea</Link>
          </Button>
          <NotificationMenu />
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <Avatar>
                {sessionInfo.profilePicId && (
                  <AvatarImage
                    className="object-cover"
                    src={`${import.meta.env.VITE_BACKEND_URL}/client/participant/profile/${sessionInfo.profilePicId || 1}?size=thumbnail`}
                  />
                )}
                <AvatarFallback className="border">
                  <span className="text-xs">{initials}</span>
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-popover flex w-[200px] flex-col text-sm backdrop-blur-sm">
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
          {/* <div> */}
          {/*   <ThemeToggle /> */}
          {/* </div> */}
        </div>
      </header>
      <header className="flex h-16 items-center justify-between px-4 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          disabled={!canGoBack}
          onClick={() => {
            if (canGoBack) router.history.back()
          }}>
          <ChevronLeftIcon className="size-7" />
        </Button>
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
