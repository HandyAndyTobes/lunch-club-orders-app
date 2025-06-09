
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Orders from "./pages/Orders";
import PublicOrderPage from "./PublicOrderPage";
import PrintOrders from "./pages/PrintOrders";
import Login from "./pages/Login";
import RequireAuth from "@/components/RequireAuth";
import { AuthProvider } from "@/hooks/useAuth";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/orders" element={<Orders />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <Index initialRole="admin" />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/public-order" element={<PublicOrderPage />} />
          <Route path="/print-orders" element={<PrintOrders />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
