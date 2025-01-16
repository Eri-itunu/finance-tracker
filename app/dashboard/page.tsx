

import { Suspense } from 'react';
import CardWrapper from '@/app/ui/dashboard/cards';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons'; 
import { AreaChart } from '../ui/charts/AreaChart';
import { fetchSavings } from '../lib/data';
import { useState } from 'react';

export default async function Page() {

    return (
      <main>
        <h1 className={` mb-4 text-xl md:text-2xl`}>
          Hi, Eri 
        </h1>
        <p>This is an overview of your finances so far</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CardWrapper />
        </div>
        <div className="mt-6 w-full">
        <div className="flex flex-col gap-16">
         
        </div>

        </div>
      </main>
    );
  }