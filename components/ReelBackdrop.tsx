/** Celluloid belongs to the reel alone, including its static fallback. */
export function ReelBackdrop({ offset = 0 }: { offset?: number }) {
  return (
    <div className="reel-backdrop" aria-hidden="true">
      <div className="film-track" style={{ translate: `0 ${offset}px` }}>
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="film-aperture">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
