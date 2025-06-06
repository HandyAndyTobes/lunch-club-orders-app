
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { OrderFormData } from "@/utils/orderUtils";

interface MealSelectionFieldProps {
  formData: OrderFormData;
  onFormChange: (update: Partial<OrderFormData>) => void;
  mealOptions: string[];
}

const MealSelectionField = ({ formData, onFormChange, mealOptions }: MealSelectionFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="mealChoice">Meal Choice *</Label>
      <Select 
        value={formData.mealChoice} 
        onValueChange={(value) => onFormChange({ mealChoice: value })}
      >
        <SelectTrigger className="border-green-200 focus:border-green-400">
          <SelectValue placeholder="Select a meal" />
        </SelectTrigger>
        <SelectContent>
          {mealOptions.map(meal => (
            <SelectItem key={meal} value={meal}>{meal}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MealSelectionField;
