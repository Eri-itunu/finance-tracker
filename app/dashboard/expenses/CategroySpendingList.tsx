"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Card } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteSpendingAction } from "@/lib/actions";

export type CategorySummary = {
  categoryName: string;
  totalSpent: number;
};

export type SpendingItem = {
  id: number;
  itemName: string;
  amount: number;
  date: string;
  notes?: string | null;
};

interface Props {
  categorySpending: CategorySummary[];
  spending: any[];
}

export default function CategorySpendingList({ categorySpending, spending }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoadingSpending, setIsLoadingSpending] = useState(false);

  const handleOpenCategory = (cat: string) => {
    setActiveCategory(cat);
    setIsLoadingSpending(true);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", cat);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Simulate loading delay when category changes
  useEffect(() => {
    if (activeCategory) {
      setIsLoadingSpending(true);
      const timer = setTimeout(() => {
        setIsLoadingSpending(false);
      }, 2000); // 2 second delay

      return () => clearTimeout(timer);
    }
  }, [activeCategory]);

  const handleDelete = async (id: number) => {
    try {
      setLoadingId(id);
      await deleteSpendingAction(id);
      console.log("Successfully deleted");
      setLoadingId(null);
    } catch (error) {
      console.log("Failed to delete", error);
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {categorySpending?.length > 0 ? (
        categorySpending.map((item) => (
          <Drawer key={item.categoryName}>
            <DrawerTrigger
              onClick={() => handleOpenCategory(item.categoryName)}
              className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl shadow-sm border w-full text-left cursor-pointer hover:bg-gray-100 transition"
            >
              <p className="text-gray-700 font-medium">{item.categoryName}</p>
              <p className="text-gray-900 font-semibold">
                ₦{item.totalSpent.toLocaleString()}
              </p>
            </DrawerTrigger>

            <DrawerContent className="p-6">
              <DrawerHeader>
                <DrawerTitle>{item.categoryName} Spending</DrawerTitle>
              </DrawerHeader>

              {/* CATEGORY SPENDING LIST */}
              <div className="mt-4 space-y-3 h-[70vh] overflow-scroll">
                {isLoadingSpending && activeCategory === item.categoryName ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <p className="text-gray-500 text-sm">Loading spending records...</p>
                  </div>
                ) : activeCategory === item.categoryName && spending?.length > 0 ? (
                  spending.map((sp) => (
                    <Card
                      key={sp.id}
                      className="p-4 flex items-center justify-between rounded-xl shadow-sm border"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{sp.itemName}</p>
                        <p className="text-sm text-gray-500">{sp.date}</p>
                      </div>
                      <p className="font-semibold text-gray-900">₦{sp.amount.toLocaleString()}</p>
                    </Card>
                  ))
                ) : activeCategory === item.categoryName ? (
                  <p className="text-gray-500 text-center">No spending records found</p>
                ) : null}
              </div>
            </DrawerContent>
          </Drawer>
        ))
      ) : (
        <p className="text-center text-gray-500">No categories found</p>
      )}
    </div>
  );
}