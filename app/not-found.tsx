import Link from "next/link";
import { buildSocialMetadata } from "@/lib/seo";

export const metadata = buildSocialMetadata({
  title: "الصفحة غير موجودة — Live Koora",
  description:
    "الصفحة التي تحاول الوصول إليها غير متاحة. عد إلى مباريات اليوم أو تصفح القنوات الرياضية.",
  path: "",
});

export default function NotFound() {
  return (
    <>
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-bold tracking-tight">404</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          الصفحة غير موجودة
        </p>
        <Link
          href="/"
          className="rounded-[2px] border-2 border-[hsl(var(--border))] px-4 py-2 text-xs font-semibold transition-all hover:border-violet-500/40 hover:text-violet-300"
        >
          العودة إلى مباريات اليوم
        </Link>
      </div>
    </>
  );
}
