import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
        }

        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, order });

    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}