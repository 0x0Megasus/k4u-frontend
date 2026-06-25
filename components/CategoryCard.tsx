import Link from "next/link";
import { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.id}`}
      className="group relative flex h-32 flex-col items-center justify-center overflow-hidden rounded-[2px] border-2 border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-all duration-200 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/5"
    >
      {/* Background logo blur */}
      {category.logo && (
        <img
          src={category.logo}
          alt={category.name}
          className="absolute inset-0 h-full w-full object-cover opacity-15 blur-sm transition-all duration-200 group-hover:scale-105 group-hover:opacity-25"
        />
      )}
      <span className="relative z-10 px-3 text-center text-sm font-bold leading-tight tracking-tight">
        {category.name}
      </span>
    </Link>
  );
}
