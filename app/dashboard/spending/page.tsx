import Link from "next/link";
import {fetchSpending} from "@/app/lib/data";
import {SpendingTableComponent} from "@/app/ui/dashboard/Tables";
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Spending(){

  const spending = await fetchSpending();
     const session = await auth();
      if(!session) redirect('/')
    return(
        <>
          <div className="flex justify-end gap-4">
         

            <Link href="/dashboard/spending/category" className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" >
              <PlusIcon className="h-5 md:ml-4" />
              <span className="hidden md:block"> Add Category </span>{' '}
            </Link >

            <Link href="/dashboard/spending/create" className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" >
              <PlusIcon className="h-5 md:ml-4" />
              <span className="hidden md:block"> Add spend</span>{' '}
            </Link >
          </div>
            <div className="mt-6 w-full">
              <div className="flex flex-col gap-16">
                <div>
                  <h1 className="text-2xl font-semibold">Spending</h1>
                  {spending ? (<SpendingTableComponent data={spending}  />) : 
                    <div>
                      <p>No spending data available yet</p>
                    </div>
                  }
                </div>
              </div>
            </div>
            
        </>
    )
}