interface GameLayoutProps {
  children: React.ReactNode
}

export default async function GameLayout({ children }: GameLayoutProps) {
  return (
    // <div className="relative flex h-[calc(100vh_-_theme(spacing.12))] overflow-hidden">
    <div className="relative flex h-full overflow-hidden">{children}</div>
  )
}
