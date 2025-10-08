import AICard from "@/app/ui/dashboard/AICard";
import CardWrapper from "@/app/ui/dashboard/CardWrapper";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/");
  return (
    <main className=" h-[50vh]">
      <h1 className={` mb-4 text-xl md:text-2xl`}>
        Welcome, {session?.user?.name}{" "}
      </h1>
      <p>This is an overview of your documented finances so far</p>
   
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CardWrapper />
      </div>

      <div className="flex items-center justify-center w-full mt-4 h-full">
        <AICard />
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
