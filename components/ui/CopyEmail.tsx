"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** "Send email" only works when the visitor has a mail app set up; this always works. */
export function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Older or locked-down browsers: fall back to a hidden selection.
      const field = document.createElement("textarea");
      field.value = email;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button type="button" className={`copy-email ${className ?? ""}`} onClick={copy}>
      {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied!" : "Copy address"}</span>
    </button>
  );
}
