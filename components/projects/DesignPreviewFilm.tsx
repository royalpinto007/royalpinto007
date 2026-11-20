/** The image underneath stays visible until a real frame starts playing. */
export function DesignPreviewFilm({ src }: { src: string }) {
  return (
    <video
      aria-hidden="true"
      className="design-preview-film"
      data-preview-src={src}
      muted
      playsInline
      loop
      preload="none"
      disablePictureInPicture
      width={768}
      height={512}
    />
  );
}
