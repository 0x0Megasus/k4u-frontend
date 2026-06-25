import { getEvents } from "@/lib/api";
import MatchList from "@/components/MatchList";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const result = await getEvents();

  if (!result.success) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-[hsl(var(--muted-foreground))] text-lg">
          تعذر تحميل مباريات اليوم.
        </p>
      </div>
    );
  }

  const events = result.data ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">مباريات اليوم</h1>
        <p className="mt-1 text-[hsl(var(--muted-foreground))] text-sm">
          مباريات مباشرة وقادمة من جميع أنحاء العالم
        </p>
      </div>

      {events.length === 0 ? (
        <p className="text-[hsl(var(--muted-foreground))]">
          لا توجد مباريات مجدولة اليوم.
        </p>
      ) : (
        <MatchList events={events} />
      )}
    </div>
  );
}
