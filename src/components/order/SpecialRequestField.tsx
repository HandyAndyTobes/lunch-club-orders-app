import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OrderFormData } from "@/utils/orderUtils";

interface SpecialRequestFieldProps {
  formData: OrderFormData;
  onFormChange: (update: Partial<OrderFormData>) => void;
}

const SpecialRequestField = ({ formData, onFormChange }: SpecialRequestFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="specialRequest">Special Requests</Label>
      <Textarea
        id="specialRequest"
        value={formData.specialRequest}
        onChange={(e) => onFormChange({ specialRequest: e.target.value })}
        placeholder="Any special dietary requirements or requests..."
        className="border-green-200 focus:border-green-400"
        rows={3}
      />
    </div>
  );
};

export default SpecialRequestField;
