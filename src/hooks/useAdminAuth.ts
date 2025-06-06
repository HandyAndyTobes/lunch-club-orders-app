
import { useLocalStorage } from "./useLocalStorage";

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>("isAdminAuthenticated", false);

  const login = (password: string) => {
    if (password === "your-secret-password") {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAuthenticated(false);

  return { isAuthenticated, login, logout };
};
