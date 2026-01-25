import { useEffect, useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type { AxiosError } from 'axios'
import { BellIcon } from 'lucide-react'
import { toast } from 'sonner'

import type { BareParticipantModel, TError } from '@/types'
import type { BareUserAccountModel } from '@/types/user-account'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { UseMarkNotificationRead, fetchMyNotificationList } from '@/api/participant'

import { useAuth } from '@/hooks/use-auth'

function getSenderName(sender: BareParticipantModel | BareUserAccountModel | null) {
  if (!sender) return 'System'
  return sender.fullName
}

function timeAgo(dateLike: string | Date) {
  const date = typeof dateLike === 'string' ? new Date(dateLike) : dateLike
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000) // seconds

  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  if (diff < 60 * 86400) return `${Math.floor(diff / 86400)} days ago`
  return date.toLocaleDateString()
}

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

type BackendNotification = {
  id: number
  unread: boolean
  createdAt: string | Date
  sender?: any | null
  notification?: string | null
  action?: string | null
  target?: string | null
  link?: string | null
  type: string
}

export function NotificationMenu() {
  const { sessionInfo } = useAuth()

  const {
    data: rawResp,
    isLoading,
    isError,
    error,
  } = useQuery(
    fetchMyNotificationList(sessionInfo?.id || '', 0, [], [{ id: 'createdAt', desc: true }], 10, !!sessionInfo?.id),
  )

  const { markRead } = UseMarkNotificationRead()
  const navigate = useNavigate()

  const backendNotifications: BackendNotification[] = useMemo(() => {
    if (!rawResp?.data) return []
    return rawResp.data.map((n: any) => ({
      id: n.id,
      unread: !!n.unread,
      createdAt: n.createdAt,
      sender: n.sender ?? null,
      notification: n.notification ?? null,
      action: n.action ?? null,
      target: n.target ?? null,
      link: n.link ?? null,
      meta: n.meta ?? null,
      type: n.type,
    }))
  }, [rawResp])

  const [notifications, setNotifications] = useState<BackendNotification[]>([])

  useEffect(() => {
    setNotifications(backendNotifications)
  }, [rawResp, backendNotifications])

  const unreadCount = notifications.filter((n) => n.unread).length

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))

    // TODO: call your backend mark-all-read endpoint here, e.g.:
    // await markAllNotificationsRead(sessionInfo.id)
    // If the backend call fails, you might want to revert or show an error toast.
  }

  const handleNotificationClick = async (id: number) => {
    const clicked = notifications.find((n) => n.id === id)
    if (!clicked) {
      toast.success('marked read')
      return
    }
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)))
    if (clicked.link) {
      navigate({ to: clicked.link })
      // window.location.href = clicked.link
    }

    try {
      await markRead({ notificationId: clicked.id })
    } catch (e) {
      const err = e as AxiosError<TError>
      toast.error(
        err.response?.data.error?.message || 'Something went wrong. Please contact administrator or try again later.',
      )
    }

    // TODO: call your backend to mark this notification as read:
    // await markNotificationRead(id)
    // handle errors if needed
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

        {isLoading && <div className="text-muted-foreground px-3 py-2 text-sm">Loading...</div>}

        {isError && (
          <div className="text-destructive px-3 py-2 text-sm">
            Failed to load notifications. {(error as any)?.message}
          </div>
        )}

        {!isLoading && notifications.length === 0 && (
          <div className="text-muted-foreground px-3 py-4 text-sm">No notifications</div>
        )}

        {notifications.map((notification) => {
          const senderName = getSenderName(notification.sender)

          return (
            <div
              key={notification.id}
              className="hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors"
              role="button"
              onClick={() => handleNotificationClick(notification.id)}>
              <div className="relative flex items-start pe-3">
                <div className="flex-1 space-y-1">
                  <div className="text-foreground/80 text-left">
                    <span className="text-foreground font-medium">{senderName}</span>{' '}
                    {notification.notification && <span>{notification.notification}</span>}
                    {notification.target && <span className="font-semibold"> {notification.target}</span>}
                  </div>
                  <div className="text-muted-foreground text-xs">{timeAgo(notification.createdAt)}</div>
                </div>

                {notification.unread && (
                  <div className="absolute end-0 self-center">
                    <span className="sr-only">Unread</span>
                    <Dot />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
