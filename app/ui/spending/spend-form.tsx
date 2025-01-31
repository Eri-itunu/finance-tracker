'use client'

import Link from "next/link";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useActionState } from 'react'
import { fetchCategories } from "@/app/lib/data";
import { createSpending, State } from "@/app/lib/actions";

type categoriesField ={
    id: number;
    userId: number | null;
    categoryName: string;
}
export default  function Create({ categories }: { categories: categoriesField[] }){
    const initialState: State = { message: null, errors: {} };
    const [state, formAction] = useActionState(createSpending, initialState);
    //const categories = await fetchCategories();
    return(
        <>  
            <form action={formAction}  className="w-full  mx-auto">    
                <div className="rounded-md bg-gray-50 p-4 md:p-6">
                    {/* Category Name */}
                    <div className="mb-4">
                    <label htmlFor="category" className="mb-2 block text-sm font-medium">
                        Choose a category
                    </label>
                    <div className="relative">
                        <select
                        id="category"
                        name="categoryId"
                        className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        defaultValue=""
                        aria-describedby="customer-error"
                        >
                        <option value="" disabled>
                            Select a categrory
                        </option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                            {category.categoryName}
                            </option>
                        ))}
                        </select>
                        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="category-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.categoryId &&
                        state.errors.categoryId.map((error: string) => (
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
                                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
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

                    <div className="mb-4">
                        <label htmlFor="itemName" className="mb-2 block text-sm font-medium">
                            Enter item name
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                                <input
                                    id="itemName"
                                    name="itemName"
                                    type="text"
                                    placeholder="Enter Item Name"
                                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                />
                                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                               
                            </div>
                            <div id="itemName-error" aria-live="polite" aria-atomic="true">
                                    {state.errors?.itemName &&
                                    state.errors.itemName.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                        </p>
                                    ))}
                                </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="notes" className="mb-2 block text-sm font-medium">
                            Add notes
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                                <input
                                    id="notes"
                                    name="notes"
                                    type="text"
                                    placeholder="Enter Additional Notes"
                                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                />
                                <div id="notes-error" aria-live="polite" aria-atomic="true">
                                    {state.errors?.notes &&
                                    state.errors.notes.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                        </p>
                                    ))}
                                </div>
                            
                            </div>
                        </div>
                    </div>

                    
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <Link
                    href="/dashboard/spending"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                    Cancel
                    </Link>
                    <button type="submit">Add Expense</button>
                </div>
            </form>
        </>
    )
}