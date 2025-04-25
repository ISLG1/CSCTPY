import { v2 as cloudinary } from "cloudinary";
import { getAuth } from '@clerk/nextjs/server'
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";


// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


export async function DELETE(request) {
    try {
        
        const { userId } = getAuth(request)

        const isSeller = await authSeller(userId)

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'not authorized' })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ success: false, message: 'Product ID is required' });
        }

        await connectDB()

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({ success: false, message: 'Product not found' });
        }

        // Check if the user owns the product
        if (product.userId !== userId) {
            return NextResponse.json({ success: false, message: 'You are not authorized to delete this product' });
        }

        // Extract public IDs from image URLs
        const publicIds = product.image.map(url => {
            const parts = url.split('/');
            const imageName = parts[parts.length - 1];
            return imageName.split('.')[0];
        });

        // Delete images from Cloudinary
        if (publicIds.length > 0) {
            await Promise.all(publicIds.map(publicId => {
                return cloudinary.uploader.destroy(publicId);
            }));
        }

        await Product.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'Product deleted successfully' });

    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
}