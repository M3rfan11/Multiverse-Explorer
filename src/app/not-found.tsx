import Link from "next/link";
import { PortalRing } from "@/components/ui/portal-ring";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-24 text-center">
      <PortalRing />
      <h1 className="font-display text-2xl font-bold text-white">
        Lost in the multiverse
      </h1>
      <p className="max-w-md text-sm text-slate-400">
        This page doesn&apos;t exist in any known dimension. The portal gun
        must have misfired.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-xl bg-portal-500 px-4 py-2 text-sm font-medium text-space-950 transition-colors hover:bg-portal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portal-500"
      >
        Back to all characters
      </Link>
    </main>
  );
}
