/**
 * Fixed-height scalloped section edge.
 *
 * The height is a fixed step (h-8 → h-10), NOT `w-full` on an <img>. The prior
 * <img w-full> version scaled its height with viewport width (AR ~17:1), so on
 * wide screens the scallops grew to 100px+ and overlapped the neighbouring
 * section's CTA buttons (audit F1). A fixed height can never overlap.
 *
 * The scallop strip is stretched to full width (backgroundSize 100% 100%, no
 * repeat) so there is no tiling seam; on very wide screens the scallops read a
 * little flatter, which is acceptable for a decorative edge.
 *
 * `side` = which edge of the coloured band this decorates:
 *   'top'    → sits just ABOVE the band (its solid base aligns to the band top)
 *   'bottom' → sits just BELOW the band (its solid top aligns to the band bottom)
 * The band's own background colour MUST match the scallop image's solid colour
 * for the join to be seamless.
 */
export const ScallopEdge = ({ src, side }: { src: string; side: 'top' | 'bottom' }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-x-0 z-10 h-8 select-none bg-no-repeat sm:h-10 ${
      side === 'top' ? 'bottom-full -mb-px' : 'top-full -mt-px'
    }`}
    style={{ backgroundImage: `url('${src}')`, backgroundSize: '100% 100%' }}
  />
)
