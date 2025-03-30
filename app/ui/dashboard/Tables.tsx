"use client";
import { formatDateToLocal, formatCurrency } from "@/lib/utils";
import { deleteSpendingAction, deleteIncomeAction } from "@/lib/actions";
import { useState } from "react";

const handleDelete = async(id:number)=>{
  try{
    await deleteSpendingAction(id);
    console.log('Successfully deleted')
  }catch(error){
    console.log('Failed to delete', error)
  }
}



type income = {
  id: number;
  userId: number;
  date: string;
  source: string;
  amount: string;
  type: string;
};

type spending = {
  id: number;
  date: string;
  categoryName: string;
  itemName: string;
  amount: string;
  notes: string | null;
};

type saving = {
  id: number;
  date: string;
  amount: string;
  savingsGoals: string;
};

type SpendingTableProps = {
  data: spending[];
};

type IncomeTableProps = {
  data: income[];
};

type SavingTableProps = {
  data: saving[];
};

export const SpendingTableComponent = ({ data }: SpendingTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
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

export const IncomeTableComponent = ({ data }: IncomeTableProps) => {
  const [pendingRows, setPendingRows] = useState<{ [key: number]: boolean }>({});

  const deleteIncome = async (id: number) => {
    setPendingRows((prev) => ({ ...prev, [id]: true }));
    try {
      await deleteIncomeAction(id);
      console.log("Successfully deleted");
    } catch (error) {
      console.log("Failed to delete", error);
    } finally {
      setPendingRows((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Source</th>
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
                {item.source}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {formatCurrency(Number(item.amount))}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button onClick={()=>deleteIncome(item.id)}>
                {pendingRows[item.id] ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const SavingsTableComponent = ({ data }: SavingTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Amount</th>
            <th className="border border-gray-300 px-4 py-2">
              Saving Category
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="even:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">
                {formatDateToLocal(item.date)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {formatCurrency(Number(item.amount))}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.savingsGoals}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
