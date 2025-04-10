"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type CategoryDropdownProps = {
    categories: category[]
};

type category = {
    id: number;
    userId: number | null;
    categoryName: string;
}

export default function CategoryDropdown({ categories }: CategoryDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    const currentCategory = searchParams.get("category") || "";
    setSelected(currentCategory);
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setSelected(newCategory);

    const params = new URLSearchParams(searchParams.toString());
    if (newCategory) {
      params.set("category", newCategory);
    } else {
      params.delete("category");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full max-w-xs">
      <label htmlFor="category" className="block mb-1 text-sm font-medium">
        Filter by Category
      </label>
      <select
        id="category"
        value={selected}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-500"
      >
        <option value="">All</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.categoryName}>
            {cat.categoryName}
          </option>
        ))}
      </select>
    </div>
  );
}
