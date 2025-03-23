import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = ({ refreshTrigger, setSelectedProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/products"); // Full URL
      setProducts(response.data.data || []);
    } catch (err) {
      console.error("Fetch products error:", err.response?.data || err.message);
      setError("Failed to load products. Please check server connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/products/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          validateStatus: (status) => status === 200 || status === 404,
        }
      );

      if (response.status === 200) {
        await fetchProducts();
      } else if (response.status === 404) {
        setError("Product not found - it may have already been deleted");
        await fetchProducts(); // Refresh the list
      }
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
      setError("Failed to delete product. Please try again.");
    }
  };


  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]);

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        {error}
        <button 
          onClick={fetchProducts}
          className="ml-2 bg-gray-100 px-2 py-1 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <div key={product._id} className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col">
          <div className="flex-grow">
            <p className="text-lg font-semibold mb-2">{product.name}</p>
            <p className="text-gray-600 mb-1"><span className="font-medium">SKU:</span> {product.sku}</p>
            <p className="text-xl text-blue-600 font-bold mb-4">₹{product.price}</p>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(product.images || []).map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`product-${i}`}
                  className="w-full h-24 object-cover rounded-md border"
                />
              ))}
            </div>
          </div>

          <div className="mt-auto flex justify-between gap-2">
            <button 
              onClick={() => setSelectedProduct(product)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md transition-colors flex-grow"
            >
              Edit
            </button>
            <button 
              onClick={() => handleDelete(product._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors flex-grow"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;