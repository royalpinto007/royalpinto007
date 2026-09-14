const message = "Like the work? Buy me a coffee";

export function CoffeeTicker() {
  return (
    <a
      className="coffee-ticker"
      href="https://www.buymeacoffee.com/royalpinto007"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buy Royal Pinto a coffee"
    >
      <span className="coffee-ticker-track" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
          <span key={item}>
            {message} <b>↗</b>
          </span>
        ))}
      </span>
    </a>
  );
}
