
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { OrderFormData } from "@/utils/orderUtils";

interface SubItemsFieldProps {
  formData: OrderFormData;
  onFormChange: (update: Partial<OrderFormData>) => void;
  subItemOptions: string[];
}

const SubItemsField = ({ formData, onFormChange, subItemOptions }: SubItemsFieldProps) => {
  const handleSubItemChange = (item: string, checked: boolean) => {
    const updatedSubItems = checked 
      ? [...formData.subItems, item]
      : formData.subItems.filter(i => i !== item);
      
    onFormChange({ subItems: updatedSubItems });
  };

  return (
    <div className="space-y-3">
      <Label>Sub-Items (Optional)</Label>
      <div className="grid grid-cols-2 gap-3">
        {subItemOptions.map(item => (
          <div key={item} className="flex items-center space-x-2">
            <Checkbox
              id={item}
              checked={formData.subItems.includes(item)}
              onCheckedChange={(checked) => handleSubItemChange(item, checked as boolean)}
            />
            <Label htmlFor={item} className="text-sm font-normal">{item}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubItemsField;
