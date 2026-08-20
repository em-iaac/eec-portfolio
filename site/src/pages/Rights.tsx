// THE SMALL PRINT (/rights, THE RIGHTS PASS 2026-07-30).
//
// WHY THIS PAGE EXISTS. She publishes a lot of work she did not solely make,
// and the site collects three fields through a third party, and none of it was
// written down anywhere a visitor could read it. The credit layer was already
// at the professional standard (every collaborator named in prose beside their
// project, every employer named in its credit row); what was missing was the
// paperwork.
//
// HER RULINGS THAT SHAPE IT (2026-07-30):
//   - a SMALL page, Foster + Partners' MANNER (quiet headings, plain
//     sentences, nothing busy) and not its scale. Foster runs six policy
//     sub-pages and a named Data Protection Manager; copying that structure
//     here would be theatre.
//   - reachable from the FOOTLINE ONLY. Never a fifth door: the header pill is
//     frozen and pixel-identical on every page by her own ruling, and a rights
//     page has not earned equal billing with the work.
//   - SHAPE C, the hybrid: prose for the three sections that are positions,
//     a ruled list for the colophon, because fonts and datasets genuinely ARE
//     a list. Nothing is dressed as the wrong thing.
//   - COLLAPSIBLE, ALL FOUR CLOSED (round 2): "the small print page things
//     should be collapsible not all open at once". The page is a set of rules
//     you open, not a document you scroll. See Section below for why it is a
//     native <details> and not an accordion component.
//   - NO MIT anywhere. She owns the copyright either way; MIT is permission,
//     not ownership.
//
// THE LEGO LINE IS HERS ALREADY. lEgoarCh's own app carries the disclaimer
// LEGO's Fair Play guidelines ask for, and has since the project shipped. It
// is lifted from the app rather than reinvented, minus its em dash.
//
// THE TONE IS THE EXCEPTION TO THE WHOLE SITE, and it is a standing ruling
// (2026-07-30, after she read the first draft live): "the words of the small
// print i want them to be short and straight to the point and not warm, full
// competence and seriousness. it's the only page where i want full serious
// mode in tone."
//
// So the voice rules in `/emilie-voice` DO NOT APPLY HERE, and that is
// deliberate rather than an oversight. No jokes, no self-deprecation, no
// mid-paragraph questions, no warmth, no triples, no one-word punchlines.
// Everywhere else on this site, warmth is the point. Here, competence is.
//
// IT TOOK THREE DRAFTS AND THE THIRD CHANGED FORMAT, NOT WORDING. Two rounds
// of prose were rejected ("I still don't like the words there and the way we
// are sounding"), which was the signal that the problem was not the phrasing
// but that prose has a voice at all. She was given three registers side by
// side, with the same facts in each: THE NOTICE (prose stripped to the bone),
// THE LEDGER (label and value, no prose), and THE CLAUSE (numbered, formal,
// impersonal). **She chose THE CLAUSE.** My recommendation was the ledger and
// I named the risk in the clause before she picked it: third person reads as a
// firm rather than a person, and it is the closest this site comes to the
// terms-of-service maze she ruled out at the start. Her call, built as shown.
//
// Casualties of the three drafts, all decent lines, none of them missed: "it
// is shorter than you are expecting", "I would rather you check than take my
// word for it", "the honest answer is usually yes", "one very famous brick",
// and "I can see that a page was read. I cannot see that it was you."
//
// ALL COPY ON THIS PAGE SHIPS DRAFT until she signs it (draftCopy, the
// standing gate). No em dashes. ZERO job-search signal: this page says what is
// owned and what is collected, and never once that anyone is available.
import { Link } from 'react-router-dom'
import SheetPage from '../components/SheetPage'
// Two recipes here on purpose (Emilie, 2026-08-05): RED_LINK for MadeRow, which
// is a structured mono row like a door, and QUIET_LINK_TAP for the four names
// inside the drawers' prose.
import { QUIET_LINK_TAP, RED_LINK } from '../lib/linkStyles'

// The prose step, matching /contact: 17px on a short laptop, 19px when the
// room breathes. Class strings stay LITERAL (Tailwind v4 scans this file).
const PROSE =
  'prose-rag max-w-[62ch] font-serif text-[17px] leading-relaxed text-[var(--lang-ink)] tall:text-[19px] [&_p]:mb-[1.05em] [&_p:last-child]:mb-0'

// A SECTION IS A DRAWER (her ruling, round 2, 2026-07-30: "the small print page
// things should be collapsible not all open at once"). ALL FOUR START CLOSED, so
// the page arrives as four rules and a sentence rather than as a wall: you open
// the one you came for.
//
// NATIVE <details>/<summary>, NO JAVASCRIPT. That is not laziness, it buys four
// things a hand-rolled accordion would have to reimplement and usually gets
// wrong: it opens with the keyboard, a screen reader announces it as expanded or
// collapsed without a single aria attribute from us, the browser's own find (and
// Chrome's "scroll to text fragment" from a search result) opens a closed
// section to reveal a match, and it still works if the page never finishes
// booting. It also survives print, which matters on a site that prints itself.
//
// THE MARKER IS A PLUS THAT BECOMES A MINUS, drawn as text and swapped by the
// `[&[open]]` variant. `list-none` + the webkit pseudo-element kill the default
// disclosure triangle, which is the one piece of platform chrome that would not
// belong in this ink language. No rotation, no height animation: DL's motion
// rules earn every movement, and a drawer opening is already the feedback.
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="group border-t-[0.5px] border-[var(--lang-hairline)] last:border-b-[0.5px]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 select-none [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]">
        <h2 className="font-mono text-micro tracking-[0.14em] text-[var(--lang-ink)] uppercase">
          {label}
        </h2>
        {/* aria-hidden: <summary> already carries the expanded state to
            assistive tech, so announcing "plus" on top of it is noise. */}
        <span
          aria-hidden="true"
          className="shrink-0 font-mono text-nav leading-none text-[var(--lang-ink-muted)] group-open:text-[var(--lang-interaction)]"
        >
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">&ndash;</span>
        </span>
      </summary>
      <div className="pb-6">{children}</div>
    </details>
  )
}

// ONE NUMBERED CLAUSE (option C, her pick 2026-07-30 off a three-register
// board). The number hangs in the margin in mono and muted, so it reads as
// apparatus rather than as content, and the prose keeps its own left edge. It
// is `aria-hidden`: a screen reader working through four sections does not need
// "one point one" read before every sentence, and the numbers carry no meaning
// that the reading order does not already carry.
//
// The register is deliberately impersonal, which is what "the clause" means and
// what she chose: passive constructions, "the author" rather than "me", facts
// stated as provisions. I put the risk to her before she picked it (it reads as
// a firm rather than a person, and it is the closest this site comes to the
// terms-of-service maze she said at the start she did not want). She chose it
// anyway, so it is built as shown, not softened on the way in.
function Clause({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="flex gap-3">
      <span
        aria-hidden="true"
        className="shrink-0 pt-[0.35em] font-mono text-micro tracking-[0.06em] text-[var(--lang-ink-muted)] tabular-nums"
      >
        {n}
      </span>
      <span>{children}</span>
    </p>
  )
}

// One colophon row: the thing on the left, its terms on the right. Mono both
// sides, because every one of these is a name or a licence code and neither is
// prose. `href` is optional: LDraw and the fonts have homes worth linking, the
// LEGO note does not link anywhere.
function MadeRow({ what, terms, href }: { what: string; terms: string; href?: string }) {
  return (
    <li className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5 border-t-[0.5px] border-[var(--lang-hairline)] py-2 first:border-t-0">
      <span className="font-mono text-nav tracking-[0.06em] text-[var(--lang-ink)]">
        {/* `aria-label` rather than a trailing `.sr-only` span. Two reasons.
            It puts "opens in new tab" INSIDE the link's accessible name where it
            belongs, instead of leaving a stray phrase after the link. And
            `.sr-only` is `position: absolute`, which is what made this page
            scrollable past its own footer: every one of those spans escaped its
            scroller. SheetPage now contains them properly, but a page with none
            of them cannot regress at all. */}
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${what} (opens in new tab)`}
            className={RED_LINK}
          >
            {what}
          </a>
        ) : (
          what
        )}
      </span>
      {/* NO `uppercase` HERE. The transform rendered "ODbL" as "ODBL", which is
          the wrong name for someone else's licence. Every string in this column
          is already written in the case it should appear in. */}
      <span className="font-mono text-micro tracking-[0.1em] text-[var(--lang-ink-muted)]">
        {terms}
      </span>
    </li>
  )
}

export default function Rights() {
  return (
    <SheetPage center={false}>
      <article className="mx-auto w-full max-w-[720px] pt-10 pb-16">
        {/* NO VISIBLE TITLE OR STANDFIRST (her ruling, 2026-07-30: "Remove the
            title of the small print and subtitle and just have the categories
            collapsed"). The page opens straight onto the four rules.
            THE H1 SURVIVES, unseen. A page with no h1 has no top level in its
            document outline, which is what a screen reader reads to orient
            itself and what a search engine reads as the page's subject; the tab
            already says "The small print" and this keeps the page agreeing with
            its own tab. It is the FIRST thing in the scroller, so unlike the
            `.sr-only` spans this pass had to hunt down, its static position is
            on screen and it cannot drag the page's height anywhere. */}
        <h1 className="sr-only">The small print</h1>

        <div>
          {/* THE HEADINGS MATCH THE CLAUSES (her instruction, 2026-07-30: "yes
              change the headings to match"). They were first person while the
              body underneath had gone impersonal, so the page was speaking in
              two voices at once: "WHAT I COLLECT" over "no mailing list is
              operated". These four are nouns, they do not overlap, and each one
              names exactly what its clauses cover. */}
          <Section label="Authorship and credit">
            <div className={PROSE}>
              <Clause n="1.1">
                The majority of work published on this site was produced collaboratively.
                Collaborators are named on each project, together with the size of the team and the
                author&apos;s role in it. Those credits are the record and can be{' '}
                <Link to="/work" viewTransition className={QUIET_LINK_TAP}>
                  read on the work itself
                </Link>
                .
              </Clause>
              <Clause n="1.2">
                Work produced in the course of employment remains the property of the commissioning
                practice: SOMA (Verve City Walk, District O, Enara and Saria) and JEMMA Chidiac
                Architects (The Encounter, the Falcon). Project imagery remains theirs.
              </Clause>
              {/* BOTH INSTITUTIONS (her correction, 2026-07-30): IAAC covers the
                  MaCAD year, the Lebanese American University covers the
                  bachelor thesis (The Homage) and the XR Lab research. Spelled
                  out rather than "LAU", following the standing ruling recorded
                  in data/cv.ts: "LAU alone means nothing" to a reader outside
                  Lebanon, and this page is read by strangers by definition. */}
              <Clause n="1.3">
                Academic work was produced at IAAC and at the Lebanese American University.
              </Clause>
            </div>
          </Section>

          <Section label="Copyright and reuse">
            <div className={PROSE}>
              <Clause n="2.1">
                All text, drawings, diagrams and the downloadable book on this site are the
                copyright of Emilie El Chidiac. No license for reuse is granted.
              </Clause>
              <Clause n="2.2">
                Source code is published separately, in the repositories linked from each project,
                under the terms stated in each repository.
              </Clause>
              <Clause n="2.3">
                Requests for any other use may be made{' '}
                <Link to="/contact" viewTransition className={QUIET_LINK_TAP}>
                  through the contact page
                </Link>
                .
              </Clause>
            </div>
          </Section>

          <Section label="Data collected">
            <div className={PROSE}>
              <Clause n="3.1">
                The contact form collects an email address, a subject line and a message body. These
                are transmitted via{' '}
                <a
                  href="https://web3forms.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Web3Forms privacy policy (opens in new tab)"
                  // QUIET_LINK_TAP, not the bare paint (2026-08-03, restyled 2026-08-05). These two sit in
                  // running prose but they are the only two links in their
                  // paragraphs, so the -m-2/p-2 pad has no neighbouring hit box
                  // to overlap: the reason the /cv bullets and the MadeRows go
                  // unpadded does not apply here. Measured 20px, now 44.
                  className={QUIET_LINK_TAP}
                >
                  Web3Forms
                </a>{' '}
                and delivered to a single mailbox. They are not retained elsewhere, disclosed to any
                third party, or processed for any further purpose. No mailing list is operated.
              </Clause>
              <Clause n="3.2">
                Aggregate page views are recorded via{' '}
                <a
                  href="https://www.goatcounter.com/help/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GoatCounter privacy policy (opens in new tab)"
                  // QUIET_LINK_TAP, not the bare paint (2026-08-03, restyled 2026-08-05). These two sit in
                  // running prose but they are the only two links in their
                  // paragraphs, so the -m-2/p-2 pad has no neighbouring hit box
                  // to overlap: the reason the /cv bullets and the MadeRows go
                  // unpadded does not apply here. Measured 20px, now 44.
                  className={QUIET_LINK_TAP}
                >
                  GoatCounter
                </a>
                . No cookies are set and no IP addresses are retained. No consent notice is
                therefore required, and no visitor is identifiable.
              </Clause>
              <Clause n="3.3">
                The email address published on this site may be used in place of the form.
              </Clause>
            </div>
          </Section>

          <Section label="Third-party material">
            {/* 4.1 is the LIST, so the clause number introduces it rather than
                repeating in front of every font. Numbering each row would turn
                a colophon into an inventory. */}
            <div className={PROSE}>
              <Clause n="4.1">
                The following third-party material is used under the licenses stated.
              </Clause>
            </div>
            <ul className="mt-3 max-w-[62ch]">
              <MadeRow what="ARCHIVO · SOURCE SERIF 4" terms="SIL OFL 1.1" />
              <MadeRow what="MARTIAN MONO · CAVEAT" terms="SIL OFL 1.1" />
              <MadeRow
                what="OPENSTREETMAP"
                terms="ODbL · © OSM CONTRIBUTORS"
                href="https://www.openstreetmap.org/copyright"
              />
              {/* CC BY, version deliberately unstated: ldraw.org's legal page
                  says 2.0 and the .dat files themselves say 4.0, so naming a
                  number would be picking a side in someone else's paperwork.
                  Their contributor agreement says crediting "The LDraw Parts
                  Library" is sufficient in lieu of listing every author, so
                  that is exactly what this row does. */}
              <MadeRow
                what="THE LDRAW PARTS LIBRARY"
                terms="CC BY"
                href="https://www.ldraw.org/"
              />
            </ul>
            {/* HER OWN WORDING, lifted from the lEgoarCh app's footer where it
                has lived since the project shipped, with the em dash rewritten
                to a full stop. LEGO's Fair Play guidelines ask for exactly this
                sentence; there was no reason to invent a worse one. */}
            <div className={`mt-5 ${PROSE}`}>
              <Clause n="4.2">
                LEGO® is a trademark of the LEGO Group. lEgoarCh is academic, non-commercial
                coursework and is neither sponsored nor endorsed by the LEGO Group.
              </Clause>
            </div>
          </Section>
        </div>
      </article>
    </SheetPage>
  )
}
