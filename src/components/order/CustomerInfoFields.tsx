
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderFormData } from "@/utils/orderUtils";

interface CustomerInfoFieldsProps {
  formData: OrderFormData;
  onFormChange: (update: Partial<OrderFormData>) => void;
  mode?: "admin" | "public";
}

const CustomerInfoFields = ({ formData, onFormChange, mode = "admin" }: CustomerInfoFieldsProps) => {
  return (
    <div className={mode === "public" ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
      <div className="space-y-2">
        <Label htmlFor="customerName">Your Name *</Label>
        <Input
          id="customerName"
          value={formData.customerName}
          onChange={(e) => onFormChange({ customerName: e.target.value })}
          placeholder="Enter your name"
          className="border-green-200 focus:border-green-400"
        />
      </div>

      {mode === "admin" && (
        <div className="space-y-2">
          <Label htmlFor="tableNumber">Table Number</Label>
          <Input
            id="tableNumber"
            type="number"
            value={formData.tableNumber}
            onChange={(e) => onFormChange({ tableNumber: e.target.value })}
            placeholder="Table number"
            className="border-green-200 focus:border-green-400"
          />
        </div>
      )}
    </div>
  );
};

export default CustomerInfoFields;
