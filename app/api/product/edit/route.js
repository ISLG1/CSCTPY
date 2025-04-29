import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";

// Configure Cloudinary (required because you upload here too)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

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
        const sub_category = data.get('sub_category');
        const price = data.get('price');
        const offerPrice = data.get('offerPrice');
        const newFiles = data.getAll('images');
        const existingImagesString = data.get('existingImages'); // NOTE: might be a JSON string

        let existingImages = [];

        if (existingImagesString) {
            try {
                existingImages = JSON.parse(existingImagesString); // Convert back from string to array
            } catch (err) {
                console.error('Failed to parse existing images:', err);
            }
        }

        // Upload newly added images (if any)
        let uploadedImages = [];

        if (newFiles && newFiles.length > 0 && newFiles[0].name) {
            uploadedImages = await Promise.all(
                newFiles.map(async (file) => {
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    return new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { resource_type: 'auto' },
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result.secure_url);
                                }
                            }
                        );
                        stream.end(buffer);
                    });
                })
            );
        }

        // Combine existing images with uploaded images
        let finalImages = [...uploadedImages];

        // Update fields if provided
        if (name) product.name = name;
        if (description) product.description = description;
        if (category) product.category = category;
        if (sub_category) product.sub_category = sub_category;
        if (price) product.price = Number(price);
        if (offerPrice) product.offerPrice = Number(offerPrice);
        product.image = finalImages;

        await product.save();

        return NextResponse.json({ success: true, message: "Product updated successfully" });

    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}