
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, PoundSterling } from "lucide-react";
import { OrderFormData } from "@/utils/orderUtils";
import { supabase } from "@/integrations/supabase/client";

interface PayItForwardFieldProps {
  formData: OrderFormData;
  onFormChange: (update: Partial<OrderFormData>) => void;
}

interface PayItForwardBalance {
  current_balance: number;
}

const PayItForwardField = ({ formData, onFormChange }: PayItForwardFieldProps) => {
  const [balance, setBalance] = useState<PayItForwardBalance | null>(null);
  const [usePayItForward, setUsePayItForward] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      const { data, error } = await supabase
        .from('pay_it_forward_balance')
        .select('current_balance')
        .single();
      
      if (error) {
        console.error('Error fetching balance:', error);
        return;
      }
      
      setBalance(data);
    };

    fetchBalance();
  }, []);

  const handleUsePayItForwardChange = (checked: boolean) => {
    setUsePayItForward(checked);
    if (checked) {
      onFormChange({ payItForwardAmount: "7", paidAmount: "7" });
    } else {
      onFormChange({ payItForwardAmount: "", paidAmount: "" });
    }
  };

  if (!balance || balance.current_balance <= 0) {
    return null;
  }

  return (
    <div className="space-y-3 p-4 bg-pink-50 rounded-lg border border-pink-200">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="usePayItForward"
          checked={usePayItForward}
          onCheckedChange={handleUsePayItForwardChange}
        />
        <Label htmlFor="usePayItForward" className="flex items-center space-x-2">
          <Heart className="w-4 h-4 text-pink-600" />
          <span>Use Pay It Forward Fund</span>
        </Label>
      </div>
      
      <div className="text-sm text-pink-700 flex items-center">
        <PoundSterling className="w-4 h-4 mr-1" />
        {balance.current_balance.toFixed(2)} available
      </div>

      {usePayItForward && (
        <div className="text-sm text-pink-700">£7 will be applied from the fund</div>
      )}
    </div>
  );
};

export default PayItForwardField;
