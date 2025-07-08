import React, { useState, useEffect } from 'react';
import Card from './components/Card';
import Button from './components/Button';
import Input from './components/Input';
import Dialog from './components/Dialog';

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [expandedProductKey, setExpandedProductKey] = useState(null);
  const [formData, setFormData] = useState({
    product_name: '',
    brand: '',
    price: '',
    model: '',
    product_description: '',
    product_key: '',
    retailer: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch('http://localhost:8080/catalog/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Failed to fetch products:', err));
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.product_name) newErrors.product_name = 'Required';
    if (!formData.brand) newErrors.brand = 'Required';
    if (!formData.price || isNaN(formData.price)) newErrors.price = 'Must be a number';
    if (!formData.model) newErrors.model = 'Required';
    if (!formData.product_description) newErrors.product_description = 'Required';
    if (!formData.product_key) newErrors.product_key = 'Required';
    if (!formData.retailer) newErrors.retailer = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddProduct = async () => {
    if (!validateForm()) return;
    const newProduct = {
      ...formData,
      price: parseFloat(formData.price)
    };

    try {
      const response = await fetch('http://localhost:8080/catalog/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });

      if (!response.ok) throw new Error('Failed to submit product');

      const createdProduct = await response.json();
      setProducts([...products, createdProduct]);
      setFormData({
        product_name: '',
        brand: '',
        price: '',
        model: '',
        product_description: '',
        product_key: '',
        retailer: ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleProductDetails = (key) => {
    setExpandedProductKey((prevKey) => (prevKey === key ? null : key));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Product List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const key = product.product_key || product.product_name;
          return (
            <Card key={key} onClick={() => toggleProductDetails(key)}>
              <h2 className="text-xl font-semibold">{product.product_name}</h2>
              <p>Brand: {product.brand}</p>
              <p>Price: {product.price}</p>
              <p>Model: {product.model}</p>
              {expandedProductKey === key && (
                <div className="mt-2 space-y-1 text-sm text-gray-700">
                  <p><strong>Description:</strong> {product.product_description}</p>
                  <p><strong>Product Key:</strong> {product.product_key}</p>
                  <p><strong>Retailer:</strong> {product.retailer}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Add New Product</h2>
        <Input name="product_name" placeholder="Product Name" value={formData.product_name} onChange={handleInputChange} error={errors.product_name} />
        <Input name="brand" placeholder="Brand" value={formData.brand} onChange={handleInputChange} error={errors.brand} />
        <Input name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} error={errors.price} />
        <Input name="model" placeholder="Model" value={formData.model} onChange={handleInputChange} error={errors.model} />
        <Input name="product_description" placeholder="Description" value={formData.product_description} onChange={handleInputChange} error={errors.product_description} />
        <Input name="product_key" placeholder="Product Key" value={formData.product_key} onChange={handleInputChange} error={errors.product_key} />
        <Input name="retailer" placeholder="Retailer" value={formData.retailer} onChange={handleInputChange} error={errors.retailer} />
        <Button onClick={handleAddProduct}>Add Product</Button>
      </div>
    </div>
  );
}
