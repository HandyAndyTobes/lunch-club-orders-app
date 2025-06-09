
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import PublicOrderPage from "./PublicOrderPage";
import PrintOrders from "./pages/PrintOrders";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<Navigate to="/" replace />} />
        <Route path="/public-order" element={<PublicOrderPage />} />
        <Route path="/print-orders" element={<PrintOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
