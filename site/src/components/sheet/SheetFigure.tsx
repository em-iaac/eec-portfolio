// Sheet figure: uniform 4:3 crop (memo requirement), emphasized border,
// mono caption. Animated webps ride the same manifest pipeline.
import Img from '../Img'

export default function SheetFigure({
  slug,
  name,
  alt,
  caption,
  position,
}: {
  slug: string
  name: string
  alt: string
  caption: string
  position?: string
}) {
  return (
    <figure className="m-0">
      <div className="aspect-[4/3] overflow-hidden border border-ink/35">
        <Img
          slug={slug}
          name={name}
          alt={alt}
          sizes="(max-width: 700px) 100vw, 380px"
          style={position ? { objectPosition: position } : undefined}
          className="block h-full w-full object-cover"
        />
      </div>
      <figcaption className="mt-1.5 font-mono text-[9px] tracking-[0.08em] text-anno">
        {caption}
      </figcaption>
    </figure>
  )
}
