
import { fetchSavings } from "@/app/lib/data"
import { SavingsTableComponent } from "@/app/ui/dashboard/Tables";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Categories(){
    const session = await auth();
    if(!session) redirect('/')
    const res = await fetchSavings();
    return(
        <div>
            <div>
                <h1 className="text-2xl font-bold">Spend</h1>
            </div>
           < SavingsTableComponent data={res} />
        </div>
    )
}