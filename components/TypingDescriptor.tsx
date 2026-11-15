import type { CSSProperties } from "react";

const phrases = [
  "AI agents.",
  "full-stack apps.",
  "automations.",
  "Web3 tools.",
];

/** The full description stays accessible; only its decorative duplicate types. */
export function TypingDescriptor() {
  return (
    <p className="hero-description typing-description">
      <span className="typing-static">
        AI agents. Full-stack. Automation. Web3.
      </span>
      <span className="typing-visual" aria-hidden="true">
        <span>Working across</span>
        <span className="typing-words">
          {phrases.map((phrase, i) => (
            <span
              className="typing-word"
              key={phrase}
              style={
                {
                  "--letters": phrase.length,
                  "--phase": `${i * 2}s`,
                } as CSSProperties
              }
            >
              <span className="typing-reveal">{phrase}</span>
              <i className="typing-caret" />
            </span>
          ))}
        </span>
      </span>
    </p>
  );
}
