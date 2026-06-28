import { getCategories } from "@/lib/api";
import CategoryCard from "@/components/CategoryCard";
import { JsonLd } from "@/components/JsonLd";
import { buildSocialMetadata, BASE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildSocialMetadata({
  title: "جميع قنوات البث المباشر — Live Koora",
  description:
    "تصفح جميع قنوات البث المباشر الرياضية. قنوات HD لمشاهدة مباريات اليوم كورة لايف بث مباشر بدون تقطيع.",
  path: "/browse",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Live Koora", item: BASE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "القنوات",
      item: `${BASE_URL}/browse`,
    },
  ],
};

export default async function BrowsePage() {
  const result = await getCategories();

  if (!result.success) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-[hsl(var(--muted-foreground))]">تعذر تحميل التصنيفات.</p>
      </div>
    );
  }

  const allCategories = result.data ?? [];
  const categories = allCategories.filter(
    (c) => c.child_count === 0 && c.name?.toLowerCase().includes("bein")
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">قنوات beIN SPORTS</h1>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
            تصفح قنوات بي إن سبورت المتاحة لمشاهدة مباريات اليوم بث مباشر
          </p>
        </div>

        {categories.length === 0 ? (
          <p className="text-[hsl(var(--muted-foreground))]">لا توجد قنوات متاحة.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
