import type { Level } from "../data/types";

const levelStyles: Record<Level, string> = {
  Dasar: "bg-emerald-100 text-emerald-800",
  Menengah: "bg-sky-100 text-sky-800",
  Lanjutan: "bg-violet-100 text-violet-800",
  "Siap Ujian": "bg-rose-100 text-rose-800",
};

export default function Badge({ level }: { level: Level }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${levelStyles[level]}`}
    >
      {level}
    </span>
  );
}
