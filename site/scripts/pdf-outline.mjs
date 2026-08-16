// THE BOOKMARK PANEL (Emilie, 2026-08-16, the links pass). The book prints as
// 20 pages with no outline at all, so a reader who wanted Verve scrolled for
// it. Chrome's print pipeline cannot emit an outline — it has no notion of
// which DOM node is a chapter — so the tree is written here, after the print,
// as a post-process over the bytes Chrome produced.
//
// pdf-lib has no first-class outline API, so this builds the dictionaries by
// hand. That is fine and it is also the whole risk: get the linked list wrong
// (a missing /Prev, a /Count on a leaf) and readers disagree about what to
// draw. The shape below is the plain one from the spec — a flat list of
// top-level items, each with /Parent, /Dest and its two neighbours.
//
// ⚠ The link ANNOTATIONS Chrome already wrote are page-level objects; pdf-lib
// parses and re-serialises them untouched. The outline is additive, and
// render-pdfs.mjs re-counts the links AFTER this runs so a regression here
// can never ship silently.
import { PDFDocument, PDFName, PDFNumber, PDFArray, PDFHexString } from 'pdf-lib'

/**
 * @param {Uint8Array} bytes  a printed PDF
 * @param {{title: string, page: number}[]} entries  page is 1-BASED
 * @returns {Promise<Uint8Array>} the same PDF carrying an outline tree
 */
export async function addOutline(bytes, entries) {
  // ⚠ updateMetadata: false. pdf-lib's default is TRUE, and it does not mean
  // "keep the metadata up to date" — it overwrites /Producer with "pdf-lib
  // (https://github.com/Hopding/pdf-lib)" and stamps /ModDate with the moment
  // of the run. The book shipped for one build claiming pdf-lib produced it,
  // which is both untrue (Chrome did) and a build-to-build diff in a file that
  // is otherwise deterministic. This pass adds a bookmark tree; it has no
  // business rewriting the document's provenance.
  const pdf = await PDFDocument.load(bytes, { updateMetadata: false })
  const context = pdf.context
  const pages = pdf.getPages()

  const valid = entries.filter(e => e.page >= 1 && e.page <= pages.length)
  if (valid.length === 0) return bytes

  const outlinesRef = context.nextRef()
  const refs = valid.map(() => context.nextRef())

  valid.forEach((entry, i) => {
    const page = pages[entry.page - 1]
    // /XYZ with a null zoom: land at the TOP-LEFT of the sheet and leave the
    // reader's zoom exactly as they set it. A destination that also sets zoom
    // yanks the view every time someone uses the panel.
    const dest = PDFArray.withContext(context)
    dest.push(page.ref)
    dest.push(PDFName.of('XYZ'))
    dest.push(PDFNumber.of(0))
    dest.push(PDFNumber.of(page.getHeight()))
    dest.push(context.obj(null))

    // Titles go out as UTF-16BE hex strings: the book's own contents carry
    // accented names, and a PDFString would mangle them the way the file's
    // title metadata is already mangled.
    const item = context.obj({
      Title: PDFHexString.fromText(entry.title),
      Parent: outlinesRef,
      Dest: dest,
    })
    if (i > 0) item.set(PDFName.of('Prev'), refs[i - 1])
    if (i < valid.length - 1) item.set(PDFName.of('Next'), refs[i + 1])
    context.assign(refs[i], item)
  })

  context.assign(
    outlinesRef,
    context.obj({
      Type: PDFName.of('Outlines'),
      First: refs[0],
      Last: refs[refs.length - 1],
      // Positive = the panel opens with the tree expanded. Every item is a
      // leaf, so this is the total and there is no sub-count to keep in step.
      Count: PDFNumber.of(valid.length),
    }),
  )

  pdf.catalog.set(PDFName.of('Outlines'), outlinesRef)
  // ⚠ NO /PageMode HERE, and that is a decision (Emilie, 2026-08-16). The first
  // version set /UseOutlines, which orders every reader's viewer to open with
  // the bookmark sidebar showing. Her ruling: let the reader decide. On a
  // landscape book the forced panel eats a third of the width and the first
  // thing a stranger meets is chrome rather than the cover. The panel is still
  // there for anyone who wants it — offering navigation and seizing the window
  // are different things.

  // Object streams ON. Writing them off costs ~300KB on a 3.5MB book (every
  // indirect object gets its own uncompressed header), and this file has a
  // hard 9MB build ceiling and a 5MB target because it gets emailed.
  return pdf.save({ useObjectStreams: true })
}

/**
 * What every page actually reaches, per page.
 *
 * ⚠ THIS RETURNS DESTINATIONS, NOT A COUNT, and the difference is the whole
 * point. The first version counted /Link annotations and the build asserted a
 * global total against a floor — which could not fail, because Chrome emits one
 * annotation PER INLINE TEXT RUN rather than per <a>. A single footer URL split
 * across three JSX children arrives as three annotations, so the totals were
 * roughly 1.5x the number of real links and the floor was met several times
 * over by one surface. De-duplicating by target makes the numbers mean what
 * their assertions say, and makes them immune to a JSX tidy-up moving them.
 *
 * @returns {Promise<{annots: number, pages: {uris: string[], dests: string[]}[]}>}
 *   `uris` = distinct external targets on that page, `dests` = distinct
 *   in-document destination NAMES (Chrome writes named destinations for
 *   same-page hrefs, and writes nothing at all when the target id is missing).
 */
export async function readLinks(bytes) {
  const pdf = await PDFDocument.load(bytes, { updateMetadata: false })
  let annots = 0
  const pages = []
  for (const page of pdf.getPages()) {
    const list = page.node.Annots()
    const uris = new Set()
    const dests = new Set()
    if (list) {
      for (let i = 0; i < list.size(); i++) {
        const a = list.lookup(i)
        if (a?.get?.(PDFName.of('Subtype')) !== PDFName.of('Link')) continue
        annots++
        const action = a.get(PDFName.of('A'))
        const uri = action?.get?.(PDFName.of('URI'))
        if (uri) uris.add(uri.decodeText ? uri.decodeText() : String(uri))
        const dest = a.get(PDFName.of('Dest'))
        // A named destination arrives as a PDFName (/plate-sensi) or a string.
        if (dest) dests.add(String(dest).replace(/^\//, ''))
      }
    }
    pages.push({ uris: [...uris], dests: [...dests] })
  }
  return { annots, pages }
}

/** Every destination NAME the document actually defines, for resolving links. */
export async function definedDestinations(bytes) {
  const pdf = await PDFDocument.load(bytes, { updateMetadata: false })
  const names = new Set()
  const root = pdf.catalog.get(PDFName.of('Names'))
  const destsNode = root?.get?.(PDFName.of('Dests'))
  const walk = (node) => {
    if (!node) return
    const names_ = node.get?.(PDFName.of('Names'))
    if (names_) {
      for (let i = 0; i < names_.size(); i += 2) {
        const k = names_.get(i)
        names.add((k?.decodeText ? k.decodeText() : String(k)).replace(/^\//, ''))
      }
    }
    const kids = node.get?.(PDFName.of('Kids'))
    if (kids) for (let i = 0; i < kids.size(); i++) walk(kids.lookup(i))
  }
  walk(destsNode ? pdf.context.lookup(destsNode) ?? destsNode : null)
  // Older writers use the /Dests dictionary in the catalog instead of a name tree.
  const flat = pdf.catalog.get(PDFName.of('Dests'))
  const flatDict = flat ? pdf.context.lookup(flat) : null
  if (flatDict?.keys) for (const k of flatDict.keys()) names.add(String(k).replace(/^\//, ''))
  return names
}

/**
 * Every raster the document carries, so a CSS construct that silently becomes
 * a bitmap cannot ship unnoticed.
 *
 * ⚠ THIS EXISTS BECAUSE ONE DID. A dotted leader written as a radial-gradient
 * printed as nine tiling patterns, each painting a full-sheet 842x595px image
 * at an effective 72dpi, and it passed every gate the build had: the page fit
 * its box, the text layer was intact, the link count was up, the weight was
 * under target. Nothing looked at whether the page was still DRAWN. The same
 * trap waits for filter, box-shadow and backdrop-filter.
 */
export async function rasterCensus(bytes) {
  const pdf = await PDFDocument.load(bytes, { updateMetadata: false })
  const pages = []
  for (const page of pdf.getPages()) {
    const res = page.node.Resources()
    const xobj = res?.get?.(PDFName.of('XObject'))
    const xdict = xobj ? pdf.context.lookup(xobj) : null
    let images = 0
    if (xdict?.entries) {
      for (const [, ref] of xdict.entries()) {
        const o = pdf.context.lookup(ref)
        if (o?.get?.(PDFName.of('Subtype')) === PDFName.of('Image')) images++
      }
    }
    const pat = res?.get?.(PDFName.of('Pattern'))
    const pdict = pat ? pdf.context.lookup(pat) : null
    const patterns = pdict?.entries ? [...pdict.entries()].length : 0
    pages.push({ images, patterns })
  }
  return pages
}
