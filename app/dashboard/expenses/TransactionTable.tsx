"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { deleteSpendingAction } from "@/lib/actions";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";

type SpendingItem = {
  id: number;
  itemName: string;
  category?: string;
  amount: number;
  notes?: string | null;
};

type SpendingGroup = {
  date: string;
  items: SpendingItem[];
};

interface TransactionsTableProps {
  data: SpendingGroup[];
}

export default function TransactionsTable({ data }: TransactionsTableProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
    function formatShort(dateString: string) {
        const date = new Date(dateString);
        const formatted = date.toLocaleDateString("en-US", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
  const handleDelete = async (id: number) => {
    try {
      setLoadingId(id);
      await deleteSpendingAction(id);
      console.log("Successfully deleted");
      setLoadingId(null);
      // Optionally: trigger a refetch of the data here
    } catch (error) {
      console.log("Failed to delete", error);
      setLoadingId(null);
    }
  };

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen} > 
        <DrawerTrigger className="w-full flex items-center justify-center px-4" ><div className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl text-center font-medium mt-2"> Show All Transactions</div></DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>All Transactions</DrawerTitle>
          </DrawerHeader>
          <div className="space-y-6 px-4 my-12 w-full h-[70vh] overflow-scroll">
            {data.map((group) => (
              <Card key={group.date} className="space-y-2 border pt-4 rounded-lg ">
                <h2 className="text-gray-700 font-medium text-center ">{formatShort(group.date)}</h2>

                <div className="space-y-3">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 flex items-center justify-between "
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{item.itemName}</span>
                        <span className="text-sm text-gray-500">{item.category ?? "Uncategorized"}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-gray-900">₦{item.amount.toLocaleString()}</span>

                        <Dialog>
                          <DialogTrigger>
                            <Trash2 className="h-5 w-5 text-red-500 cursor-pointer" />
                          </DialogTrigger>
                          <DialogContent className="rounded-2xl p-6">
                            <DialogHeader>
                              <DialogTitle>Delete transaction?</DialogTitle>
                            </DialogHeader>
                            <p className="text-sm text-gray-600">This action cannot be undone.</p>
                            <DialogFooter className="flex gap-2">
                              <Button variant="outline">Cancel</Button>
                              <Button
                                onClick={() => handleDelete(item.id)}
                                disabled={loadingId === item.id}
                                className="bg-red-500 text-white hover:bg-red-600"
                              >
                                {loadingId === item.id ? "Deleting..." : "Delete"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          <DrawerFooter>
            
            <DrawerClose>
              {/* <Button variant="outline">Cancel</Button> */}
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      
    </>
  );
}
