import { fetchCategories } from "@/lib/data";
import Form from "@/app/ui/spending/spend-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

type Props = {
 amount: string ;
};

export default async function Page({params}: {params: Promise<{ amount: string }>}) {
  const session = await auth();
  if (!session) redirect("/");

  const userId = session?.user?.id;
  const categories = await fetchCategories();
  const { amount } = await params;


  return (
    <main className="overflow-scroll w-full mb-10">
      {userId ? (
       <Form
        categories={categories}
        userId={userId}
        amount={amount}
      />
      ) : (
        "no user logged in"
      )}
    </main>
  );
}
