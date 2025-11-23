// app/spend/new/SpendFormClient.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";
import { createSpending } from "@/lib/actions";
import { useActionState } from "react"; // follows your project pattern

type Category = {
  id: number;
  userId: number | null;
  categoryName: string;
};

type Props = {
  categories: Category[];
  userId: string;
  amount: string; // numeric string passed via query param
};

export default function SpendFormClient({ categories, userId, amount }: Props) {
  const router = useRouter();

  // action state pattern you used elsewhere
  const initialState = { message: "", errors: {} } as any;
  const [state, formAction, pending] = useActionState(createSpending, initialState);

  const [itemName, setItemName] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [repeat, setRepeat] = useState("never");

  // formatted display (NGN 2,563.00)
  const formattedAmount = useMemo(() => {
    const n = Number(amount || "0");
    return `NGN ${n.toLocaleString("en-NG")}.00`;
  }, [amount]);

  return (
    <div className="overflow-scroll mb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b bg-white sticky top-0 z-20">
        <button onClick={() => router.back()} aria-label="Back" className="p-1">
          <ArrowLeft size={24} />
        </button>

        <div className="text-center">
          <p className="text-lg font-semibold">{formattedAmount}</p>
        </div>

        <button
          type="submit"
          form="spendForm"
          className="bg-green-500 text-white text-sm px-4 py-2 rounded-full"
        >
          Add
        </button>
      </header>

      {/* Form container */}
      <form id="spendForm" action={formAction} className="px-4 pt-4 space-y-6">
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="amount" value={amount} />

        {/* For */}
        <div className="flex items-center justify-between py-4 border-b">
          <div className="text-sm text-gray-700 w-1/3">For</div>
          <div className="w-2/3 text-right">
            <input
              name="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="What did you spend on?"
              className="w-full text-right placeholder-gray-400 text-base border-none outline-none"
            />
          </div>
        </div>



        {/* Date */}
        <div className="flex items-center justify-between py-4 border-b">
          <div className="text-sm text-gray-700 w-1/3">Date</div>
          <div className="w-2/3 text-right">
            <input
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-right border-none outline-none placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-between py-4 border-b">
           <div className="text-sm text-gray-700 w-1/3">Notes (optional)</div>
          <textarea
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add a note"
            className="w-full text-right border-none outline-none placeholder-gray-400"
            rows={1}
          />
        </div>



        {/* Categories header */}
        <div className="mt-4 text-xs uppercase tracking-wide text-gray-500">Categories</div>

        {/* Categories list */}
        <div className="space-y-3 mb-24">
          {categories.map((c) => (
            <label key={c.id} className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                  <span className="text-sm font-semibold">{c.categoryName.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-sm font-medium">{c.categoryName}</div>
                </div>
              </div>

              <input
                type="radio"
                name="categoryId"
                value={c.id}
                checked={Number(categoryId) === c.id}
                onChange={() => setCategoryId(c.id)}
                className="w-5 h-5 accent-green-500"
              />
            </label>
          ))}

          {/* Add new category dashed box */}
          <Link href="/dashboard/expenses/category" className="block mt-4">
            <div className="border-2 border-dashed border-gray-300 rounded-xl py-5 text-center text-gray-500">
              Add new category
            </div>
          </Link>
        </div>

        {/* Notes */}
        <div className="pt-4">
          <label className="text-sm text-gray-600 mb-2 block">Notes (optional)</label>
          <textarea
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add a note"
            className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-black"
            rows={3}
          />
        </div>

        {/* Errors */}
        <div aria-live="polite" className="text-sm text-red-600">
          {state?.errors?.message && <div>{state.errors.message}</div>}
        </div>

        {/* Footer ACTIONS */}
        <div className="flex justify-end gap-4 mt-6 mb-10">
          <Link href="/dashboard/expenses" className="h-10 px-4 rounded-lg bg-gray-100 text-gray-700 flex items-center">
            Cancel
          </Link>

          <button
            type="submit"
            disabled={pending}
            className="h-10 px-4 rounded-lg bg-green-500 text-white flex items-center"
          >
            {pending ? "Adding..." : "Add Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
