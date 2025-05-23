import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5 flex gap-5">
          <Image className="w-28 md:w-32" src={assets.logo} alt="logo" />
          <p className="text-md text-justify">
            <span className="font-medium text-gray-900">
            Welcome to Puduvai Market – Thattanchavady!<br />
            </span>
            We’re your go-to center for Groceries delivered to your doorstep. 
            We also offer occasional entertainment products to add a little fun to your day. 
            Fast, friendly, and local – Puduvai Market is here to serve you better!
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-md text-gray-900 mb-5">Quick Links</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="/">Home</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">About us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="/contact">Contact us</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-md text-gray-900 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>9876543210</p>
              <p>info@puduvaimarket.in</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © Ignite SkyLabs All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;