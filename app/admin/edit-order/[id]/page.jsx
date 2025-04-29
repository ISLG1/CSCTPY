'use client';

import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/admin/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const EditOrder = ({ params }) => {
  const { currency, getToken, user } = useAppContext();
  const id = React.use(params).id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrder = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`/api/order/get?id=${id}`, { // Modified API endpoint
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setOrder(data.order);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user && id) {
      fetchOrder();
    }
  }, [user, id]);

  const handleStatusChange = (e) => {
    setOrder({ ...order, status: e.target.value });
  };

  const handlePaymentStatusChange = (e) => {
    setOrder({ ...order, payment_status: e.target.value });
  };

  const handleUpdateOrder = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.put(
        `/api/order/edit`,
        {
          orderId: id,
          status: order.status,
          payment_status: order.payment_status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
        <Loading />
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
        <div>Order not found</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-scroll flex flex-col justify-between text-sm">
      <div className="md:p-10 p-4 space-y-5">
        <h2 className="text-lg font-medium">Edit Order</h2>
        <div className="max-w-4xl rounded-md">
          <div className="flex flex-col md:flex-row justify-between gap-5 p-5 border-t border-gray-300">
            <div className="flex-1 flex gap-5 max-w-80">
              <Image
                className="max-w-16 max-h-16 object-cover"
                src={assets.box_icon}
                alt="box_icon"
              />
              <p className="flex flex-col gap-3">
                <span className="font-medium">
                  {order.items
                    .map(
                      (item) =>
                        `${item.product_name || "Product Unavailable"} x ${item.quantity}`
                    )
                    .join(", ")}
                </span>
                <span>Items : {order.items.length}</span>
              </p>
            </div>
            <div>
              <p className="flex flex-col">
                <span className="pb-3 w-full">
                  Status:
                  <select
                    className="border"
                    value={order.status}
                    onChange={handleStatusChange}
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="In-Progress">In-Progress</option>
                    <option value="Out-for-Delivery">Out-for-Delivery</option>
                    <option value="Order Delivered">Order Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </span>
                <span className="pb-3 w-full">
                  Payment :
                  <select
                    className="border"
                    value={order.payment_status}
                    onChange={handlePaymentStatusChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Received">Received</option>
                    <option value="Failed">Failed</option>
                  </select>
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-3 action-section">
              <button onClick={handleUpdateOrder} className="bg-blue-500 text-white px-3 py-1 rounded">
                Update
              </button>
              <button onClick={() => router.back()} className="bg-gray-200 px-3 py-1 rounded">
                Back
              </button>
              
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditOrder;