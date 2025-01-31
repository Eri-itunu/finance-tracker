

import { Suspense } from 'react';
import CardWrapper from '@/app/ui/dashboard/cards';
import { RevenueChartSkeleton,} from '@/app/ui/skeletons'; 
import { fetchIncome } from '@/app/lib/data';
import { useState } from 'react';
import {IncomeTableComponent} from '@/app/ui/dashboard/Tables';


export default async function Income() {
  const income = await fetchIncome();
    return (
      <main>
        <div className="mt-6 w-full">
          <div className="flex flex-col gap-16">
            {income ? (<IncomeTableComponent data={income} />) : <RevenueChartSkeleton />}
          </div>
        </div>
      </main>
    );
  }