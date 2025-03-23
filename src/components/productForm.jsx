import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const ProductForm = ({ selectedProduct, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({ 
    sku: "", 
    name: "", 
    price: "", 
    images: [],
    existingImages: []
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        sku: selectedProduct.sku,
        name: selectedProduct.name,
        price: selectedProduct.price,
        images: [],
        existingImages: selectedProduct.images || []
      });
    } else {
      setFormData({ sku: "", name: "", price: "", images: [], existingImages: [] });
    }
  }, [selectedProduct]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.price || isNaN(formData.price)) newErrors.price = "Valid price required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, images: [...e.target.files] }));
  };

  const removeImage = (index, isExisting) => {
    if (isExisting) {
      setFormData(prev => ({
        ...prev,
        existingImages: prev.existingImages.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    data.append("sku", formData.sku);
    data.append("name", formData.name);
    data.append("price", formData.price);
    formData.existingImages.forEach(img => data.append("existingImages", img));
    formData.images.forEach(file => data.append("images", file));

    try {
      const method = selectedProduct ? "put" : "post";
      const url = selectedProduct
        ? `http://localhost:5000/api/products/${selectedProduct._id}`
        : "http://localhost:5000/api/products";

      await axios[method](url, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Clear form after submission
      setFormData({
        sku: "",
        name: "",
        price: "",
        images: [],
        existingImages: []
      });

      // Clear file input
      fileInputRef.current.value = "";

      onSubmitSuccess();

    } catch (error) {
      const errorMessage = error.response && error.response.data 
        ? error.response.data.message 
        : error.message;
      console.error("Error:", errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:max-w-2xl md:mx-auto lg:max-w-4xl">
      {/* SKU Field */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2 md:text-base">SKU</label>
        <input
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none md:max-w-md md:text-lg ${
            errors.sku ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
          }`}
        />
        {errors.sku && <p className="text-red-500 text-xs mt-1 md:text-sm">{errors.sku}</p>}
      </div>

      {/* Name Field */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2 md:text-base">Product Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none md:max-w-md md:text-lg ${
            errors.name ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
          }`}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1 md:text-sm">{errors.name}</p>}
      </div>

      {/* Price Field */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2 md:text-base">Price</label>
        <div className="relative md:max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 md:text-lg">₹</span>
          <input
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className={`w-full pl-7 pr-3 py-2 border rounded-lg focus:outline-none md:text-lg ${
              errors.price ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
            }`}
          />
        </div>
        {errors.price && <p className="text-red-500 text-xs mt-1 md:text-sm">{errors.price}</p>}
      </div>

      {/* Existing Images */}
      {formData.existingImages.length > 0 && (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 md:text-base">Existing Images</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {formData.existingImages.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt={`Existing ${index}`}
                  className="w-full h-24 object-cover rounded border md:h-32"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index, true)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity md:w-6 md:h-6"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Images Upload */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2 md:text-base">
          {selectedProduct ? "Add New Images" : "Product Images"}
        </label>
        <input
          type="file"
          name="images"
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
          className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 md:text-lg"
        />
        <div className="grid grid-cols-2 gap-2 mt-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {formData.images.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
                className="w-full h-24 object-cover rounded border md:h-32"
              />
              <button
                type="button"
                onClick={() => removeImage(index, false)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity md:w-6 md:h-6"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 md:w-auto md:px-8 md:text-lg md:mx-auto lg:px-12"
      >
        {selectedProduct ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
};

export default ProductForm;