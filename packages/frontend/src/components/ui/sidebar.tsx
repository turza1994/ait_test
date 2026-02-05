import * as React from 'react'
import { cn } from '@/lib/utils'

const SidebarContext = React.createContext<{
  state: 'open' | 'closed'
  open: boolean
  setOpen: (open: boolean) => void
}>({
  state: 'open',
  open: true,
  setOpen: () => {},
})

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }
  return context
}

const SidebarProvider: React.FC<{
  children: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}> = ({ children, defaultOpen = true, open: openProp, onOpenChange: setOpenProp }) => {
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }
    },
    [setOpenProp, open]
  )

  const state = open ? 'open' : 'closed'

  const contextValue = React.useMemo(
    () => ({
      state: state as 'open' | 'closed',
      open,
      setOpen,
    }),
    [state, open, setOpen]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <div className="flex min-h-screen w-full">{children}</div>
    </SidebarContext.Provider>
  )
}

const Sidebar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  const { state } = useSidebar()
  
  return (
    <div
      className={cn(
        'flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300',
        state === 'closed' && 'w-16',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const SidebarTrigger: React.FC<React.HTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => {
  const { open, setOpen } = useSidebar()

  const handleToggle = () => {
    setOpen(!open)
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10',
        className
      )}
      onClick={handleToggle}
      {...props}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="9" y1="3" x2="9" y2="21"/>
      </svg>
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  )
}

const SidebarContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn(
      'flex-1 overflow-auto py-2',
      className
    )}
    {...props}
  />
)

const SidebarGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn(
      'px-3 py-2',
      className
    )}
    {...props}
  />
)

const SidebarGroupLabel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn(
      'mb-2 px-2 text-xs font-semibold text-sidebar-foreground/70',
      className
    )}
    {...props}
  />
)

const SidebarGroupContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn('space-y-1', className)}
    {...props}
  />
)

const SidebarMenu: React.FC<React.HTMLAttributes<HTMLUListElement>> = ({ className, ...props }) => (
  <ul
    className={cn(
      'space-y-1',
      className
    )}
    {...props}
  />
)

const SidebarMenuItem: React.FC<React.HTMLAttributes<HTMLLIElement>> = ({ className, ...props }) => (
  <li
    className={cn('', className)}
    {...props}
  />
)

const SidebarMenuButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
}> = ({ className, asChild = false, ...props }) => {
  const Comp = asChild ? 'span' : 'button'
  
  return (
    <Comp
      className={cn(
        'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        className
      )}
      {...props}
    />
  )
}

const SidebarMenuBadge: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn(
      'ml-auto rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary',
      className
    )}
    {...props}
  />
)

export {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
}