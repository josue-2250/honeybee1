import { CURATED_GIFS } from '../data/gifs'

interface GifPickerProps {
  onSelect: (url: string) => void
}

export default function GifPicker({ onSelect }: GifPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {CURATED_GIFS.map((gif) => (
        <button
          key={gif.url}
          type="button"
          onClick={() => onSelect(gif.url)}
          className="group overflow-hidden rounded-xl border border-stone-100 transition hover:border-honey-200 hover:shadow-soft"
        >
          <img
            src={gif.url}
            alt={gif.label}
            className="aspect-video w-full object-cover transition group-hover:scale-105"
            loading="lazy"
          />
          <span className="block px-2 py-1 text-xs text-white/70">{gif.label}</span>
        </button>
      ))}
    </div>
  )
}
