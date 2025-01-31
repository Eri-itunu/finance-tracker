import { fetchCategories } from "@/app/lib/data";
import Form from "@/app/ui/spending/spend-form";


export default async function Page() {
  const categories = await fetchCategories();
 
  return (
    <main>
   
      <Form categories={categories} />
    </main>
  );
}