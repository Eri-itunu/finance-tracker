import React from 'react'
import { auth } from "@/auth";
import { fetchSavingsGoals } from "@/lib/data";
import { redirect } from "next/navigation";
import Form from "@/app/ui/savings/goals-form";


export default async function page() {
  const session = await auth();
  if(!session) redirect('/')
  const userId = session?.user?.id
  const savingsGoals = await fetchSavingsGoals();
  return (
    <main>
      {userId ? (
        <Form savings={savingsGoals} userId={userId} />
      ) : (
        "no user logged in"
      )}
    </main>
  )
}
