import { Bell, HomeIcon, Settings } from 'lucide-react'

import type { Menu } from '@/types/menu'

export const menu: Menu = {
  menuGroups: [
    {
      id: 1,
      menuItems: [
        {
          id: 101,
          name: 'Home',
          to: '/dashboard',
          icon: HomeIcon,
          animateClass: 'group-hover/icon:animate-wiggle',
        },
        {
          id: 102,
          name: 'Notifications',
          to: '/notifications',
          icon: Bell,
          animateClass: 'group-hover/icon:animate-wiggle',
        },
        {
          id: 103,
          name: 'Settings',
          to: '/settings',
          icon: Settings,
          animateClass: 'group-hover/icon:animate-spin',
        },
      ],
    },
  ],
}
