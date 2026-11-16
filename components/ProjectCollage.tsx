import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import "./facetworks.css";

export function ProjectCollage({
  items,
  href,
  caption,
  action,
  className,
}: {
  items: readonly { id: string; image: string }[];
  href: string;
  caption: string;
  action: string;
  className: string;
}) {
  return (
    <a className={`project-collage ${className}`} href={href}>
      <div className="collage-screens" aria-hidden="true">
        {items.map((item) => (
          <div className="collage-screen" key={item.id}>
            <Image
              src={item.image}
              alt=""
              width={960}
              height={640}
              sizes="(max-width: 767px) 25vw, 20vw"
            />
          </div>
        ))}
      </div>
      <div className="collage-caption">
        <span>{caption}</span>
        <span>
          {action}
          <ArrowUpRight aria-hidden="true" size={22} />
        </span>
      </div>
    </a>
  );
}
