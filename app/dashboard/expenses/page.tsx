import Link from "next/link";
import {fetchSpending, fetchSpendingPages} from "@/app/lib/data";
import {SpendingTableComponent} from "@/app/ui/dashboard/Tables";
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Pagination from "@/app/ui/pagination";

export default async function Expenses(props: {
  searchParams?: Promise<{
    page?: string;
  }>;
}) {
  const session = await auth();
  if(!session) redirect('/')

  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchSpendingPages();
  const spending = await fetchSpending(currentPage);

    return(
        <>
          <div className="flex justify-end gap-4">
         

            <Link href="/dashboard/expenses/category" className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" >
              <PlusIcon className="h-5 md:ml-4" />
              <span className="hidden md:block"> Add Category </span>
              <span className="md:hidden block" > Category</span>
            </Link >

            <Link href="/dashboard/expenses/create" className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" >
              <PlusIcon className="h-5 md:ml-4" />
              <span className="hidden md:block"> New Expense </span>
              <span className="md:hidden block" > Expense</span>
            </Link >
          </div>
            <div className="mt-6 w-full">
              <div className="flex flex-col gap-16">
                <div>
                  <h1 className="text-2xl font-semibold">Expenses</h1>
                  {spending.length>0 ? (<SpendingTableComponent data={spending}  />) : 
                    <div>
                      <p>No expense data available yet</p>
                    </div>
                  }
                </div>

                <Pagination totalPages={totalPages}  />
              </div>
            </div>
            
        </>
    )
}