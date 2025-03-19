import { fetchCategories } from "@/lib/data";
import Form from "@/app/ui/spending/spend-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/");
  const userId = session?.user?.id;
  const categories = await fetchCategories();
  
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
