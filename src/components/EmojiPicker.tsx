import { EMOJI_GROUPS } from '../data/emojis'

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
}

export default function EmojiPicker({ onSelect }: EmojiPickerProps) {
  return (
    <div className="max-h-52 overflow-y-auto">
      {EMOJI_GROUPS.map((group) => (
        <div key={group.label} className="mb-3 last:mb-0">
          <p className="mb-1.5 text-xs font-medium text-white/60">{group.label}</p>
          <div className="grid grid-cols-8 gap-0.5">
            {group.emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onSelect(emoji)}
                className="rounded-lg p-1.5 text-xl transition hover:bg-honey-50 active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
