import Link from "next/link";
import { fetchSpending, fetchSpendingPages,fetchCategories } from "@/lib/data";
import { SpendingTableComponent } from "@/app/ui/spending/table";
import { PlusIcon } from "@heroicons/react/24/outline";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Pagination from "@/app/ui/pagination";
import { DonutChartLabelExample } from "@/app/ui/spending/spending-chart";
import CategorySelector from "@/app/ui/category-selector";
import MonthSelector from "@/app/ui/month-selector";
import DateRangePicker from "@/app/ui/date-select";


export default async function Expenses(props: {
  searchParams?: Promise<{
    page?: string;
    startDate?:string;
    endDate?:string;
    category?:string;
  }>;
}) {
  const session = await auth();
  if (!session) redirect("/");

  const today = new Date();
  const year = today.getFullYear();
  const thisMonth = today.getMonth();
  const customStartDate = new Date(year, thisMonth-1, 26);
  const customEndDate = new Date(year, thisMonth, 26);
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const category = searchParams?.category || "";
  
  const startParam = searchParams?.startDate || customStartDate.toISOString().slice(0, 10);
  const endParam = searchParams?.endDate || customEndDate.toISOString().slice(0, 10);
  const categories = await fetchCategories();
  const { resultArray, totalPages } = await fetchSpendingPages(startParam, endParam);
  const spending = await fetchSpending(currentPage,  startParam, endParam, category);


  return (
    <>
      {/* Top date range selector */}
      <div className="w-full flex justify-center mt-4">
        <button
          className="text-purple-600 font-semibold text-lg "
  
        >
          {/* {formatShort(startParam)} — {formatShort(endParam)} */}
          <DateRangePicker startParam={startParam} endParam={endParam} />
        </button>
      </div>
     

      {/* Categories + Spending */}
      <div className="mt-6 px-4 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex justify-between items-center px-1">
          <h2 className="text-gray-800 font-medium text-sm uppercase tracking-wide">
            Category
          </h2>
          <h2 className="text-gray-800 font-medium text-sm uppercase tracking-wide">
            Spent
          </h2>
        </div>

        {/* Category list */}
        <div className="flex flex-col gap-3">
          {resultArray?.length > 0 ? (
            resultArray.map((item: any) => (
              <div
                key={item.category}
                className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl shadow-sm border"
              >
                <p className="text-gray-700 font-medium">{item.category}</p>
                <p className="text-gray-900 font-semibold">{item.amount}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No categories found</p>
          )}
        </div>

        {/* Add New Category Button */}
        <Link
          href="/dashboard/expenses/category"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-center font-medium mt-2"
        >
          Add New Category
        </Link>

        {/* Expense Table (Existing) */}
        <div className="mt-4">
          {spending.length > 0 ? (
            <SpendingTableComponent data={spending} />
          ) : (
            <p className="text-center text-gray-500">No expense data available yet</p>
          )}
        </div>

        <div className="flex justify-end">
          <Pagination totalPages={totalPages} />
        </div>
      </div>

      {/* Floating Plus Button */}
      <Link
        href="/dashboard/expenses/create"
        className="
          fixed bottom-24 right-6
          bg-black text-white
          hover:bg-purple-700
          transition
          w-14 h-14 rounded-full
          flex items-center justify-center
          shadow-xl
          z-50
        "
      >
        <PlusIcon className="w-7 h-7" />
      </Link>
    </>
  );

}
