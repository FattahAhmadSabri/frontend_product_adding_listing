import React, { useState } from "react";
import ProductForm from "./components/productForm";
import ProductList from "./components/productList";

const App = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleSubmitSuccess = () => {
    setRefreshTrigger(prev => !prev);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Left Sidebar - Form */}
      <div className="w-full md:w-1/4 md:fixed h-auto md:h-screen p-4 md:p-6 bg-white border-b md:border-r border-gray-200 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
          {selectedProduct ? "Edit Product" : "Create Product"}
        </h2>
        <ProductForm
          key={selectedProduct?._id || "create"}
          selectedProduct={selectedProduct}
          onSubmitSuccess={handleSubmitSuccess}
        />
      </div>

      {/* Right Content - Product List */}
      <div className="w-full md:w-3/4 md:ml-[25%] p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800">
          Product Inventory
        </h1>
        <ProductList 
          refreshTrigger={refreshTrigger}
          setSelectedProduct={setSelectedProduct}
        />
      </div>
    </div>
  );
};

export default App;