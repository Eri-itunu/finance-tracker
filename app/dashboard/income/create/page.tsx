
import Form from "@/app/ui/income/income-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/");
  const userId = session?.user?.id;

  return <main>{userId ? <Form userId={userId} /> : "no user logged in"}</main>;
}
