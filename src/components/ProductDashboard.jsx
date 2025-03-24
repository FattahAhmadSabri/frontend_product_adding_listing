import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductForm from './productForm';
import ProductList from './productList';

const ProductDashboard = () => {
  const { setIsAuthenticated } = useAuth();
  
  // State for selected product (for edit)
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // State to trigger refresh after adding/editing/deleting
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar with form */}
      <div className="w-full md:w-1/4 p-4 bg-white border-r">
        <div className="flex justify-between items-center mb-4">
          <h2>Product Management</h2>
          <button 
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700"
          >
            Logout
          </button>
        </div>
        <ProductForm 
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          setRefreshTrigger={setRefreshTrigger}
        />
      </div>

      {/* Product List */}
      <div className="w-full md:w-3/4 p-4">
        <ProductList 
          refreshTrigger={refreshTrigger}
          setSelectedProduct={setSelectedProduct}
        />
      </div>
    </div>
  );
};

export default ProductDashboard;
