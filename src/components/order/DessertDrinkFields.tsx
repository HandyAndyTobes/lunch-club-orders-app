
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DessertItem, OrderFormData } from "@/utils/orderUtils";

interface DessertDrinkFieldsProps {
  formData: OrderFormData;
  onFormChange: (update: Partial<OrderFormData>) => void;
  availableDesserts: DessertItem[];
}

const DessertDrinkFields = ({ formData, onFormChange, availableDesserts }: DessertDrinkFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="dessert">Dessert</Label>
        <Select 
          value={formData.dessert} 
          onValueChange={(value) => onFormChange({ dessert: value })}
        >
          <SelectTrigger className="border-green-200 focus:border-green-400">
            <SelectValue placeholder="Select dessert" />
          </SelectTrigger>
          <SelectContent>
            {availableDesserts.map(dessert => (
              <SelectItem key={dessert.name} value={dessert.name}>
                {dessert.name} ({dessert.remainingStock} left)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="drink">Drink</Label>
        <Input
          id="drink"
          value={formData.drink}
          onChange={(e) => onFormChange({ drink: e.target.value })}
          placeholder="Tea, Coffee, Juice..."
          className="border-green-200 focus:border-green-400"
        />
      </div>
    </div>
  );
};

export default DessertDrinkFields;
