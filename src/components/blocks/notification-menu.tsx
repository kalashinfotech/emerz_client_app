import { useState } from 'react'

import { BellIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const initialNotifications = [
  {
    id: 1,
    user: 'Bramhan Jain',
    action: 'accepted your collaboration',
    target: 'request',
    timestamp: '12 hours ago',
    unread: true,
  },
  {
    id: 2,
    user: 'Bramhan Jain',
    action: 'updated the answer for',
    target: 'Idea Lorem Text Generator',
    timestamp: '45 minutes ago',
    unread: true,
  },
  {
    id: 3,
    user: 'You',
    action: 'sent collaboration request to',
    target: 'darshan.jain@gmail.com',
    timestamp: '4 hours ago',
    unread: false,
  },
  {
    id: 4,
    user: 'Your',
    action: 'idea status has changed from Draft to',
    target: 'In Progress',
    timestamp: '12 hours ago',
    unread: false,
  },
]

function Dot({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true">
      <circle cx="3" cy="3" r="3" />
    </svg>
  )
}

export function NotificationMenu() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const unreadCount = notifications.filter((n) => n.unread).length

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      })),
    )
  }

  const handleNotificationClick = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, unread: false } : notification)),
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline" className="relative size-9 rounded-full" aria-label="Open notifications">
          <BellIcon aria-hidden="true" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1 text-[0.6rem]">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-1">
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="text-sm font-semibold">Notifications</div>
          {unreadCount > 0 && (
            <button className="text-xs font-medium hover:underline" onClick={handleMarkAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>
        <div role="separator" aria-orientation="horizontal" className="bg-border -mx-1 my-1 h-px"></div>
        {notifications.map((notification) => (
          <div key={notification.id} className="hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors">
            <div className="relative flex items-start pe-3">
              <div className="flex-1 space-y-1">
                <button
                  className="text-foreground/80 text-left after:absolute after:inset-0"
                  onClick={() => handleNotificationClick(notification.id)}>
                  <span className="text-foreground font-medium hover:underline">{notification.user}</span>{' '}
                  {notification.action}{' '}
                  <span className="text-foreground font-medium hover:underline">{notification.target}</span>.
                </button>
                <div className="text-muted-foreground text-xs">{notification.timestamp}</div>
              </div>
              {notification.unread && (
                <div className="absolute end-0 self-center">
                  <span className="sr-only">Unread</span>
                  <Dot />
                </div>
              )}
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
