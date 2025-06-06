
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "./Index";
import PublicOrderPage from "./PublicOrderPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/public-order" replace />} />
        <Route path="/admin" element={<Index />} />
        <Route path="/public-order" element={<PublicOrderPage />} />
      </Routes>
    </Router>
  );
}

export default App;
