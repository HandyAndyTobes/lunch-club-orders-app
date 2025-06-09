import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  active?: "volunteer" | "admin" | "orders";
  onSignOut?: () => void;
}

const NavButtons = ({ active, onSignOut }: Props) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    if (onSignOut) onSignOut();
    navigate("/");
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={active === "volunteer" ? "default" : "outline"}
        size="sm"
        onClick={() => navigate("/")}
        className="text-xs"
      >
        Volunteer
      </Button>
      <Button
        variant={active === "orders" ? "default" : "outline"}
        size="sm"
        onClick={() => navigate("/orders")}
        className="text-xs"
      >
        Orders
      </Button>
      <Button
        variant={active === "admin" ? "default" : "outline"}
        size="sm"
        onClick={() => navigate("/admin")}
        className="text-xs"
      >
        Admin
      </Button>
      {user && (
        <Button variant="outline" size="sm" onClick={handleSignOut} className="text-xs">
          Sign Out
        </Button>
      )}
    </div>
  );
};

export default NavButtons;
