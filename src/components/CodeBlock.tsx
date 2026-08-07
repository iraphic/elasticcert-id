import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { CodeExample } from "../data/types";

export default function CodeBlock({ example }: { example: CodeExample }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(example.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard tidak tersedia; abaikan
    }
  }

  return (
    <figure className="overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
      <figcaption className="flex items-center justify-between gap-2 border-b border-slate-700 px-4 py-2.5">
        <span className="truncate text-sm font-medium text-slate-200">{example.title}</span>
        <div className="flex items-center gap-2">
          <span className="rounded bg-slate-700 px-2 py-0.5 text-xs font-semibold uppercase text-slate-300">
            {example.lang}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex h-8 items-center gap-1 rounded-md bg-slate-700 px-2.5 text-xs font-semibold text-slate-100 hover:bg-slate-600"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden /> Tersalin
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden /> Salin
              </>
            )}
          </button>
        </div>
      </figcaption>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-slate-100">
        <code>{example.code}</code>
      </pre>
    </figure>
  );
}
