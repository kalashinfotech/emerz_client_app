import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronDown, ChevronsUpDown, LogOut, User2 } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

import { useAuth } from '@/hooks/use-auth'

import { menu } from '@/lib/menu'
import { cn } from '@/lib/utils'

import { IdeasList } from './ideas-list'

export function AppSidebar() {
  const navigate = useNavigate()
  const { state } = useSidebar()
  const { sessionInfo, signOut, setSessionInfo } = useAuth()
  if (!sessionInfo) return null
  const initials = `${sessionInfo.firstName[0]}${sessionInfo.lastName[0]}`
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="pointer-events-none h-auto">
              {state === 'expanded' ? (
                <img src="/logo-full.png" className="h-6" />
              ) : (
                <img src="/logo-small.png" className="h-4" />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {menu.menuGroups.map((group) => (
          <Collapsible key={`group-id-${group.id}`} defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                {group.name && (
                  <CollapsibleTrigger>
                    {group.name}
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                )}
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.menuItems.map((menuItem) => {
                      return (
                        <SidebarMenuItem key={`menu-item-${menuItem.id}`} className="group/icon">
                          <SidebarMenuButton asChild>
                            <Link to={menuItem.to}>
                              <menuItem.icon className={cn('text-primary', menuItem.animateClass)} />
                              <span className="text-foreground">{menuItem.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <p>Ideas</p>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <IdeasList />
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="size-8 rounded-sm">
                    {sessionInfo.profilePicId && (
                      <AvatarImage
                        className="object-cover"
                        src={`${import.meta.env.VITE_BACKEND_URL}/client/participant/profile/${sessionInfo.profilePicId}?size=thumbnail`}
                      />
                    )}
                    <AvatarFallback className="rounded-sm">
                      <span className="text-xs">{initials}</span>
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{sessionInfo.firstName}</p>
                    <p className="text-xs">{sessionInfo.emailId}</p>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem
                  onClick={() => {
                    signOut()
                    setSessionInfo(null)
                    navigate({ to: '/login', search: { redirect: '/dashboard' } })
                  }}>
                  <LogOut />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
