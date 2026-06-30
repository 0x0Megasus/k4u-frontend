import { getCategories } from "@/lib/api";
import CategoryCard from "@/components/CategoryCard";
import { JsonLd } from "@/components/JsonLd";
import { buildSocialMetadata, BASE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildSocialMetadata({
  title: "القنوات الرياضية",
  description:
    "تصفح قائمة القنوات الرياضية المتاحة لمشاهدة مباريات كرة القدم بث مباشر. اختر القناة المناسبة لمتابعة البطولات والمباريات العالمية.",
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
      name: "القنوات الرياضية",
      item: `${BASE_URL}/browse`,
    },
  ],
};

export default async function BrowsePage() {
  const result = await getCategories();

  if (!result.success) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-[hsl(var(--muted-foreground))]">تعذر تحميل القنوات حالياً.</p>
      </div>
    );
  }

  const allCategories = result.data ?? [];
  const categories = allCategories.filter(
    (c) =>
      c.child_count === 0 &&
      c.name?.toLowerCase().includes("bein sports (")
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">القنوات الرياضية</h1>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
            اختر القناة التي تريد متابعتها من القائمة المتاحة.
          </p>
        </div>

        {categories.length === 0 ? (
          <p className="text-[hsl(var(--muted-foreground))]">لا توجد قنوات متاحة حالياً.</p>
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
