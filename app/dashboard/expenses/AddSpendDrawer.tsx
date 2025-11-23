"use client";

import { useEffect, useState } from "react";
import { X, Delete } from "lucide-react";
import clsx from "clsx";

export default function AddSpendDrawer({
  open,
  onClose,
  onContinue,
}: {
  open: boolean;
  onClose: () => void;
  onContinue: (amount: string) => void;
}) {
  const [amount, setAmount] = useState("0");

  const handlePress = (val: string) => {
    if (val === "back") {
      if (amount.length === 1) return setAmount("0");
      return setAmount(amount.slice(0, -1));
    }

    if (amount === "0") setAmount(val);
    else setAmount(amount + val);
  };

  const formatted = `₦${Number(amount).toLocaleString("en-NG")}`;

  const keys = ["1","2","3","4","5","6","7","8","9",".","0","back"];

  // prevent background scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={clsx(
          "fixed inset-0 bg-black/40 transition-opacity duration-200 z-40",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Drawer */}
      <div
        className={clsx(
          "fixed left-0 right-0 bottom-0 bg-white z-50 rounded-t-3xl shadow-xl transition-transform duration-300",
          "px-6 pt-10 pb-28", // extra bottom padding for your bottom tab
          open ? "translate-y-0" : "translate-y-full"
        )}
        style={{ height: "90vh" }}
      >
        {/* Close button */}
        <button onClick={onClose} className="absolute top-6 right-6">
          <X size={38} strokeWidth={1.5} />
        </button>

        {/* Amount Preview */}
        <div className="w-full text-center mt-12">
          <p className="text-5xl font-bold text-green-500">{formatted}</p>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-y-6 mt-16 text-center text-3xl font-medium select-none">
          {keys.map((k, i) => (
            <button
              key={i}
              onClick={() => handlePress(k)}
              className="py-4 active:scale-95 transition"
            >
              {k === "back" ? (
                <Delete size={32} strokeWidth={1.5} className="mx-auto" />
              ) : (
                k
              )}
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={() => onContinue(amount)}
          className="fixed bottom-6 left-6 right-6 bg-green-500 text-white py-4 rounded-full text-lg font-semibold active:scale-[0.98] transition"
        >
          Continue
        </button>
      </div>
    </>
  );
}
