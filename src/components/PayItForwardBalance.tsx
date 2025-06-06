
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Heart, PoundSterling } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PayItForwardBalanceData {
  current_balance: number;
  total_donations: number;
  total_used: number;
}

const PayItForwardBalance = () => {
  const [balance, setBalance] = useState<PayItForwardBalanceData | null>(null);

  const fetchBalance = async () => {
    const { data, error } = await supabase
      .from('pay_it_forward_balance')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching balance:', error);
      return;
    }
    
    setBalance(data);
  };

  useEffect(() => {
    fetchBalance();
    
    // Set up real-time subscription for balance updates
    const channel = supabase
      .channel('pay-it-forward-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'pay_it_forward_donations' }, 
        () => fetchBalance()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'pay_it_forward_usage' }, 
        () => fetchBalance()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!balance) {
    return null;
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-pink-50 to-rose-100 border-pink-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-pink-800">Pay It Forward Fund</h3>
            <p className="text-sm text-pink-600">Available to help others</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-pink-700 flex items-center">
            <PoundSterling className="w-5 h-5 mr-1" />
            {balance.current_balance.toFixed(2)}
          </div>
          <p className="text-xs text-pink-600">
            {balance.total_donations.toFixed(2)} donated - {balance.total_used.toFixed(2)} used
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PayItForwardBalance;
