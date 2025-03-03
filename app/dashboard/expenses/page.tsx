import Link from "next/link";
import { fetchSpending, fetchSpendingPages, fetchCategories } from "@/lib/data";
import { SpendingTableComponent } from "@/app/ui/spending/table";
import {  PlusIcon } from "@heroicons/react/24/outline";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Pagination from "@/app/ui/pagination";
import { DonutChartLabelExample } from "@/app/ui/spending/spending-chart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MonthSelector from "@/app/ui/month-selector";

export default async function Expenses(props: {
  searchParams?: Promise<{
    page?: string;
    month?:string;
  }>;
}) {
  const session = await auth();
  if (!session) redirect("/");

  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const currentMonth = searchParams?.month || new Date().toISOString().slice(0, 7);
  const {  resultArray,totalPages } = await fetchSpendingPages(currentMonth);
  const spending = await fetchSpending(currentPage,currentMonth);
  const categories = await fetchCategories();

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold">Expenses</h1>

        <div className="flex gap-4 flex-col md:flex-row ">
          <Dialog>
            <DialogTrigger  >
              <span className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" >
                - Delete Category
              </span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete a category</DialogTitle>
                <DialogDescription>
                  <ul className="list-disc flex flex-col gap-1 pl-5">
                    {categories.map((category) => (
                      <div key={category.id} className="flex ">
                        <li>{category.categoryName} </li>
                      </div>
                    ))}
                  </ul>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

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
