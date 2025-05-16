// Component is using JSX, but React import not needed for newer React versions
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { Companies } from './pages/Companies';
import { CreateCompany } from './pages/CreateCompany';
import { EditCompany } from './pages/EditCompany';
import { Products } from './pages/Products';
import { CreateProduct } from './pages/CreateProduct';
import { EditProduct } from './pages/EditProduct';
import { Inventory } from './pages/Inventory';
import { CreateInventory } from './pages/CreateInventory';
import { EditInventory } from './pages/EditInventory';
import { ProtectedRoute } from './components/molecules/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes for all authenticated users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/products" element={<Products />} />
            <Route path="/inventory" element={<Inventory />} />
          </Route>
          
          {/* Routes that require admin role */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/companies/create" element={<CreateCompany />} />
            <Route path="/companies/edit/:id" element={<EditCompany />} />
            <Route path="/products/create" element={<CreateProduct />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
            <Route path="/inventory/create" element={<CreateInventory />} />
            <Route path="/inventory/edit/:id" element={<EditInventory />} />
          </Route>
          
          {/* Catch-all redirect to home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
