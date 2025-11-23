import { fetchCategories } from "@/lib/data";
import Form from "@/app/ui/spending/spend-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    amount?: string;
    page?: string;
    startDate?: string;
    endDate?: string;
    category?: string;
  };
}) {
  const session = await auth();
  if (!session) redirect("/");

  const userId = session?.user?.id;
  const categories = await fetchCategories();
  const amount = searchParams?.amount || "0";

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
