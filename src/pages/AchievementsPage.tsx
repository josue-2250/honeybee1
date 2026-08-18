import { useState } from 'react'
import { Trophy, Heart, Plus, Trash2 } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useUser } from '../context/UserContext'
import UserSwitcher from '../components/UserSwitcher'
import PageBackground from '../components/PageBackground'
import type { Achievement, PersonId } from '../types'
import { formatDate, todayISO, uid } from '../utils/helpers'

export default function AchievementsPage() {
  const { activeUser, nameFor } = useUser()
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>(
    'honeybee:achievements',
    [],
  )
  const [text, setText] = useState('')
  const [date, setDate] = useState(todayISO())

  const sorted = [...achievements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  const handleAdd = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    setAchievements((prev) => [
      {
        id: uid(),
        text: trimmed,
        date,
        hearts: { me: false, partner: false },
        createdAt: Date.now(),
      },
      ...prev,
    ])
    setText('')
    setDate(todayISO())
  }

  const toggleHeart = (id: string, person: PersonId) => {
    setAchievements((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, hearts: { ...a.hearts, [person]: !a.hearts[person] } }
          : a,
      ),
    )
  }

  const deleteEntry = (id: string) => {
    setAchievements((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <PageBackground
      image="/backgrounds/achievements.png"
      className="page-enter min-h-[calc(100svh-5rem)] md:min-h-svh"
    >
      <header className="sticky top-0 z-10 border-b border-rose-100/20 bg-[#5c284a]/55 px-4 py-4 backdrop-blur-md md:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-honey-200 shadow-soft">
              <Trophy size={20} className="text-honey-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Our Little Victories
              </h2>
              <p className="text-xs text-honey-600/70">
                {achievements.length} moments captured
              </p>
            </div>
          </div>
          <UserSwitcher compact />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
        <div className="love-banner mb-6">
          <span>♥</span>
          <p>Celebrating every reason we smile.</p>
          <span>♥</span>
        </div>
        <div className="mb-8 rounded-2xl border border-stone-200 bg-black/30 p-5 shadow-sm">
          <label className="mb-2 block text-sm font-medium text-white">
            What made us smile today?
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="A sweet gesture, a funny moment, a small win..."
            rows={3}
            className="mb-3 w-full resize-none rounded-2xl border border-stone-200 bg-black/30 px-4 py-3 text-sm outline-none focus:border-honey-400 focus:ring-2 focus:ring-honey-100"
          />
          <div className="mb-4 flex items-center gap-3">
            <label className="text-xs font-medium text-white/70">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border border-stone-200 bg-black/30 px-3 py-1.5 text-sm outline-none focus:border-honey-400"
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!text.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-honey-400 py-2.5 text-sm font-medium text-white shadow-soft transition hover:bg-honey-500 disabled:opacity-40"
          >
            <Plus size={18} />
            Save Victory
          </button>
        </div>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="relative mb-4">
              <Trophy size={48} className="text-honey-300" strokeWidth={1.5} />
              <Heart
                size={16}
                className="absolute -right-1 -top-1 fill-rose-300 text-rose-300"
              />
            </div>
            <p className="text-sm text-white/70">
              Your victory timeline will appear here
            </p>
          </div>
        ) : (
          <div className="relative space-y-0">
            <div className="absolute bottom-4 left-[19px] top-4 w-0.5 bg-honey-200 md:left-[23px]" />

            {sorted.map((entry) => (
              <div key={entry.id} className="group relative flex gap-4 pb-6">
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-honey-200 shadow-soft md:h-12 md:w-12">
                  <Heart size={18} className="fill-rose-300 text-rose-300" />
                </div>

                <div className="min-w-0 flex-1 rounded-2xl border border-stone-200 bg-black/30 p-4 shadow-sm">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-honey-600/70">
                      {formatDate(entry.date)}
                    </p>
                    <button
                      type="button"
                      onClick={() => deleteEntry(entry.id)}
                      className="rounded-lg p-1 text-stone-300 opacity-0 transition group-hover:opacity-100 hover:bg-black/30 hover:text-white/70"
                      aria-label="Delete entry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <p className="mb-3 text-sm leading-relaxed text-white/90">
                    {entry.text}
                  </p>

                  <div className="flex gap-2">
                    {(['me', 'partner'] as PersonId[]).map((person) => {
                      const liked = entry.hearts[person]
                      const isActive = person === activeUser
                      return (
                        <button
                          key={person}
                          type="button"
                          onClick={() => toggleHeart(entry.id, person)}
                          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                            liked
                              ? 'bg-rose-50 text-rose-500'
                              : 'bg-black/20 text-white/60 hover:bg-rose-50/50 hover:text-rose-400'
                          } ${isActive ? 'ring-1 ring-honey-200' : ''}`}
                          title={`${nameFor(person)}'s heart`}
                        >
                          <Heart
                            size={14}
                            className={liked ? 'fill-rose-400 text-rose-400' : ''}
                          />
                          {nameFor(person)}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageBackground>
  )
}
