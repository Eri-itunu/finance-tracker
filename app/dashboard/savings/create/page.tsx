import { fetchSavingsGoals } from "@/lib/data";
import Form from "@/app/ui/savings/savings-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const savingsGoals = await fetchSavingsGoals();
  const session = await auth();
  if (!session) redirect("/");
  const userId = session?.user?.id;

  return (
    <main>
      {userId ? (
        <Form savings={savingsGoals} userId={userId} />
      ) : (
        "no user logged in"
      )}
    </main>
  );
}
