/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { PersonId, Profile } from '../types'

const DEFAULT_PROFILE: Profile = {
  me: 'You',
  partner: 'Honey',
  activeUser: 'me',
}

interface UserContextValue {
  profile: Profile
  activeUser: PersonId
  setActiveUser: (id: PersonId) => void
  setName: (id: PersonId, name: string) => void
  nameFor: (id: PersonId) => string
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useLocalStorage<Profile>(
    'honeybee:profile',
    DEFAULT_PROFILE,
  )

  const setActiveUser = (id: PersonId) =>
    setProfile((p) => ({ ...p, activeUser: id }))

  const setName = (id: PersonId, name: string) =>
    setProfile((p) => ({ ...p, [id]: name.trim() || p[id] }))

  const nameFor = (id: PersonId) => profile[id]

  return (
    <UserContext.Provider
      value={{
        profile,
        activeUser: profile.activeUser,
        setActiveUser,
        setName,
        nameFor,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
