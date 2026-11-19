import { ArrowUpRight } from "lucide-react";

const message = "Like the work? Buy me a coffee";

export function CoffeeTicker() {
  return (
    <a
      className="coffee-ticker"
      href="https://www.buymeacoffee.com/royalpinto007"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="coffee-ticker-track">
        {message} <ArrowUpRight size={13} aria-hidden="true" />
      </span>
    </a>
  );
}
