import EmptyState from "../components/EmptyState";

export default function NotFoundPage() {
  return (
    <EmptyState
      title="Halaman tidak ditemukan (404)"
      description="Alamat yang Anda buka tidak cocok dengan halaman mana pun di portal ini."
      ctaLabel="Kembali ke Beranda"
      ctaTo="/"
    />
  );
}
