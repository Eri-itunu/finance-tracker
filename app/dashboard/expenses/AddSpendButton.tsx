"use client";

import { useState } from "react";
import AddSpendDrawer from "./AddSpendDrawer";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddSpendButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 bg-purple-500 text-white p-4 rounded-full shadow-xl"
      >
        <Plus size={26} />
      </button>

      <AddSpendDrawer
        open={open}
        onClose={() => setOpen(false)}
        onContinue={(value) => {
          router.push(`expenses/create?amount=${value}`);
        }}
      />
    </>
  );
}
