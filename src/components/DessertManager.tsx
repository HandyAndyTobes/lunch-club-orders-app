
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useDessertInventory } from "@/hooks/useSupabaseData";

const DessertManager = () => {
  const { desserts, updateDessert, addDessert, deleteDessert, loading } = useDessertInventory();
  const [newDessert, setNewDessert] = useState({ name: "", startingStock: "" });

  const handleUpdateDessert = async (id: string, field: string, value: any) => {
    try {
      await updateDessert(id, { [field]: value });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleAddDessert = async () => {
    if (!newDessert.name || !newDessert.startingStock) {
      toast({
        title: "Missing Information",
        description: "Please fill in dessert name and starting stock.",
        variant: "destructive"
      });
      return;
    }

    const stock = parseInt(newDessert.startingStock);
    try {
      await addDessert({
        name: newDessert.name,
        starting_stock: stock,
        remaining_stock: stock,
        active: true
      });

      setNewDessert({ name: "", startingStock: "" });
      
      toast({
        title: "Dessert Added",
        description: `${newDessert.name} has been added to the inventory.`,
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const resetAllStock = async () => {
    try {
      for (const dessert of desserts) {
        await updateDessert(dessert.id, {
          remaining_stock: dessert.starting_stock
        });
      }
      
      toast({
        title: "Stock Reset",
        description: "All dessert stock has been reset to starting values.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset stock. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDessert = async (id: string) => {
    try {
      await deleteDessert(id);
      
      toast({
        title: "Dessert Removed",
        description: "Dessert has been removed from inventory.",
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-amber-600 rounded flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Dessert Stock Manager</h2>
        </div>
        <Card className="p-8 text-center">
          <div className="text-gray-500">Loading dessert inventory...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-amber-600 rounded flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Dessert Stock Manager</h2>
        </div>
        <Button onClick={resetAllStock} variant="outline" className="flex items-center space-x-2">
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Stock</span>
        </Button>
      </div>

      {/* Add New Dessert */}
      <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <h3 className="font-semibold text-amber-900 mb-3 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add New Dessert
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Dessert name"
            value={newDessert.name}
            onChange={(e) => setNewDessert(prev => ({ ...prev, name: e.target.value }))}
            className="border-amber-300 focus:border-amber-500"
          />
          <Input
            type="number"
            placeholder="Starting stock"
            value={newDessert.startingStock}
            onChange={(e) => setNewDessert(prev => ({ ...prev, startingStock: e.target.value }))}
            className="border-amber-300 focus:border-amber-500"
          />
          <Button onClick={handleAddDessert} className="bg-amber-600 hover:bg-amber-700">
            Add Dessert
          </Button>
        </div>
      </Card>

      {/* Dessert Inventory */}
      <div className="grid gap-4">
        {desserts.map((dessert) => (
          <Card key={dessert.id} className="p-4 border-green-100">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-lg">{dessert.name}</h3>
                  <Badge 
                    variant={dessert.remaining_stock > 0 ? "default" : "destructive"}
                    className={dessert.remaining_stock > 0 ? "bg-green-100 text-green-800" : ""}
                  >
                    {dessert.remaining_stock} / {dessert.starting_stock}
                  </Badge>
                  {!dessert.active && (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Starting Stock</Label>
                    <Input
                      type="number"
                      value={dessert.starting_stock}
                      onChange={(e) => handleUpdateDessert(dessert.id, "starting_stock", parseInt(e.target.value) || 0)}
                      className="h-8 border-green-200"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs">Remaining Stock</Label>
                    <Input
                      type="number"
                      value={dessert.remaining_stock}
                      onChange={(e) => handleUpdateDessert(dessert.id, "remaining_stock", parseInt(e.target.value) || 0)}
                      className="h-8 border-green-200"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs">Active</Label>
                    <div className="flex items-center h-8">
                      <Switch
                        checked={dessert.active}
                        onCheckedChange={(checked) => handleUpdateDessert(dessert.id, "active", checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateDessert(dessert.id, "remaining_stock", dessert.starting_stock)}
                  className="text-green-600 border-green-300 hover:bg-green-50"
                >
                  Reset
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteDessert(dessert.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DessertManager;
