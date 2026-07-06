// GENERAL NOTES margin column: Em's handwriting (Caveat, rule 8 caps:
// margin notes only, never UI, never above 19px, five per sheet max).
export default function MarginNotes({ notes }: { notes: string[] }) {
  if (import.meta.env.DEV && notes.length > 5) {
    console.warn(`MarginNotes: ${notes.length} notes exceeds the five-per-sheet cap (rule 8)`)
  }
  return (
    <>
      <span className="font-mono text-[9px] tracking-[0.12em] text-anno">GENERAL NOTES</span>
      {notes.map((n) => (
        <span key={n} className="font-hand text-lg leading-[1.3] text-anno">
          <span className="text-redline">n.b.</span> {n}
        </span>
      ))}
    </>
  )
}
