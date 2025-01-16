"use client"

import {DonutChart} from '@/app/ui/charts/DonutChart'

export default function Spending(){
    const chartdata = [
        {
          name: "SolarCells",
          amount: 4890,
        },
        {
          name: "Glass",
          amount: 2103,
        },
        {
          name: "JunctionBox",
          amount: 2050,
        },
        {
          name: "Adhesive",
          amount: 1300,
        },
        {
          name: "BackSheet",
          amount: 1100,
        },
        {
          name: "Frame",
          amount: 700,
        },
        {
          name: "Encapsulant",
          amount: 200,
        },
      ]
      
    return(
        <div>
            This is the spending page
            <DonutChart
                className="mx-auto"
                data={chartdata}
                category="name"
                value="amount"
                showLabel={true}
                valueFormatter={(number: number) =>
                `$${Intl.NumberFormat("us").format(number).toString()}`
                }
            />
        </div>
    )
}