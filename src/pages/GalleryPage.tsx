import { useRef, useState } from 'react'
import { Camera, Heart, ImagePlus, Send, X, Expand } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useUser } from '../context/UserContext'
import PageBackground from '../components/PageBackground'
import type { GalleryPhoto } from '../types'
import { formatDate, readFileAsDataURL, uid } from '../utils/helpers'

export default function GalleryPage() {
  const { activeUser, nameFor } = useUser()
  const [photos, setPhotos] = useLocalStorage<GalleryPhoto[]>('honeybee:gallery', [])
  const [caption, setCaption] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const sorted = [...photos].sort((a, b) => b.createdAt - a.createdAt)

  const choosePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    setUploading(true)
    try {
      setPreview(await readFileAsDataURL(file))
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const publish = () => {
    if (!preview) return
    setPhotos((current) => [
      { id: uid(), url: preview, caption: caption.trim(), uploadedBy: activeUser, createdAt: Date.now() },
      ...current,
    ])
    setPreview(null)
    setCaption('')
  }

  return (
    <PageBackground image="/backgrounds/memories.png" className="page-enter min-h-[calc(100svh-5rem)] md:min-h-svh">
      <header className="sticky top-0 z-10 border-b border-rose-100/20 bg-[#5c284a]/55 px-4 py-4 backdrop-blur-md md:px-8">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-200/20 shadow-soft">
            <Camera size={20} className="text-rose-100" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Love Gallery</h2>
            <p className="text-xs text-rose-100/70">Share a new picture for your favorite person to see</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
        <div className="love-banner mb-6">
          <span>♥</span><p>Every picture is another little piece of our story.</p><span>♥</span>
        </div>

        <section className="love-note mb-8 rounded-[1.5rem] p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Share a fresh moment</p>
              <p className="text-xs text-rose-100/70">Uploading as {nameFor(activeUser)}</p>
            </div>
            <button type="button" onClick={() => fileRef.current?.click()} className="rounded-xl bg-rose-300 px-3 py-2 text-xs font-semibold text-rose-950 transition hover:bg-rose-200">
              <span className="inline-flex items-center gap-1.5"><ImagePlus size={15} /> Choose photo</span>
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={choosePhoto} />
          {uploading && <p className="text-sm text-rose-100/80">Preparing your photo…</p>}
          {preview && (
            <div className="grid gap-3 sm:grid-cols-[9rem_1fr]">
              <img src={preview} alt="New gallery preview" className="h-40 w-full rounded-xl object-cover sm:w-36" />
              <div className="flex flex-col gap-3">
                <textarea value={caption} onChange={(event) => setCaption(event.target.value)} rows={3} placeholder="A few sweet words about this moment…" className="w-full resize-none rounded-xl border border-rose-100/25 bg-black/15 px-3 py-2 text-sm text-white outline-none placeholder:text-rose-100/40 focus:border-rose-200/70" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setPreview(null); setCaption('') }} className="rounded-xl border border-rose-100/25 px-3 py-2 text-xs text-rose-100 transition hover:bg-white/10"><X size={15} className="mr-1 inline" />Cancel</button>
                  <button type="button" onClick={publish} className="rounded-xl bg-rose-300 px-3 py-2 text-xs font-semibold text-rose-950 transition hover:bg-rose-200"><Send size={15} className="mr-1 inline" />Share with us</button>
                </div>
              </div>
            </div>
          )}
        </section>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Heart size={44} className="mb-4 fill-rose-300 text-rose-300" />
            <h3 className="text-lg font-medium text-white">Your gallery is waiting</h3>
            <p className="mt-2 max-w-sm text-sm text-rose-100/75">Add the first photo, then let the little moments keep finding their place here.</p>
          </div>
        ) : (
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {sorted.map((photo) => (
              <article key={photo.id} className="group overflow-hidden rounded-2xl border border-rose-100/20 bg-[#2d1025]/55 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-rose-100/50 hover:shadow-soft-lg">
                <button type="button" onClick={() => setSelectedPhoto(photo)} className="relative block w-full overflow-hidden" aria-label={`View full image shared by ${nameFor(photo.uploadedBy)}`}>
                  <img src={photo.url} alt={photo.caption || `Photo shared by ${nameFor(photo.uploadedBy)}`} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute inset-0 flex items-center justify-center bg-[#260d20]/0 text-white opacity-0 transition group-hover:bg-[#260d20]/45 group-hover:opacity-100"><span className="rounded-full border border-white/35 bg-black/25 p-3 backdrop-blur-sm"><Expand size={21} /></span></span>
                </button>
                <div className="p-3">
                  {photo.caption && <p className="line-clamp-2 text-sm text-white">{photo.caption}</p>}
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-100/65"><Heart size={11} className="fill-rose-300 text-rose-300" /> {nameFor(photo.uploadedBy)} · {formatDate(new Date(photo.createdAt).toISOString().slice(0, 10))}</p>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#190713]/90 p-4 backdrop-blur-md" onClick={() => setSelectedPhoto(null)}>
          <div className="relative flex max-h-[92svh] w-full max-w-5xl flex-col overflow-hidden rounded-[1.5rem] border border-rose-100/25 bg-[#321326] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setSelectedPhoto(null)} className="absolute right-3 top-3 z-10 rounded-full border border-white/25 bg-[#260d20]/75 p-2 text-white transition hover:bg-rose-300 hover:text-rose-950" aria-label="Close full image"><X size={20} /></button>
            <div className="min-h-0 flex-1 bg-black/25 p-3 sm:p-5">
              <img src={selectedPhoto.url} alt={selectedPhoto.caption || `Photo shared by ${nameFor(selectedPhoto.uploadedBy)}`} className="max-h-[70svh] w-full rounded-xl object-contain" />
            </div>
            <div className="border-t border-rose-100/15 px-5 py-4">
              {selectedPhoto.caption && <p className="text-sm text-white">{selectedPhoto.caption}</p>}
              <p className="mt-1 flex items-center gap-1 text-xs text-rose-100/70"><Heart size={12} className="fill-rose-300 text-rose-300" /> Shared by {nameFor(selectedPhoto.uploadedBy)} · {formatDate(new Date(selectedPhoto.createdAt).toISOString().slice(0, 10))}</p>
            </div>
          </div>
        </div>
      )}
    </PageBackground>
  )
}
