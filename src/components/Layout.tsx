import { NavLink, Outlet } from 'react-router-dom'
import { MessageCircle, Camera, Sparkles, Trophy, Heart, Images } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Honey Chat', shortLabel: 'Chat', icon: MessageCircle },
  { to: '/memories', label: 'Our Memories', shortLabel: 'Memories', icon: Camera },
  { to: '/gallery', label: 'Love Gallery', shortLabel: 'Gallery', icon: Images },
  { to: '/wishes', label: 'Our Wishes', shortLabel: 'Wishes', icon: Sparkles },
  {
    to: '/achievements',
    label: 'Our Little Victories',
    shortLabel: 'Victories',
    icon: Trophy,
  },
] as const

function NavItem({
  to,
  label,
  shortLabel,
  icon: Icon,
  mobile = false,
}: {
  to: string
  label: string
  shortLabel: string
  icon: typeof MessageCircle
  mobile?: boolean
}) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        [
          'group flex items-center gap-3 rounded-2xl transition-all duration-200',
          mobile
            ? 'min-w-0 flex-1 flex-col gap-1 px-1 py-2 text-[10px] leading-none sm:px-2 sm:text-xs'
            : 'px-4 py-3 text-sm font-medium',
          isActive
            ? 'bg-honey-100 text-white shadow-soft'
            : 'text-white/80 hover:bg-honey-50/80 hover:text-white',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={mobile ? 22 : 20}
            strokeWidth={isActive ? 2.25 : 1.75}
            className={
              isActive
                ? 'text-honey-500'
                : 'text-white/60 group-hover:text-honey-400'
            }
          />
          <span className={mobile ? 'w-full truncate text-center' : ''}>
            {mobile ? shortLabel : label}
          </span>
        </>
      )}
    </NavLink>
  )
}

export default function Layout() {
  return (
    <div className="app-shell flex min-h-svh">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-rose-100/60 bg-[#5c284a]/90 backdrop-blur-xl md:flex">
        <div className="border-b border-rose-100/20 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-honey-300 to-honey-500 shadow-soft">
              <Heart size={20} className="fill-white text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white">
                Honeybee
              </h1>
              <p className="text-xs text-rose-100/70">A little world for two</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5 p-4">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        <div className="border-t border-rose-100/20 p-4">
          <p className="rounded-2xl border border-rose-200/20 bg-rose-100/10 px-4 py-3 text-center text-xs leading-relaxed text-rose-100/80">
            “Every love story is beautiful, but ours is my favorite.”
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex min-h-svh flex-1 flex-col md:pl-64">
        <div className="flex-1 pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:pb-0">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex min-h-[4.75rem] items-stretch justify-around border-t border-rose-100/20 bg-[#5c284a]/95 px-1 pt-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))] shadow-soft-lg backdrop-blur-xl md:hidden">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} mobile />
        ))}
      </nav>
    </div>
  )
}
