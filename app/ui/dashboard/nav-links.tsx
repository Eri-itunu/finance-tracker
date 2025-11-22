"use client";
import {
BanknotesIcon,
ChartPieIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { BarChart } from "lucide-react";
import {HomeModernIcon} from "@heroicons/react/24/outline";
import { HomeIcon } from '@heroicons/react/24/solid';
const links = [
// { name: "Home", href: "/dashboard", icon: HomeIcon },
{ name: "Expenses", href: "/dashboard/expenses", icon: HomeIcon },
// { name: "AI", href: "/dashboard/ai", icon: ChartPieIcon },
{ name: "Savings", href: "/dashboard/savings", icon: BarChart },
{ name: "Income", href: "/dashboard/income", icon: BanknotesIcon },
];


export function NavLinks() {
  const pathname = usePathname();


  return (
    <div className="flex w-3/4 gap-4 justify-between ">
      {links.map((link) => {
      const Icon = link.icon;
      const active = pathname === link.href;


      return (
        <Link
        key={link.name}
        href={link.href}
        className="flex flex-col items-center justify-center w-12"
        >
          <Icon
            className={clsx(
              "w-8 h-8 transition-colors fill-current", 
              {
                "text-purple-700": active,
                "text-gray-500": !active
              }
            )}
          />
        </Link>
        );
      })}
    </div>
  );
}