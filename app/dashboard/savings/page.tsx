import { fetchSavings } from "@/lib/data";
import { SavingsTableComponent } from "@/app/ui/dashboard/Tables";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { DonutChartLabelExample } from "@/app/ui/savings/savings-charts";

export default async function Savings() {
  const session = await auth();
  if (!session) redirect("/");
  const savings = await fetchSavings();
  return (
    <div>
      <div className="flex justify-end gap-4">
        <Link
          href="/dashboard/savings/category"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <PlusIcon className="h-5 md:ml-4" />
          <span className="hidden md:block"> Add Saving Goal </span>
          <span className="md:hidden block"> Goal</span>
        </Link>

        <Link
          href="/dashboard/savings/create"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <PlusIcon className="h-5 md:ml-4" />
          <span className="hidden md:block"> Update Savings </span>
          <span className="md:hidden block"> Savings</span>
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold">Savings</h1>
      </div>

      <div>
        <DonutChartLabelExample data={savings} />
      </div>
      {savings.length > 0 ? (
        <SavingsTableComponent data={savings} />
      ) : (
        <div>
          <p>No savings data available yet</p>
        </div>
      )}
    </div>
  );
}
