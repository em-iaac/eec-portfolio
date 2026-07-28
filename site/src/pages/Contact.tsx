import { useRef, useState, type FormEvent } from 'react'
import SheetPage from '../components/SheetPage'
import DownloadPill from '../components/ui/DownloadPill'
import ContactLinks from '../components/ui/ContactLinks'
import { BookGlyph, DocGlyph } from '../components/ui/glyphs'
import { RED_LINK } from '../lib/linkStyles'

const BASE = import.meta.env.BASE_URL

const EMAIL = 'chidiacemilie@gmail.com'

// The Web3Forms access key, inlined at build time from .env.local locally and
// from the WEB3FORMS_KEY repo secret in CI (.github/workflows/deploy.yml).
// EMPTY IS A SUPPORTED STATE: with no key the form composes a mailto: instead
// of posting, so a missing secret degrades to a working page rather than to a
// dead button. Confirmed live end to end on 2026-07-29 (her: "i received the
// test email").
const W3F_KEY = import.meta.env.VITE_WEB3FORMS_KEY ?? ''

// The prose step: 17px is the short-laptop fit, 19px when the room breathes
// (the `tall:` variant, index.css). Class strings stay LITERAL.
const PROSE = 'prose-rag font-serif text-[17px] leading-relaxed tall:text-[19px]'

// THE CONTACT PAGE · THE LANDSCAPE SPLIT (THE WORDS, Emilie's spec 2026-07-29).
//
// THE ROAD HERE, so no one rebuilds a version she has already rejected. It
// began as an About with a biography in it; the biography moved to the landing
// and left a split with nothing to split, a paragraph repeating the bio, and a
// closing clause ("and the room to keep building the tools that get them
// there") that read as availability. Then a version carrying the whole
// mind-graph across from the landing was built, reviewed live and CUT ("I hate
// the contact design"). Then a single centred column with a form, which worked
// and which she asked to open back out.
//
// SO THE SPLIT IS BACK, and this time both halves have something in them,
// which is the only thing that was ever wrong with it: LEFT is the person (the
// invitation, the one human line, the callback, every way to reach her), RIGHT
// is the form. The first split failed because its right pane held four rows at
// the top and 250px of nothing underneath.
//
// HER SPEC, POINT BY POINT (2026-07-29):
//   - landscape, "say hi ... most days" + the callback + the links on one side,
//     the form on the other
//   - every placeholder is an EXAMPLE of what to write, muted AND italic
//   - ALL THREE OPEN "so I ..." (her round-2 note, 2026-07-29: "so all of them
//     are so I.."). "so I can write back" was hers from the start and the other
//     two were rewritten to match it, which turns three unrelated hints into
//     one sentence said three times. An earlier "a room, maybe" was cut for
//     breaking the pattern. Every placeholder now answers the same question:
//     what does she need this field for.
//   - SEND CANNOT BE PRESSED until all three fields have something in them
//   - a fun animation and a small message confirm the send
//   - the written-out address comes off the page entirely
//
// THE ADDRESS IS GONE, and that reverses an argument this session made
// earlier. It was right then and is wrong now: the address was the page's only
// real destination when "EMAIL" was just a word with a mailto behind it. There
// is now a working form, and the EMAIL link in ContactLinks below is still a
// mailto, so a visitor who wants their own client keeps a one-click route. The
// address is no longer load-bearing, so it does not need to be shouted.
//
// HOW IT SENDS: a POST to Web3Forms (her account). The site is static on
// GitHub Pages so there is no server of our own; Web3Forms is the third party
// that receives it, which is a fact worth knowing rather than a problem. The
// reply address is required because a posted form knows nothing about who
// wrote it, where mailto: got that free from the sender's own client.
//
// THE HONEYPOT: the access key is embedded in the bundle by design, so anyone
// can post to it. `botcheck` is a field no human can see or tab into; if it
// arrives filled the submit is dropped and the UI reports success anyway,
// because telling a bot it failed only teaches it to try again.
//
// SIGNED IN FULL by Emilie, 2026-07-29 ("sign everything"). The h1 "Say hi"
// and "That's what's on my mind. What's in yours?" were already signed at G4
// and are kept verbatim; the hike line, the field labels, the placeholders and
// the confirmation line were signed at this gate, after her last two
// corrections to the hike line: the verb, and "our planet" rather than "this
// planet", which restores exactly what she said in the interview. Nothing on
// this page is draft any more.

type Status = 'idle' | 'sending' | 'sent' | 'error'

// One field. `multiline` picks input or textarea; everything else is shared so
// the two can never drift apart. The placeholder is an EXAMPLE, so it is set in
// the reading serif, italic and muted (her spec): it should read as a
// suggestion in her handwriting rather than as an empty form slot.
function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  multiline = false,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
  multiline?: boolean
}) {
  // The rule IS the field: border-b at rest, the interaction colour on focus,
  // no ring. The colour change is the affordance.
  const shared =
    'mt-1 w-full border-0 border-b border-[var(--lang-hairline)] bg-transparent px-0 py-1.5 font-serif text-[17px] text-[var(--lang-ink)] outline-none placeholder:italic placeholder:text-[var(--lang-ink-muted)] focus:border-[var(--lang-interaction)]'
  return (
    <div className="mt-5 first:mt-0">
      <label
        htmlFor={id}
        className="font-mono text-micro tracking-[0.14em] text-[var(--lang-ink-muted)] uppercase"
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${shared} resize-y`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={shared}
        />
      )}
    </div>
  )
}

// THE SEND, drawn (her ask: "a fun animation with a small message"). A thread
// draws itself and a mark lands on the end of it, which is the mind-graph's
// own grammar and an echo of the `scoring` figure where a number travels away
// from its box. Keyframes + the reduced-motion contract live in language.css.
function Sent() {
  return (
    <div className="flex flex-col items-start justify-center py-6">
      <svg
        viewBox="0 0 240 44"
        className="w-full max-w-[240px] text-[var(--lang-ink)]"
        aria-hidden="true"
      >
        <path
          className="sent-line"
          d="M4 30h190"
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle className="sent-mark" cx="212" cy="30" r="6" fill="var(--lang-interaction)" />
      </svg>
      {/* One live region so a screen reader hears the outcome
          without the focus moving. */}
      <p role="status" aria-live="polite" className={`sent-word mt-4 text-[var(--lang-ink)] ${PROSE}`}>
        Landed. I read everything, and I answer most things.
      </p>
    </div>
  )
}

export default function Contact() {
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const honeypot = useRef<HTMLInputElement>(null)

  // HER RULE: "they cannot press send if one of those fields are empty." So the
  // button is genuinely disabled rather than relying on the browser's required
  // validation, which only speaks up AFTER a press. Whitespace does not count.
  const ready = email.trim() !== '' && subject.trim() !== '' && message.trim() !== ''

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!ready || status === 'sending') return

    // A filled honeypot means a bot. Report success and post nothing.
    if (honeypot.current?.value) {
      setStatus('sent')
      return
    }

    // No key (a build without the secret): fall back to the visitor's own mail
    // client. encodeURIComponent on both, or an ampersand in someone's subject
    // silently truncates their own message.
    if (!W3F_KEY) {
      const q = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
      window.location.href = `mailto:${EMAIL}?${q}`
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: W3F_KEY,
          // Prefixed so a message from the site is recognisable at a glance.
          subject: `emiliechidiac.com: ${subject}`,
          email,
          message,
          from_name: 'emiliechidiac.com',
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message ?? 'failed')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <SheetPage footer={false}>
      <section
        aria-labelledby="contact-heading"
        className="mx-auto flex w-full max-w-[1040px] flex-col gap-8 py-6 md:flex-row md:items-center md:gap-14"
      >
        {/* LEFT · the person. */}
        <div className="md:flex-1">
          <h1
            id="contact-heading"
            className="text-title font-semibold tracking-[-0.01em] text-[var(--lang-ink)] tall:text-4xl"
          >
            Say hi
          </h1>

          {/* SIGNED 2026-07-29. Her ruling at the gate: the hike alone, and the swear
              stays (it is what she actually said, it is the emotional peak of
              the whole interview, and this is the page a reader reaches last). */}
          {/* THE VERB AND THE PUNCTUATION (her catch, 2026-07-29).
              "Coding" was a small lie, and she found it: the landing bio two
              clicks away says "I will not pretend I can fill a blank notebook
              from nothing", so a contact page claiming she codes all day put
              the site in an argument with itself. She was torn between
              "arguing with a machine" and "building the instruments"; this
              takes the first, because the landing ALREADY says "so I build the
              instruments" and reusing it makes two pages repeat rather than
              add. Arguing is also the honest description of the job the bio
              claims: judging what the machine hands back and steering it.
              "Indoors" now does the work "coding" was doing, which is to sit
              opposite the hike.
              THE QUESTION MARK IS HERS TOO, and it is the stronger ending: it
              is what a person actually says out loud at the top of a climb,
              and an unanswered question is how nearly every good thing on this
              site closes. */}
          <p className={`mt-4 text-[var(--lang-ink)] ${PROSE}`}>
            Most days I am indoors arguing with a machine when I would honestly rather be at the end
            of a hike going: can you fucking believe how beautiful our planet is?
          </p>

          {/* SIGNED (G4), and "What's in yours?" IS THE MAILTO AGAIN (her note,
              2026-07-29: "have the what's in yours still ink red and if they
              click it it works as if they click the mail"). It had been flattened
              to plain text when the written address was on the page and the form
              arrived; with the address gone, the line goes back to being the
              warm way out for anyone who would rather use their own client than
              fill in a form. Red is the site's one interaction colour, so the
              link reads as a link without any other decoration. */}
          <p className={`mt-5 italic text-[var(--lang-ink)] ${PROSE}`}>
            That&apos;s what&apos;s on my mind.{' '}
            <a href={`mailto:${EMAIL}`} className={RED_LINK}>
              What&apos;s in yours?
            </a>
          </p>

          <ContactLinks className="mt-6" />
          <nav aria-label="Downloads" className="mt-3 flex flex-wrap items-center gap-2">
            <DownloadPill
              href={`${BASE}assets/portfolio-emilie-el-chidiac.pdf`}
              download="Emilie-El-Chidiac-Portfolio.pdf"
              icon={<BookGlyph />}
            >
              THE BOOK (PDF)
            </DownloadPill>
            <DownloadPill
              href={`${BASE}assets/cv-emilie-el-chidiac.pdf`}
              download="Emilie-El-Chidiac-CV.pdf"
              icon={<DocGlyph />}
            >
              CV (PDF)
            </DownloadPill>
          </nav>
        </div>

        {/* The dividing line: vertical between the panes, horizontal when they
            stack. */}
        <div
          aria-hidden="true"
          className="h-px w-full self-stretch bg-[var(--lang-hairline)] md:h-auto md:w-px"
        />

        {/* RIGHT · the form (the point of the page). */}
        <div className="md:flex-1">
          {status === 'sent' ? (
            <Sent />
          ) : (
            <form onSubmit={onSubmit}>
              {/* The honeypot: off-screen rather than display:none, because some
                  bots skip hidden fields but not positioned ones. No label, no
                  tab stop, hidden from assistive tech, autocomplete off so a
                  browser never helpfully fills it for a real person. */}
              <input
                ref={honeypot}
                type="text"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <Field
                id="contact-email"
                label="Your email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="so I can write back"
              />
              <Field
                id="contact-subject"
                label="Subject"
                value={subject}
                onChange={setSubject}
                placeholder="so I can know"
              />
              <Field
                id="contact-message"
                label="Message"
                value={message}
                onChange={setMessage}
                placeholder="so I can understand"
                multiline
              />

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                <button
                  type="submit"
                  disabled={!ready || status === 'sending'}
                  className="inline-flex min-h-11 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--lang-ink)] px-5 font-mono text-label tracking-[0.14em] text-[var(--lang-ground)] uppercase transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
                >
                  {status === 'sending' ? 'Sending' : 'Send ›'}
                </button>
                <span
                  role="status"
                  aria-live="polite"
                  className="font-mono text-micro tracking-[0.1em] text-[var(--lang-ink-muted)]"
                >
                  {status === 'error' && 'That did not send. The email link works.'}
                  {status === 'idle' && !W3F_KEY && 'opens your mail app, already filled in'}
                </span>
              </div>
            </form>
          )}
        </div>
      </section>
    </SheetPage>
  )
}
