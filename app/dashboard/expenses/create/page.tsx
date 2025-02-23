import { fetchCategories } from "@/lib/data";
import Form from "@/app/ui/spending/spend-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const categories = await fetchCategories();
  const session = await auth();
  const userId = session?.user?.id;
  if (!session) redirect("/");
  return (
    <main>
      {userId ? (
        <Form categories={categories} userId={userId} />
      ) : (
        "no user logged in"
      )}
    </main>
  );
}
