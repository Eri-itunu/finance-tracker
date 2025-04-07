'use client'
import {
    BanknotesIcon,
    ClockIcon,
    UserGroupIcon,
    InboxIcon,
    EyeIcon,
    EyeSlashIcon
  } from "@heroicons/react/24/outline";
import { useState } from "react";
export function Card({
    title,
    value,
    type,
  }: {
    title: string;
    value: number | string;
    type: "invoices" | "customers" | "pending" | "collected";
  }) {
    const iconMap = {
        collected: BanknotesIcon,
        customers: UserGroupIcon,
        pending: ClockIcon,
        invoices: InboxIcon,
    };
    const Icon = iconMap[type];
    const [showValues, setShowValues] = useState(false);
  
    return (
      <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
        <div className="flex items-center  justify-between p-4">
          {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
          <h3 className="ml-2 text-sm font-medium">{title}</h3>
          
          <button
            className="  text-black text-sm"
            onClick={() => setShowValues((prev) => !prev)}
            >
             {showValues ?  <EyeSlashIcon className="w-6"/>:<EyeIcon className="w-6" /> } 
            </button>
        </div>
        <p
          className={`
              truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
        >
          {showValues ? value.toLocaleString?.() ?? value : "•••••"}
        </p>
      </div>
    );
  }