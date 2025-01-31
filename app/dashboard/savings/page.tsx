
import { fetchSavings } from "@/app/lib/data"
import { SavingsTableComponent } from "@/app/ui/dashboard/Tables";

export default async function Categories(){

    const res = await fetchSavings();
    return(
        <div>
           < SavingsTableComponent data={res} />
        </div>
    )
}