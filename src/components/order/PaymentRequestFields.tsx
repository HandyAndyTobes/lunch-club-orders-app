
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OrderFormData } from "@/utils/orderUtils";

interface PaymentRequestFieldsProps {
  formData: OrderFormData;
  onFormChange: (update: Partial<OrderFormData>) => void;
}

const PaymentRequestFields = ({ formData, onFormChange }: PaymentRequestFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="paidAmount">Amount Paid (£)</Label>
        <Input
          id="paidAmount"
          type="number"
          step="0.01"
          value={formData.paidAmount}
          onChange={(e) => onFormChange({ paidAmount: e.target.value })}
          placeholder="0.00"
          className="border-green-200 focus:border-green-400"
        />
      </div>

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
    </>
  );
};

export default PaymentRequestFields;
