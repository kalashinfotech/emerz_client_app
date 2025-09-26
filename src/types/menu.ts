import type { LucideIcon } from 'lucide-react'

export type MenuItem = {
  id: number
  name: string
  to: string
  icon: LucideIcon
  animateClass?: string
}

export type MenuGroup = {
  id: number
  name?: string
  menuItems: MenuItem[]
}

export type Menu = {
  menuGroups: MenuGroup[]
}
