'use client'

import Link from "next/link";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useActionState } from 'react'
import { createIncomeEntry,  } from "@/app/lib/actions";
import { useState, useEffect, useRef } from "react";

type savingsGoals ={
    id: number;
    userId: number | null;
    source: string;
}
type State = {
    message: string;
    errors: {
        source?: string[];
        amount?: string[];
        
    };
}
export default  function Create({  userId }: {  userId:string }){
    const initialState: State = { message: '', errors: {} };
    const [state, formAction] = useActionState(createIncomeEntry, initialState);
    const [formattedAmount, setFormattedAmount] = useState("");
    const amountRef = useRef<HTMLInputElement>(null);

  // Function to format numbers with commas
  const formatNumberWithCommas = (value: string) => {
    let num = value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except decimal
    const parts = num.split(".");
    if (parts.length > 2) {
      num = parts[0] + "." + parts.slice(1).join("");
    }
    const [integer, decimal] = num.split(".");
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimal ? `${formattedInteger}.${decimal}` : formattedInteger;
  };

  // Handle manual input changes
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormattedAmount(formatNumberWithCommas(value));
  };

  // Detect autofill changes
  useEffect(() => {
    if (amountRef.current) {
      const value = amountRef.current.value;
      if (value) {
        setFormattedAmount(formatNumberWithCommas(value));
      }
    }
  }, []); // Runs once on mount

   
    return(
        <>  
            <form action={formAction}  className="w-full  mx-auto">    
                <div className="rounded-md bg-gray-50 p-4 md:p-6">
                    {/* savingsGoal Name */}
                    <input type="hidden" name="userId" value={userId} />
                    <div className="mb-4">
                    <label htmlFor="source" className="mb-2 block text-sm font-medium">
                        Income Source
                    </label>
                    <div className="relative">
                        <input
                            id="source"
                            name="source"
                            type="text" // Use text to prevent browser from overriding formatting
                            placeholder="Enter Income Source "
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        />
                        
                        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="source-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.source &&
                        state.errors?.source.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                            </p>
                        ))}
                    </div>
                    </div>

                    {/* Spending Amount */}
                    <div className="mb-4">
                        <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                            Enter income amount
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                                <input
                                    id="amount"
                                    name="amount"
                                    type="text"
                                    placeholder="Enter Naira amount"
                                    value={formattedAmount}
                                    ref={amountRef}
                                    onChange={handleAmountChange}
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

                   

                    
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <Link
                    href="/dashboard/income"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                    Cancel
                    </Link>
                    <button type="submit">Add Income</button>
                </div>
            </form>
        </>
    )
}