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
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold">Expenses</h1>

        <div className="flex gap-4 flex-col md:flex-row ">
        

          <Link
            href="/dashboard/expenses/category"
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="h-5 md:ml-4" />
            <span className="hidden md:block"> Add Category </span>
            <span className="md:hidden block"> Category</span>
          </Link>

          <Link
            href="/dashboard/expenses/create"
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="h-5 md:ml-4" />
            <span className="hidden md:block"> New Expense </span>
            <span className="md:hidden block"> Expense</span>
          </Link>
        </div>
      </div>

      <div className="mt-6 w-full flex flex-col gap-4  justify-end">
        <MonthSelector />
        <div>
          {resultArray.length > 0 ? (
            <DonutChartLabelExample data={resultArray} />
          ) : (
            <div>
              <p>No chart data available yet</p>
            </div>
          )}
        </div>
       
        <CategorySelector categories={categories} />
        
        <div>
          {spending.length > 0 ? (
      
              <SpendingTableComponent data={spending} />
            
          ) : (
            <div>
              <p>No expense data available yet</p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </>
  );
}
