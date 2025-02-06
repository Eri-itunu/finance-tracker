'use client'

import Link from "next/link";
import {
   FolderIcon
} from "@heroicons/react/24/outline";
import { useActionState } from 'react'
import { fetchCategories } from "@/app/lib/data";
import { createCategory, State  } from "@/app/lib/actions";

type categoriesField ={
    id: number;
    userId: number | null;
    categoryName: string;
}

export default  function Create({ categories, userId }: { categories: categoriesField[], userId:string }){
    const initialState: State = { message: '', errors: {} };
    // const [state, formAction] = useActionState(createCategory, State);
     const [errorMessage, formAction, isPending] = useActionState(createCategory, undefined);
    
    //const categories = await fetchCategories();
    return(
        <>  
            <form action={formAction}  className="w-full  mx-auto">    
                <div className="rounded-md bg-gray-50 p-4 md:p-6">
                    {/* Category Name */}
                    <input type="hidden" name="userId" value={userId} />
                    <div className="mb-4">
                    <label htmlFor="category" className="mb-2 block text-sm font-medium">
                        These are the current categories available to you
                    </label>
                   
                    <ul className="list-disc pl-5" >
                        {categories.map((category) => (
                            <li key={category.id}>{category.categoryName}</li>
                        ))}
                    </ul>

                       
                    
                    </div>

                    {/* Spending Amount */}
                    <div className="mb-4">
                        <label htmlFor="category" className="mb-2 block text-sm font-medium">
                            Category
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                                <input
                                    id="category"
                                    name="category"
                                    placeholder="Enter New Category"
                                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                />
                                <FolderIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                
                            </div>
                            <div id="amount-error" aria-live="polite" aria-atomic="true">
                                {errorMessage?.errors?.category &&
                                errorMessage?.errors.category.map((error: string) => (
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
                    href="/dashboard/expenses"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                    Cancel
                    </Link>
                    <button aria-disabled={isPending} type="submit">
                        
                        {isPending ? "Adding Category..." : " Add New Category"}
                    </button>
                </div>
            </form>
        </>
    )
}