
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderFormData } from "@/utils/orderUtils";

interface DessertDrinkFieldsProps {
  formData: OrderFormData;
  onFormChange: (update: Partial<OrderFormData>) => void;
  availableDesserts: Array<{ name: string; remaining_stock: number }>;
  showDrink?: boolean;
}

const DessertDrinkFields = ({ formData, onFormChange, availableDesserts, showDrink = true }: DessertDrinkFieldsProps) => {
  const handleDessertChange = (value: string) => {
    // Convert "none" back to empty string for the form data
    const dessertValue = value === "none" ? "" : value;
    onFormChange({ dessert: dessertValue });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="dessert">Dessert (Optional)</Label>
        <Select
          value={formData.dessert || "none"}
          onValueChange={handleDessertChange}
        >
          <SelectTrigger className="border-green-200 focus:border-green-400">
            <SelectValue placeholder="Select a dessert" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No dessert</SelectItem>
            {availableDesserts.map(dessert => (
              <SelectItem key={dessert.name} value={dessert.name}>
                {dessert.name} ({dessert.remaining_stock} left)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {showDrink && (
        <div className="space-y-2">
          <Label htmlFor="drink">Drink (Optional)</Label>
          <Input
            id="drink"
            value={formData.drink}
            onChange={(e) => onFormChange({ drink: e.target.value })}
            placeholder="e.g., Tea, Coffee, Water"
            className="border-green-200 focus:border-green-400"
          />
        </div>
      )}
    </div>
  );
};

export default DessertDrinkFields;
