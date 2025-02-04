

import { Suspense } from 'react';
import CardWrapper from '@/app/ui/dashboard/cards';
import { RevenueChartSkeleton,} from '@/app/ui/skeletons'; 
import { fetchIncome } from '@/app/lib/data';
import { useState } from 'react';
import {IncomeTableComponent} from '@/app/ui/dashboard/Tables';
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Income() {
  const session = await auth();
  if(!session) redirect('/')
  const income = await fetchIncome();
    return (
      <main>
        <div className="mt-6 w-full">
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