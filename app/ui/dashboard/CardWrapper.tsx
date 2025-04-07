import {Card} from "@/app/ui/dashboard/Card";
import { fetchCardData } from "@/lib/data";

export default async function CardWrapper() {
  const { totalSpend, totalIncome, totalSavings } = await fetchCardData();

  return (
    <>
      <Card title="Income documented" value={totalIncome} type="invoices" />
      <Card title="Expenses documented" value={totalSpend} type="collected" />
      <Card title="Savings documented" value={totalSavings} type="pending" />
    </>
  );
}
