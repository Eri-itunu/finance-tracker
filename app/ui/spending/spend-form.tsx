// app/spend/new/SpendFormClient.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";
import { createSpending } from "@/lib/actions";
import { useActionState } from "react";

type Category = {
  id: number;
  userId: number | null;
  categoryName: string;
};

type Props = {
  categories: Category[];
  userId: string;
  amount: string;
};

export default function SpendFormClient({ categories, userId, amount }: Props) {
  const router = useRouter();

  const initialState = { message: "", errors: {} } as any;
  const [state, formAction, pending] = useActionState(createSpending, initialState);

  const [itemName, setItemName] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  const formattedAmount = useMemo(() => {
    const n = Number(amount || "0");
    return `NGN ${n.toLocaleString("en-NG")}.00`;
  }, [amount]);

  return (
    <div className="flex-1 overflow-y-auto pb-12  min-h-screen">
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
          disabled={pending}
          className="bg-green-500 text-white text-sm px-4 py-2 rounded-full disabled:opacity-50"
        >
          {pending ? "Adding..." : "Add"}
        </button>
      </header>

      {/* Form container */}
      <form id="spendForm" action={formAction} className="bg-white mt-2">
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="amount" value={amount} />

        <div className="px-4 pt-4">
          {/* For */}
          <div className="flex items-center justify-between py-4 border-b">
            <div className="text-sm text-gray-700 w-1/3">For</div>
            <div className="w-2/3 text-right">
              <input
                name="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="What did you spend on?"
                className="w-full text-right placeholder-gray-400 text-base border-none outline-none bg-transparent"
                required
              />
            </div>
          </div>

          {/* Category - Quick Select Dropdown */}
          <div className="flex items-center justify-between py-4 border-b">
            <div className="text-sm text-gray-700 w-1/3">Category</div>
            <div className="w-2/3 text-right">
              <select
                name="categoryIdSelect"
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full text-right border-none outline-none bg-transparent text-base"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
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
                className="w-full text-right border-none outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="flex items-center justify-between py-4 border-b">
            <div className="text-sm text-gray-700 w-1/3">Notes</div>
            <div className="w-2/3 text-right">
              <textarea
                name="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a note (optional)"
                className="w-full text-right border-none outline-none placeholder-gray-400 bg-transparent resize-none"
                rows={1}
              />
            </div>
          </div>
        </div>
      </form>

      {/* Categories Section - Visual Selection */}
      <div className="bg-white mt-2 px-4 pt-4 pb-6 hidden">
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-4">
          Select Category
        </div>

        <div className="space-y-2">
          {categories.map((c) => (
            <label
              key={c.id}
              className="flex items-center justify-between py-3 border-b cursor-pointer hover:bg-gray-50 -mx-4 px-4 rounded"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                  <span className="text-sm font-semibold">{c.categoryName.charAt(0)}</span>
                </div>
                <div className="text-sm font-medium">{c.categoryName}</div>
              </div>

              <input
                type="radio"
                name="categoryId"
                value={c.id}
                checked={Number(categoryId) === c.id}
                onChange={() => setCategoryId(c.id)}
                className="w-5 h-5 accent-green-500"
                form="spendForm"
              />
            </label>
          ))}

          {/* Add new category */}
          <Link href="/dashboard/expenses/category" className="block mt-4">
            <div className="border-2 border-dashed border-gray-300 rounded-xl py-5 text-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition">
              Add new category
            </div>
          </Link>
        </div>
      </div>

      {/* Errors */}
      {state?.errors?.message && (
        <div className="bg-white mt-2 px-4 py-4">
          <div aria-live="polite" className="text-sm text-red-600">
            {state.errors.message}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="bg-white mt-2 px-4 py-6">
        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/expenses"
            className="h-10 px-6 rounded-lg bg-gray-100 text-gray-700 flex items-center hover:bg-gray-200"
          >
            Cancel
          </Link>

          <button
            type="submit"
            form="spendForm"
            disabled={pending}
            className="h-10 px-6 rounded-lg bg-green-500 text-white flex items-center hover:bg-green-600 disabled:opacity-50"
          >
            {pending ? "Adding..." : "Add Expense"}
          </button>
        </div>
      </div>
    </div>
  );
}