import Link from "next/link";
import { fetchSpending, fetchSpendingPages,fetchCategories,fetchCompiledSpendingByCategory,getSpendingGroupedByDate } from "@/lib/data";
import { SpendingTableComponent } from "@/app/ui/spending/table";
import { PlusIcon } from "@heroicons/react/24/outline";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Pagination from "@/app/ui/pagination";
import { DonutChartLabelExample } from "@/app/ui/spending/spending-chart";
import CategorySelector from "@/app/ui/category-selector";
import MonthSelector from "@/app/ui/month-selector";
import DateRangePicker from "@/app/ui/date-select";
import AddSpendDrawer from "./AddSpendDrawer";
import AddSpendButton from "./AddSpendButton";
import TransactionsTable from "./TransactionTable";
import CategorySpendingList from "./CategroySpendingList";

export default async function Expenses({params}: {params: Promise<{ page?: string;
    startDate?: string;
    endDate?: string;
    category?: string; }>} 
){
  const session = await auth();
  if (!session) redirect("/");

  const {startDate, endDate, category, page} = await params
 const currentPage = Number(page) || 1;


  const today = new Date();
  const year = today.getFullYear();
  const thisMonth = today.getMonth();
  const customStartDate = new Date(year, thisMonth - 1, 26);
  const customEndDate = new Date(year, thisMonth, 26);

  const startParam =
    startDate || customStartDate.toISOString().slice(0, 10);

  const endParam =
    endDate || customEndDate.toISOString().slice(0, 10);

  const categories = await fetchCategories();
  const { resultArray, totalPages } = await fetchSpendingPages(startParam, endParam);
  const spending = await fetchSpending(currentPage, startParam, endParam, category);
  const categorySpending = await fetchCompiledSpendingByCategory(startParam, endParam);
  const totalSpent = await getSpendingGroupedByDate(startParam, endParam);

  return (
    <>
      {/* Top date range selector */}
      {/* <div>
        <p>{session?.user?.name}{" "}</p>
      </div> */}
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

        <CategorySpendingList
          categorySpending={categorySpending}
          spending={spending}
        />

    

        {/* Add New Category Button */}
        <Link
          href="/dashboard/expenses/category"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-center font-medium mt-2"
        >
          Add New Category
        </Link>

        {/* Expense Table (Existing) */}
        {/* <div className="mt-4">
          {spending.length > 0 ? (
            <SpendingTableComponent data={spending} />
          ) : (
            <p className="text-center text-gray-500">No expense data available yet</p>
          )}
        </div>

        <div className="flex justify-end">
          <Pagination totalPages={totalPages} />
        </div> */}
      </div>
      
      
      <TransactionsTable  data={totalSpent} />
     
       <div>
      
        <AddSpendButton />
      </div>
      
    </>
  );

}
