import { useMemo } from "react";
import { useOrders } from "@/hooks/useSupabaseData";
import { getCurrentWeek, formatWeekDisplay } from "@/utils/weekUtils";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const PrintOrders = () => {
  const { orders, loading } = useOrders();
  const currentWeek = getCurrentWeek();

  const grouped = useMemo(() => {
    const weekOrders = orders.filter(o => o.week === currentWeek);
    weekOrders.sort((a, b) => {
      const aNum = a.table_number ? parseInt(a.table_number) : Infinity;
      const bNum = b.table_number ? parseInt(b.table_number) : Infinity;
      return aNum - bNum;
    });
    const groups: Record<string, typeof weekOrders> = {};
    weekOrders.forEach(o => {
      const key = o.table_number || "No Table";
      if (!groups[key]) groups[key] = [];
      groups[key].push(o);
    });
    return groups;
  }, [orders, currentWeek]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  const sortedTables = Object.keys(grouped).sort((a, b) => {
    const aNum = a === "No Table" ? Infinity : parseInt(a);
    const bNum = b === "No Table" ? Infinity : parseInt(b);
    return aNum - bNum;
  });

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold">Meal Orders - Week of {formatWeekDisplay(currentWeek)}</h1>
        <Button onClick={() => window.print()} variant="outline" className="space-x-2">
          <Printer className="w-4 h-4" />
          <span>Print</span>
        </Button>
      </div>

      {sortedTables.map(table => (
        <div key={table} className="space-y-2 break-inside-avoid">
          <h2 className="font-semibold text-lg">{table === "No Table" ? "No Table" : `Table ${table}`}</h2>
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">#</th>
                <th className="border p-2 text-left">Customer</th>
                <th className="border p-2 text-left">Meal</th>
                <th className="border p-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {grouped[table].map((o, idx) => (
                <tr key={o.id} className="break-inside-avoid">
                  <td className="border p-2 align-top">{idx + 1}</td>
                  <td className="border p-2 align-top">{o.customer_name}</td>
                  <td className="border p-2 align-top">{o.meal_choice}</td>
                  <td className="border p-2 align-top">
                    {[
                      ...o.sub_items,
                      o.dessert ? `Dessert: ${o.dessert}` : null,
                      o.drink ? `Drink: ${o.drink}` : null,
                      o.special_request ? `Special: ${o.special_request}` : null,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default PrintOrders;
