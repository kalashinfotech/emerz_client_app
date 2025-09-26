import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { CircleAlertIcon, Lightbulb, PlusCircle } from 'lucide-react'

import { Spinner } from '@/components/ui/spinner'

import { fetchMyIdeasList } from '@/api/ideas'

import { cn } from '@/lib/utils'

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'

export const IdeasList = () => {
  const { data, isLoading, isError } = useQuery(
    fetchMyIdeasList(
      0,
      [],
      [
        { id: 'createdAt', desc: true },
        { id: 'id', desc: false },
      ],
      5,
    ),
  )
  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="default">
            <Spinner className="bg-primary text-sm" size="sm" />
            <span>Please wait...</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }
  if (isError) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="default" className="text-destructive">
            <CircleAlertIcon />
            <span className="text-xs">There was an error loading your ideas.</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      {data?.data.map((idea) => (
        <SidebarMenuItem key={`idea-${idea.id}`} className="group/icon">
          <SidebarMenuButton asChild size="lg">
            <Link to="/idea/$ideaId" params={{ ideaId: idea.id }}>
              <Lightbulb className="text-primary group-hover/icon:animate-spinner-leaf-fade" />
              <span>
                <p className="truncate">{idea.title}</p>
                <p className={cn('text-muted-foreground', { italic: idea.isOwner })}>{idea.owner.emailId}</p>
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
      <SidebarMenuItem className="group/icon">
        <SidebarMenuButton asChild>
          <Link to="/idea/add">
            <PlusCircle className="text-primary group-hover/icon:animate-bounce" />
            <span className="text-primary">Create Idea</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
