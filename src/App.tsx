import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import Detail from "./pages/Detail";
import Product from "./pages/Product";
import Login from "./pages/Login";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/products" element={<Product />} />
        <Route path="/login" element={<Login />} />

      </Routes>
    </Router>
  );
}

export default App;

