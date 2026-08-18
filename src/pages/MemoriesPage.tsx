import { useState } from 'react'
import { Camera, ImagePlus, ChevronLeft, ChevronRight, X, Calendar } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Modal from '../components/Modal'
import PageBackground from '../components/PageBackground'
import type { Memory } from '../types'
import { formatDate, readFileAsDataURL, todayISO, uid } from '../utils/helpers'

export default function MemoriesPage() {
  const [memories, setMemories] = useLocalStorage<Memory[]>('honeybee:memories', [])
  const [showUpload, setShowUpload] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const [caption, setCaption] = useState('')
  const [date, setDate] = useState(todayISO())
  const [preview, setPreview] = useState<{ type: 'image' | 'video'; url: string } | null>(null)
  const [uploading, setUploading] = useState(false)

  const sorted = [...memories].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  const resetForm = () => {
    setCaption('')
    setDate(todayISO())
    setPreview(null)
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const isVideo = file.type.startsWith('video/')
    const isImage = file.type.startsWith('image/')
    if (!isVideo && !isImage) return

    setUploading(true)
    try {
      const url = await readFileAsDataURL(file)
      setPreview({ type: isVideo ? 'video' : 'image', url })
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handlePost = () => {
    if (!preview) return
    setMemories((prev) => [
      {
        id: uid(),
        type: preview.type,
        url: preview.url,
        caption: caption.trim(),
        date,
        createdAt: Date.now(),
      },
      ...prev,
    ])
    resetForm()
    setShowUpload(false)
  }

  const closeLightbox = () => setLightboxIndex(null)

  const navigateLightbox = (dir: -1 | 1) => {
    if (lightboxIndex === null) return
    const next = lightboxIndex + dir
    if (next >= 0 && next < sorted.length) setLightboxIndex(next)
  }

  const active = lightboxIndex !== null ? sorted[lightboxIndex] : null

  return (
    <PageBackground
      image="/backgrounds/memories.png"
      className="page-enter min-h-[calc(100svh-5rem)] md:min-h-svh"
    >
      <header className="sticky top-0 z-10 border-b border-rose-100/20 bg-[#5c284a]/55 px-4 py-4 backdrop-blur-md md:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/80 shadow-soft">
              <Camera size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white/90">Our Memories</h2>
              <p className="text-xs text-white/70">
                {memories.length} {memories.length === 1 ? 'memory' : 'memories'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              resetForm()
              setShowUpload(true)
            }}
            className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-black/30 px-4 py-2.5 text-sm font-medium text-white/90 shadow-sm transition hover:border-stone-300 hover:shadow-md"
          >
            <ImagePlus size={18} />
            <span className="hidden sm:inline">Add Memory</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
        <div className="love-banner mb-6">
          <span>♥</span>
          <p>Some moments deserve to live forever.</p>
          <span>♥</span>
        </div>
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Camera size={48} className="mb-4 text-white" strokeWidth={1.5} />
            <h3 className="mb-2 text-lg font-medium text-white/80">No memories yet</h3>
            <p className="mb-6 max-w-sm text-sm text-white/70">
              Upload your first photo or video to start your shared scrapbook.
            </p>
            <button
              type="button"
              onClick={() => setShowUpload(true)}
              className="rounded-2xl border border-stone-200 bg-black/30 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:border-stone-300 hover:shadow-md"
            >
              Add your first memory
            </button>
          </div>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {sorted.map((memory, index) => (
              <button
                key={memory.id}
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-stone-200 bg-black/30 text-left shadow-sm transition hover:border-stone-300 hover:shadow-md"
              >
                {memory.type === 'image' ? (
                  <img
                    src={memory.url}
                    alt={memory.caption || 'Memory'}
                    className="w-full object-cover transition group-hover:scale-[1.02]"
                  />
                ) : (
                  <video
                    src={memory.url}
                    className="w-full object-cover"
                    muted
                  />
                )}
                <div className="p-3">
                  {memory.caption && (
                    <p className="mb-1 text-sm text-white/90">{memory.caption}</p>
                  )}
                  <p className="flex items-center gap-1 text-xs text-white/60">
                    <Calendar size={12} />
                    {formatDate(memory.date)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="New Memory" wide>
        <div className="space-y-4">
          {!preview ? (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 px-6 py-12 transition hover:border-purple-300 hover:bg-purple-50">
              <ImagePlus size={32} className="mb-3 text-white" />
              <span className="text-sm font-medium text-white/80">
                {uploading ? 'Loading...' : 'Tap to upload photo or video'}
              </span>
              <span className="mt-1 text-xs text-white/60">JPG, PNG, MP4, MOV</span>
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFile}
                disabled={uploading}
              />
            </label>
          ) : (
            <div className="overflow-hidden rounded-2xl">
              {preview.type === 'image' ? (
                <img src={preview.url} alt="Preview" className="max-h-56 w-full object-cover" />
              ) : (
                <video src={preview.url} controls className="max-h-56 w-full" />
              )}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/70">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What was this moment about?"
              rows={2}
              className="w-full resize-none rounded-2xl border border-stone-200 bg-black/20 px-4 py-2.5 text-sm outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/70">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-black/20 px-4 py-2.5 text-sm outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <div className="flex gap-2 pt-1">
            {preview && (
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="flex-1 rounded-2xl border border-stone-200 py-2.5 text-sm font-medium text-white/80 transition hover:bg-black/20"
              >
                Change file
              </button>
            )}
            <button
              type="button"
              onClick={handlePost}
              disabled={!preview}
              className="flex-1 rounded-2xl bg-purple-400 py-2.5 text-sm font-medium text-white shadow-soft transition hover:bg-purple-500 disabled:opacity-40"
            >
              Post Memory
            </button>
          </div>
        </div>
      </Modal>

      {active && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <div className="flex items-center justify-between p-4">
            <button
              type="button"
              onClick={closeLightbox}
              className="rounded-xl p-2 text-white/70 transition hover:bg-black/10 hover:text-white"
              aria-label="Close"
            >
              <X size={22} />
            </button>
            <span className="text-sm text-white/60">
              {lightboxIndex + 1} / {sorted.length}
            </span>
            <div className="w-10" />
          </div>

          <div
            className="relative flex flex-1 items-center justify-center px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxIndex > 0 && (
              <button
                type="button"
                onClick={() => navigateLightbox(-1)}
                className="absolute left-2 rounded-full bg-black/10 p-2 text-white transition hover:bg-black/20 md:left-4"
                aria-label="Previous"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div className="max-h-[70svh] max-w-3xl overflow-hidden rounded-2xl">
              {active.type === 'image' ? (
                <img
                  src={active.url}
                  alt={active.caption || 'Memory'}
                  className="max-h-[70svh] w-full object-contain"
                />
              ) : (
                <video
                  src={active.url}
                  controls
                  autoPlay
                  className="max-h-[70svh] w-full"
                />
              )}
            </div>

            {lightboxIndex < sorted.length - 1 && (
              <button
                type="button"
                onClick={() => navigateLightbox(1)}
                className="absolute right-2 rounded-full bg-black/10 p-2 text-white transition hover:bg-black/20 md:right-4"
                aria-label="Next"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {(active.caption || active.date) && (
            <div className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
              {active.caption && (
                <p className="mb-1 text-sm text-white">{active.caption}</p>
              )}
              <p className="text-xs text-white/50">{formatDate(active.date)}</p>
            </div>
          )}
        </div>
      )}
    </PageBackground>
  )
}
