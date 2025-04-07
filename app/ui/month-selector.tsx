'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function MonthSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use the current month if none is specified in the URL
  const currentDay = new Date().getDate();
  const currentMonth = searchParams.get('month') || new Date().toISOString().slice(0, 7);
  const currentYear = new Date().getFullYear(); // Dynamically get the year

  // Generate the list of months dynamically for the current year
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentYear, i, 1);
    const month = (i + 1).toString().padStart(2, '0'); // Ensures two digits (01, 02, etc.)
    return {
      value: `${currentYear}-${month}`, // Format: YYYY-MM
      label: date.toLocaleString('default', { month: 'long' })
    };
  });

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams.toString()); // Create a new instance
    newParams.set('month', e.target.value);

    // Use shallow routing to prevent full page reload
    router.push(`/dashboard/expenses?${newParams.toString()}`, { scroll: false });
  };

  return (
    <div>
      <select
        value={currentMonth}
        onChange={handleMonthChange}
        className="rounded-md border border-gray-200 py-2 px-4"
      >
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>
    </div>
  );
}
