import { useUser } from '../context/UserContext'
import type { PersonId } from '../types'

export default function UserSwitcher({ compact = false }: { compact?: boolean }) {
  const { activeUser, setActiveUser, nameFor } = useUser()

  const options: PersonId[] = ['me', 'partner']

  return (
    <div
      className={`flex rounded-2xl bg-honey-50 p-1 ${compact ? 'text-xs' : 'text-sm'}`}
      role="group"
      aria-label="Switch active user"
    >
      {options.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => setActiveUser(id)}
          className={`flex-1 rounded-xl px-3 py-1.5 font-medium transition ${
            activeUser === id
              ? 'bg-black/30 text-white shadow-soft'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          {nameFor(id)}
        </button>
      ))}
    </div>
  )
}
