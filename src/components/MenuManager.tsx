
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "@/hooks/use-toast";

const MenuManager = () => {
  const [mealOptions, setMealOptions] = useLocalStorage<string[]>("mealOptions", [
    "Soup of the Day",
    "Ham & Cheese Panini", 
    "Roast Dinner",
    "Fish & Chips",
    "Jacket Potato",
    "Chicken Salad"
  ]);
  
  const [subItemOptions, setSubItemOptions] = useLocalStorage<string[]>("subItemOptions", [
    "Buttered Bread",
    "Side Salad", 
    "Chips",
    "Coleslaw",
    "Garlic Bread",
    "Extra Vegetables"
  ]);

  const [newMeal, setNewMeal] = useState("");
  const [newSubItem, setNewSubItem] = useState("");

  const handleAddMeal = () => {
    if (!newMeal.trim()) {
      toast({
        title: "Error",
        description: "Please enter a meal name",
        variant: "destructive"
      });
      return;
    }

    if (mealOptions.includes(newMeal.trim())) {
      toast({
        title: "Error",
        description: "This meal already exists",
        variant: "destructive"
      });
      return;
    }

    setMealOptions([...mealOptions, newMeal.trim()]);
    setNewMeal("");
    toast({
      title: "Success",
      description: "Meal added successfully"
    });
  };

  const handleRemoveMeal = (meal: string) => {
    setMealOptions(mealOptions.filter(m => m !== meal));
    toast({
      title: "Success",
      description: "Meal removed successfully"
    });
  };

  const handleAddSubItem = () => {
    if (!newSubItem.trim()) {
      toast({
        title: "Error",
        description: "Please enter an extra item name",
        variant: "destructive"
      });
      return;
    }

    if (subItemOptions.includes(newSubItem.trim())) {
      toast({
        title: "Error",
        description: "This extra item already exists",
        variant: "destructive"
      });
      return;
    }

    setSubItemOptions([...subItemOptions, newSubItem.trim()]);
    setNewSubItem("");
    toast({
      title: "Success",
      description: "Extra item added successfully"
    });
  };

  const handleRemoveSubItem = (subItem: string) => {
    setSubItemOptions(subItemOptions.filter(s => s !== subItem));
    toast({
      title: "Success",
      description: "Extra item removed successfully"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Menu Manager</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meal Options */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Meal Options</h3>
          
          <div className="flex items-center space-x-2 mb-4">
            <Input
              placeholder="Add new meal..."
              value={newMeal}
              onChange={(e) => setNewMeal(e.target.value)}
              className="border-green-200 focus:border-green-400"
            />
            <Button 
              onClick={handleAddMeal}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {mealOptions.map((meal, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="font-medium">{meal}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMeal(meal)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {mealOptions.length === 0 && (
              <div className="text-center p-4 text-gray-500">
                No meals added yet
              </div>
            )}
          </div>
        </Card>

        {/* Extra Options (Sub Items) */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Extra Options</h3>
          
          <div className="flex items-center space-x-2 mb-4">
            <Input
              placeholder="Add new extra item..."
              value={newSubItem}
              onChange={(e) => setNewSubItem(e.target.value)}
              className="border-green-200 focus:border-green-400"
            />
            <Button 
              onClick={handleAddSubItem}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {subItemOptions.map((subItem, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="font-medium">{subItem}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSubItem(subItem)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {subItemOptions.length === 0 && (
              <div className="text-center p-4 text-gray-500">
                No extra items added yet
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MenuManager;
