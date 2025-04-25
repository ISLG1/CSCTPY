import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";

export async function PUT(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    const data = await request.formData();
    const name = data.get('name');
    const description = data.get('description');
    const category = data.get('category');
    const price = data.get('price');
    const offerPrice = data.get('offerPrice');
    const images = data.getAll('images');
    const existingImages = data.get('existingImages');

    // Update only the provided fields
    if (name) {
      product.name = name;
    }
    if (description) {
      product.description = description;
    }
    if (category) {
      product.category = category;
    }
    if (price) {
      product.price = price;
    }
    if (offerPrice) {
      product.offerPrice = offerPrice;
    }
    // Handle images update logic here

    await product.save();

    return NextResponse.json({ success: true, message: "Product updated successfully" });

  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}