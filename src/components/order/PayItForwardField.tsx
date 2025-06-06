
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [payItForwardAmount, setPayItForwardAmount] = useState("");

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
    if (!checked) {
      setPayItForwardAmount("");
      onFormChange({ payItForwardAmount: "" });
    }
  };

  const handleAmountChange = (value: string) => {
    setPayItForwardAmount(value);
    onFormChange({ payItForwardAmount: value });
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
        <div className="space-y-2">
          <Label htmlFor="payItForwardAmount">Amount to Use (£)</Label>
          <Input
            id="payItForwardAmount"
            type="number"
            step="0.01"
            max={balance.current_balance}
            value={payItForwardAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0.00"
            className="border-pink-200 focus:border-pink-400"
          />
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAmountChange((balance.current_balance / 2).toFixed(2))}
              className="border-pink-300 text-pink-700 hover:bg-pink-50"
            >
              Half (£{(balance.current_balance / 2).toFixed(2)})
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAmountChange(balance.current_balance.toFixed(2))}
              className="border-pink-300 text-pink-700 hover:bg-pink-50"
            >
              All (£{balance.current_balance.toFixed(2)})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayItForwardField;
