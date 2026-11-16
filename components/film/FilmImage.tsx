import { useCallback, useState, type ComponentProps } from "react";
import { Img } from "remotion";

/** Async image errors must reach the Player's React error boundary as well. */
export function FilmImage(props: Omit<ComponentProps<typeof Img>, "onError">) {
  const [failed, setFailed] = useState(false);
  const fail = useCallback(() => setFailed(true), []);
  if (failed) throw new Error("A reel image could not be loaded");
  return <Img {...props} maxRetries={1} onError={fail} />;
}
