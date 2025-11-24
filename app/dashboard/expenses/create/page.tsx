import { fetchCategories } from "@/lib/data";
import Form from "@/app/ui/spending/spend-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    amount?: string;
    page?: string;
    startDate?: string;
    endDate?: string;
    category?: string;
  }>;
}) {
  const session = await auth();
  if (!session) redirect("/");

  // Await searchParams once at the top
  const params = await searchParams ?? {};
  const { amount, page, startDate, endDate, category } = params;

  const userId = session?.user?.id;
  const categories = await fetchCategories();
  const amountValue = amount || "0";

  return (
    <main className="w-full min-h-screen overflow-y-auto">
      {userId ? (
        <Form
          categories={categories}
          userId={userId}
          amount={amountValue}
        />
      ) : (
        <p className="text-center text-gray-500 mt-8">No user logged in</p>
      )}
    </main>
  );
}