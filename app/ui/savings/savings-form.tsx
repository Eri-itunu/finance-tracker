"use client";

import Link from "next/link";
import {
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useActionState } from "react";
import { createSavingsCategory } from "@/lib/actions";

type savingsGoals = {
  id: number;
  userId: number | null;
  goalName: string;
};
type State = {
  message: string;
  errors: {
    savingsGoal?: string[];
    amount?: string[];
  };
};
export default function Create({
  savings,
  userId,
}: {
  savings: savingsGoals[];
  userId: string;
}) {
  const initialState: State = { message: "", errors: {} };
  const [state, formAction, pending] = useActionState(
    createSavingsCategory,
    initialState
  );
  //const categories = await fetchCategories();
  return (
    <>
      <form action={formAction} className="w-full  mx-auto">
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* savingsGoal Name */}
          <input type="hidden" name="userId" value={userId} />
          <div className="mb-4">
            <label
              htmlFor="savingsGoal"
              className="mb-2 block text-sm font-medium"
            >
              Choose a savings goal
            </label>
            <div className="relative">
              <select
                id="savingsId"
                name="savingsId"
                className="peer  block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue=""
                aria-describedby="savingsgoal-error"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {savings.map((savings) => (
                  <option key={savings.id} value={savings.id}>
                    {savings.goalName}
                  </option>
                ))}
              </select>
              <UserCircleIcon className="hidden md-block pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="category-error" aria-live="polite" aria-atomic="true">
              {state.errors?.savingsId &&
                state.errors?.savingsId.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Spending Amount */}
          <div className="mb-4">
            <label htmlFor="amount" className="mb-2 block text-sm font-medium">
              Enter amount
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="Enter Naira amount"
                  className="peer text-[16px] block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="amount-error" aria-live="polite" aria-atomic="true">
                {state.errors?.amount &&
                  state.errors.amount.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/savings"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <button aria-disabled={pending} type="submit">
            {pending ? "Adding Savings... " : "Add Savings"}
          </button>
        </div>
      </form>
    </>
  );
}
