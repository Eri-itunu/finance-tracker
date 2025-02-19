

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { RevenueChartSkeleton,} from '@/app/ui/skeletons'; 
import { fetchIncome, fetchIncomePages } from '@/app/lib/data';
import { useState } from 'react';
import {IncomeTableComponent} from '@/app/ui/dashboard/Tables';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from 'next/link';

export default async function Income(props: {
  searchParams?: Promise<{
    page?: string;
  }>;
})  {
  const session = await auth();
  if(!session) redirect('/')

  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchIncomePages();
  const income = await fetchIncome(currentPage);
    return (
      <main>
        <div className="mt-6 w-full">
          <div className="flex justify-end gap-4">
           

            <Link href="/dashboard/income/create" className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" >
              <PlusIcon className="h-5 md:ml-4" />
              <span className="hidden md:block"> New Income </span>
              <span className="md:hidden block" > Income</span>
            </Link >
          </div>
          <h1 className='text-2xl font-bold' >
            Income
          </h1>
          <div className="flex flex-col gap-16">
            {income.length > 0 ? (<IncomeTableComponent data={income} />) : 'No income data added yet'}
          </div>
        </div>
      </main>
    );
  }