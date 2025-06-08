
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { useMealOptions, useSubItemOptions } from "@/hooks/useSupabaseData";
import { toast } from "@/hooks/use-toast";

const MenuManager = () => {
  const { mealOptions, addMealOption, deleteMealOption, loading: mealLoading } = useMealOptions();
  const { subItemOptions, addSubItemOption, deleteSubItemOption, loading: subItemLoading } = useSubItemOptions();

  const [newMeal, setNewMeal] = useState("");
  const [newSubItem, setNewSubItem] = useState("");

  const handleAddMeal = async () => {
    if (!newMeal.trim()) {
      toast({
        title: "Error",
        description: "Please enter a meal name",
        variant: "destructive"
      });
      return;
    }

    if (mealOptions.some(meal => meal.name === newMeal.trim())) {
      toast({
        title: "Error",
        description: "This meal already exists",
        variant: "destructive"
      });
      return;
    }

    try {
      await addMealOption(newMeal.trim());
      setNewMeal("");
      toast({
        title: "Success",
        description: "Meal added successfully"
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleRemoveMeal = async (id: string, name: string) => {
    try {
      await deleteMealOption(id);
      toast({
        title: "Success",
        description: "Meal removed successfully"
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleAddSubItem = async () => {
    if (!newSubItem.trim()) {
      toast({
        title: "Error",
        description: "Please enter an extra item name",
        variant: "destructive"
      });
      return;
    }

    if (subItemOptions.some(item => item.name === newSubItem.trim())) {
      toast({
        title: "Error",
        description: "This extra item already exists",
        variant: "destructive"
      });
      return;
    }

    try {
      await addSubItemOption(newSubItem.trim());
      setNewSubItem("");
      toast({
        title: "Success",
        description: "Extra item added successfully"
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleRemoveSubItem = async (id: string, name: string) => {
    try {
      await deleteSubItemOption(id);
      toast({
        title: "Success",
        description: "Extra item removed successfully"
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  if (mealLoading || subItemLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Menu Manager</h2>
        <Card className="p-8 text-center">
          <div className="text-gray-500">Loading menu options...</div>
        </Card>
      </div>
    );
  }

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
            {mealOptions.map((meal) => (
              <div key={meal.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="font-medium">{meal.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMeal(meal.id, meal.name)}
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
            {subItemOptions.map((subItem) => (
              <div key={subItem.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="font-medium">{subItem.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSubItem(subItem.id, subItem.name)}
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
