'use client'
import React from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <>
      <Navbar/>
      <div className="contact-us flex flex-col px-6 md:px-16 lg:px-32 py-14 border-b border-gray-500/30 text-gray-500">
        <p className="text-xl font-medium">Contact Us</p>
        <div className="phone-number">
            <h2>Phone Number:</h2>
            <p>9443460413</p>
        </div>
        <div className="email">
            <h2>Email:</h2>
            <p>prabudulasi90@gmail.com</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
