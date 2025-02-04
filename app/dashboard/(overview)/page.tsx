import { Suspense } from "react";
import CardWrapper from "@/app/ui/dashboard/cards";
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from "@/app/ui/skeletons";
import { AreaChart } from "../../ui/charts/AreaChart";
import { fetchIncome } from "../../lib/data";
import { useState } from "react";
import { IncomeTableComponent } from "@/app/ui/dashboard/Tables";
import { LineChartOnValueChangeExample } from "@/app/ui/charts/LineChart";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {

  const session = await auth();
  if(!session) redirect('/')
  return (
    <main className=" h-[50vh]">
      <h1 className={` mb-4 text-xl md:text-2xl`}>Welcome, {session?.user?.name} </h1>
      <p>This is an overview of your finances so far</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CardWrapper />
      </div>

      <div className="flex items-center justify-center  h-full">

          <h1>Graphs and charts coming soon</h1>

      </div>

      {/* <div className="w-full bg-red">
        <LineChartOnValueChangeExample />
      </div> */}
      {/* <div className="mt-6 w-full">
          <div className="flex flex-col gap-16">
            {income ? (<IncomeTableComponent data={income} />) : <RevenueChartSkeleton />}
          </div>
        </div> */}
    </main>
  );
}
