
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const DessertManager = () => {
  const [dessertInventory, setDessertInventory] = useLocalStorage("dessertInventory", [
    { name: "Chocolate Cake", startingStock: 10, remainingStock: 10, active: true },
    { name: "Apple Pie", startingStock: 8, remainingStock: 8, active: true },
    { name: "Ice Cream", startingStock: 15, remainingStock: 15, active: true },
    { name: "Fruit Salad", startingStock: 12, remainingStock: 12, active: true },
  ]);

  const [newDessert, setNewDessert] = useState({ name: "", startingStock: "" });

  const updateDessert = (index: number, field: string, value: any) => {
    const updated = dessertInventory.map((dessert, i) =>
      i === index ? { ...dessert, [field]: value } : dessert
    );
    setDessertInventory(updated);
  };

  const addDessert = () => {
    if (!newDessert.name || !newDessert.startingStock) {
      toast({
        title: "Missing Information",
        description: "Please fill in dessert name and starting stock.",
        variant: "destructive"
      });
      return;
    }

    const stock = parseInt(newDessert.startingStock);
    const dessert = {
      name: newDessert.name,
      startingStock: stock,
      remainingStock: stock,
      active: true
    };

    setDessertInventory([...dessertInventory, dessert]);
    setNewDessert({ name: "", startingStock: "" });
    
    toast({
      title: "Dessert Added",
      description: `${newDessert.name} has been added to the inventory.`,
    });
  };

  const resetAllStock = () => {
    const updated = dessertInventory.map(dessert => ({
      ...dessert,
      remainingStock: dessert.startingStock
    }));
    setDessertInventory(updated);
    
    toast({
      title: "Stock Reset",
      description: "All dessert stock has been reset to starting values.",
    });
  };

  const deleteDessert = (index: number) => {
    const updated = dessertInventory.filter((_, i) => i !== index);
    setDessertInventory(updated);
    
    toast({
      title: "Dessert Removed",
      description: "Dessert has been removed from inventory.",
    });
  };

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
          <Button onClick={addDessert} className="bg-amber-600 hover:bg-amber-700">
            Add Dessert
          </Button>
        </div>
      </Card>

      {/* Dessert Inventory */}
      <div className="grid gap-4">
        {dessertInventory.map((dessert, index) => (
          <Card key={index} className="p-4 border-green-100">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-lg">{dessert.name}</h3>
                  <Badge 
                    variant={dessert.remainingStock > 0 ? "default" : "destructive"}
                    className={dessert.remainingStock > 0 ? "bg-green-100 text-green-800" : ""}
                  >
                    {dessert.remainingStock} / {dessert.startingStock}
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
                      value={dessert.startingStock}
                      onChange={(e) => updateDessert(index, "startingStock", parseInt(e.target.value) || 0)}
                      className="h-8 border-green-200"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs">Remaining Stock</Label>
                    <Input
                      type="number"
                      value={dessert.remainingStock}
                      onChange={(e) => updateDessert(index, "remainingStock", parseInt(e.target.value) || 0)}
                      className="h-8 border-green-200"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs">Active</Label>
                    <div className="flex items-center h-8">
                      <Switch
                        checked={dessert.active}
                        onCheckedChange={(checked) => updateDessert(index, "active", checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateDessert(index, "remainingStock", dessert.startingStock)}
                  className="text-green-600 border-green-300 hover:bg-green-50"
                >
                  Reset
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteDessert(index)}
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
