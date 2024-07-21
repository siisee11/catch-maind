import { SidebarDesktop } from '@/components/sidebar-desktop'

interface GameLayoutProps {
  children: React.ReactNode
}

export default async function GameLayout({ children }: GameLayoutProps) {
  return (
    <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
      {children}
    </div>
  )
}
