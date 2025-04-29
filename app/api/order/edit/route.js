import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { userId } = getAuth(request);
    const { orderId, status, payment_status } = await request.json();

    if (!orderId || !status || !payment_status) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if the user is authorized to edit the order (e.g., admin or seller)
    // Implement your authorization logic here

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    order.status = status;
    order.payment_status = payment_status;

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message });
  }
}