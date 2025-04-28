'use client';

import React, { useState, useEffect, useRef } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from "@/components/Loading";

const EditProduct = () => {
  const { getToken } = useAppContext();
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [sub_category, setSubCategory] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [newFiles, setNewFiles] = useState([]); // Store newly selected files
  const [existingImages, setExistingImages] = useState([]); // Store existing image URLs

  // Use refs to track initial values
  const initialName = useRef(name);
  const initialDescription = useRef(description);
  const initialCategory = useRef(category);
  const initialPrice = useRef(price);
  const initialOfferPrice = useRef(offerPrice);

    const [productId, setProductId] = useState(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        setProductId(searchParams.get('id'));
    }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get(`/api/product/get?id=${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const productData = response.data.product;
          setName(productData.name);
          setDescription(productData.description);
          setCategory(productData.category);
          setSubCategory(productData.sub_category);
          setPrice(productData.price);
          setOfferPrice(productData.offerPrice);
          setExistingImages(productData.image); // Set existing image URLs

          // Update initial values
          initialName.current = productData.name;
          initialDescription.current = productData.description;
          initialCategory.current = productData.category;
          initialSubCategory.current = productData.sub_category;
          initialPrice.current = productData.price;
          initialOfferPrice.current = productData.offerPrice;

        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, getToken]);

  const handleImageChange = (e) => {
    setNewFiles(Array.from(e.target.files));
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (name !== initialName.current) {
      formData.append('name', name);
    }
    if (description !== initialDescription.current) {
      formData.append('description', description);
    }
    if (category !== initialCategory.current) {
      formData.append('category', category);
    }
    if (sub_category !== initialSubCategory.current) {
      formData.append('sub_category', sub_category);
    }
    if (price !== initialPrice.current) {
      formData.append('price', price);
    }
    if (offerPrice !== initialOfferPrice.current) {
      formData.append('offerPrice', offerPrice);
    }

    // Append new files to formData
    for (let i = 0; i < newFiles.length; i++) {
      formData.append('images', newFiles[i]);
      console.log(newFiles[i]);
    }

    // Append existing image URLs as a JSON string
    formData.append('existingImages', JSON.stringify(existingImages));

    try {
      const token = await getToken();

      const { data } = await axios.put(`/api/product/edit?id=${productId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success(data.message);
        router.push('/admin/product-list'); // Redirect to product list after successful edit
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.message);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input
                  onChange={handleImageChange}
                  type="file"
                  id={`image${index}`}
                  hidden
                />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={newFiles[index] ? URL.createObjectURL(newFiles[index]) : (existingImages[index] || assets.upload_area)}
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-description">
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex flex-col gap-1 w-1/2">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="Grocery">Grocery</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-1/2">
            <label className="text-base font-medium" htmlFor="sub_category">
              Sub Category
            </label>
            <select
              id="sub_category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
              required
            >
              <option value="">Select {category} type</option>
              {subcategoryOptions && subcategoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-5 mt-5">
          <div className="flex flex-col gap-1 w-1/2">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-1/2">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
        </div>

        <button type="submit" className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditProduct;