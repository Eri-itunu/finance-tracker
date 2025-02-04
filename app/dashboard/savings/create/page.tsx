
import { fetchSavingsGoals } from "@/app/lib/data";
import Form from "@/app/ui/savings/savings-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";



export default async function Page() {
  const savingsGoals = await fetchSavingsGoals();
  const session = await auth();
  const userId = session?.user?.id
  if(!session) redirect('/')
  return (
    <main>
   
      {userId ? <Form savings={savingsGoals} userId={userId} /> : "no user logged in"}
    </main>
  );
}