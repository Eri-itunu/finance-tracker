"use client";

import { DonutChart } from "@/app/ui/charts/DonutChart";
import { formatCurrency } from "@/lib/utils";
type spending = {
  totalAmount: number;
  categoryName: string;
};

type SpendingChartProps = {
  data: spending[];
};

export const DonutChartLabelExample = ({ data }: SpendingChartProps) => {
  const formattedData = data.map((item) => ({
    ...item,
    totalAmount: Number(item.totalAmount), // Convert amount to number
  }));

  return (
    <div className="flex flex-col md:flex-row items-center gap-5 border rounded shadow-md justify-center p-8">
      <DonutChart
        className="mx-auto"
        data={formattedData}
        category="categoryName"
        value="totalAmount"
        showLabel={true}
        valueFormatter={(number: number) =>
          `N${Intl.NumberFormat("us").format(number).toString()}`
        }
      />

      <div className=" ">
        <h1 className="text-2xl font-thin ">Category breakdown</h1>
        {formattedData.map((item, index) => (
          <p key={index}>
            <span className="font-bold">{item.categoryName}</span>:{" "}
            {formatCurrency(item.totalAmount)}
          </p>
        ))}

        <p className="font-bold mt-2">
          Total:{" "}
          {formatCurrency(
            formattedData.reduce((sum, item) => sum + item.totalAmount, 0)
          )}
        </p>
      </div>
    </div>
  );
};
