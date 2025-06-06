
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, Plus, Minus, PoundSterling } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PayItForwardBalance {
  current_balance: number;
  total_donations: number;
  total_used: number;
}

interface Donation {
  id: string;
  donor_name: string;
  amount: number;
  created_at: string;
  notes: string;
}

interface Usage {
  id: string;
  recipient_name: string;
  amount: number;
  created_at: string;
  notes: string;
  order_id: string;
}

const PayItForwardManager = () => {
  const [balance, setBalance] = useState<PayItForwardBalance | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [usage, setUsage] = useState<Usage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Donation form state
  const [donorName, setDonorName] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [donationNotes, setDonationNotes] = useState("");

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

  const fetchDonations = async () => {
    const { data, error } = await supabase
      .from('pay_it_forward_donations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching donations:', error);
      return;
    }
    
    setDonations(data || []);
  };

  const fetchUsage = async () => {
    const { data, error } = await supabase
      .from('pay_it_forward_usage')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching usage:', error);
      return;
    }
    
    setUsage(data || []);
  };

  useEffect(() => {
    fetchBalance();
    fetchDonations();
    fetchUsage();
  }, []);

  const handleDonation = async () => {
    if (!donorName || !donationAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in donor name and amount.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from('pay_it_forward_donations')
      .insert({
        donor_name: donorName,
        amount: parseFloat(donationAmount),
        notes: donationNotes
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to record donation.",
        variant: "destructive"
      });
      console.error('Error adding donation:', error);
    } else {
      toast({
        title: "Donation Recorded",
        description: `£${donationAmount} added to Pay It Forward fund.`,
      });
      
      // Reset form
      setDonorName("");
      setDonationAmount("");
      setDonationNotes("");
      
      // Refresh data
      fetchBalance();
      fetchDonations();
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-6 h-6 bg-pink-600 rounded flex items-center justify-center">
          <Heart className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Pay It Forward</h2>
      </div>

      {/* Current Balance Display */}
      <Card className="p-6 bg-gradient-to-r from-pink-50 to-rose-100 border-pink-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-pink-700 flex items-center justify-center">
              <PoundSterling className="w-6 h-6 mr-1" />
              {balance?.current_balance?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-pink-600">Available Balance</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-700 flex items-center justify-center">
              <Plus className="w-5 h-5 mr-1" />
              £{balance?.total_donations?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-green-600">Total Donated</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-700 flex items-center justify-center">
              <Minus className="w-5 h-5 mr-1" />
              £{balance?.total_used?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-blue-600">Total Used</div>
          </div>
        </div>
      </Card>

      {/* Add Donation Form */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-green-600" />
          Add Donation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="donorName">Donor Name *</Label>
            <Input
              id="donorName"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Enter donor name"
              className="border-green-200 focus:border-green-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="donationAmount">Amount (£) *</Label>
            <Input
              id="donationAmount"
              type="number"
              step="0.01"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="0.00"
              className="border-green-200 focus:border-green-400"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="donationNotes">Notes (Optional)</Label>
            <Textarea
              id="donationNotes"
              value={donationNotes}
              onChange={(e) => setDonationNotes(e.target.value)}
              placeholder="Any notes about the donation..."
              className="border-green-200 focus:border-green-400"
              rows={2}
            />
          </div>
        </div>
        <Button 
          onClick={handleDonation}
          disabled={isLoading}
          className="mt-4 bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Record Donation
        </Button>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-pink-600" />
            Recent Donations
          </h3>
          <div className="space-y-3">
            {donations.length > 0 ? (
              donations.map((donation) => (
                <div key={donation.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium">{donation.donor_name}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(donation.created_at).toLocaleDateString()}
                    </div>
                    {donation.notes && (
                      <div className="text-sm text-gray-500 mt-1">{donation.notes}</div>
                    )}
                  </div>
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    +£{donation.amount.toFixed(2)}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No donations yet</p>
            )}
          </div>
        </Card>

        {/* Recent Usage */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center">
            <Minus className="w-5 h-5 mr-2 text-blue-600" />
            Recent Usage
          </h3>
          <div className="space-y-3">
            {usage.length > 0 ? (
              usage.map((use) => (
                <div key={use.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium">{use.recipient_name}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(use.created_at).toLocaleDateString()}
                    </div>
                    {use.notes && (
                      <div className="text-sm text-gray-500 mt-1">{use.notes}</div>
                    )}
                  </div>
                  <Badge variant="outline" className="text-blue-700 border-blue-300">
                    -£{use.amount.toFixed(2)}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No usage yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PayItForwardManager;
