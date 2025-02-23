"use client"

import { DonutChart } from "@/app/ui/charts/DonutChart"


type saving = {
  id: number;
  date: string;
  amount: string;
  savingsGoals: string;
};

type SavingChartProps = {
  data: saving[];
};
export const DonutChartLabelExample = ({ data }: SavingChartProps) => {
  const formattedData = data.map((item) => ({
    ...item,
    amount: Number(item.amount), // Convert amount to number
  }));

  return (
    <DonutChart
      className="mx-auto"
      data={formattedData}
      category="savingsGoals"
      value="amount"
      showLabel={true}
      valueFormatter={(number: number) =>
        `$${Intl.NumberFormat("us").format(number).toString()}`
      }
    />
  );
};
