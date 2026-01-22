import clsx from 'clsx'

export const menuItemClass = (collapsed: boolean) =>
  clsx(
    'w-full flex items-center gap-2 px-4 py-2 rounded transition',
    'hover:bg-gray-800',
    collapsed && 'justify-center'
  )
