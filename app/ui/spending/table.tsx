"use client";
import { formatDateToLocal, formatCurrency } from "@/lib/utils";
import { deleteSpendingAction } from "@/lib/actions";


const handleDelete = async(id:number)=>{
  try{
    await deleteSpendingAction(id);
    console.log('Successfully deleted')
  }catch(error){
    console.log('Failed to delete', error)
  }
}


type SpendingTableProps = {
    data: spending[];
  };
  type spending = {
    id: number;
    date: string;
    categoryName: string;
    itemName: string;
    amount: string;
    notes: string | null;
  };

export const SpendingTableComponent = ({ data }: SpendingTableProps) => {
    return (
      <div className="overflow-x-auto rounded-md">

        <table className="table-auto rounded-md border-collapse border border-gray-300 w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Item Name</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="even:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  {formatDateToLocal(item.date)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.itemName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.categoryName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {formatCurrency(Number(item.amount))}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button onClick={()=>handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };