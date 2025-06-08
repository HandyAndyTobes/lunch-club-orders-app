
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Order {
  id: string;
  customer_name: string;
  meal_choice: string;
  sub_items: string[];
  dessert: string | null;
  drink: string | null;
  special_request: string | null;
  table_number: string | null;
  paid_amount: number | null;
  pay_it_forward_amount: number | null;
  week: string;
  timestamp: string;
  created_at: string;
}

export interface DessertItem {
  id: string;
  name: string;
  starting_stock: number;
  remaining_stock: number;
  active: boolean;
}

export interface MealOption {
  id: string;
  name: string;
  active: boolean;
  sort_order: number;
}

export interface SubItemOption {
  id: string;
  name: string;
  active: boolean;
  sort_order: number;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;
      
      setOrders(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding order:', error);
      toast({
        title: "Error",
        description: "Failed to save order.",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, addOrder, refetch: fetchOrders };
};

export const useDessertInventory = () => {
  const [desserts, setDesserts] = useState<DessertItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDesserts = async () => {
    try {
      const { data, error } = await supabase
        .from('dessert_inventory')
        .select('*')
        .order('name');

      if (error) throw error;
      setDesserts(data || []);
    } catch (error) {
      console.error('Error fetching desserts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dessert inventory.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDessert = async (id: string, updates: Partial<DessertItem>) => {
    try {
      const { error } = await supabase
        .from('dessert_inventory')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      setDesserts(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    } catch (error) {
      console.error('Error updating dessert:', error);
      toast({
        title: "Error",
        description: "Failed to update dessert inventory.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const addDessert = async (dessert: Omit<DessertItem, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('dessert_inventory')
        .insert([dessert])
        .select()
        .single();

      if (error) throw error;
      
      setDesserts(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding dessert:', error);
      toast({
        title: "Error",
        description: "Failed to add dessert.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteDessert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dessert_inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setDesserts(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting dessert:', error);
      toast({
        title: "Error",
        description: "Failed to delete dessert.",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchDesserts();
  }, []);

  return { 
    desserts, 
    loading, 
    updateDessert, 
    addDessert, 
    deleteDessert, 
    refetch: fetchDesserts 
  };
};

export const useMealOptions = () => {
  const [mealOptions, setMealOptions] = useState<MealOption[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMealOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('meal_options')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setMealOptions(data || []);
    } catch (error) {
      console.error('Error fetching meal options:', error);
      toast({
        title: "Error",
        description: "Failed to fetch meal options.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addMealOption = async (name: string) => {
    try {
      const maxOrder = Math.max(...mealOptions.map(m => m.sort_order), 0);
      const { data, error } = await supabase
        .from('meal_options')
        .insert([{ name, sort_order: maxOrder + 1 }])
        .select()
        .single();

      if (error) throw error;
      
      setMealOptions(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding meal option:', error);
      toast({
        title: "Error",
        description: "Failed to add meal option.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteMealOption = async (id: string) => {
    try {
      const { error } = await supabase
        .from('meal_options')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMealOptions(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting meal option:', error);
      toast({
        title: "Error",
        description: "Failed to delete meal option.",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchMealOptions();
  }, []);

  return { mealOptions, loading, addMealOption, deleteMealOption, refetch: fetchMealOptions };
};

export const useSubItemOptions = () => {
  const [subItemOptions, setSubItemOptions] = useState<SubItemOption[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubItemOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('sub_item_options')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setSubItemOptions(data || []);
    } catch (error) {
      console.error('Error fetching sub item options:', error);
      toast({
        title: "Error",
        description: "Failed to fetch extra options.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addSubItemOption = async (name: string) => {
    try {
      const maxOrder = Math.max(...subItemOptions.map(s => s.sort_order), 0);
      const { data, error } = await supabase
        .from('sub_item_options')
        .insert([{ name, sort_order: maxOrder + 1 }])
        .select()
        .single();

      if (error) throw error;
      
      setSubItemOptions(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding sub item option:', error);
      toast({
        title: "Error",
        description: "Failed to add extra option.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteSubItemOption = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sub_item_options')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSubItemOptions(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting sub item option:', error);
      toast({
        title: "Error",
        description: "Failed to delete extra option.",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSubItemOptions();
  }, []);

  return { subItemOptions, loading, addSubItemOption, deleteSubItemOption, refetch: fetchSubItemOptions };
};
