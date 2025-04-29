'use client'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";

const Entertainment = () => {

    const { products } = useAppContext();

    const subcategories = ['Speakers', 'TV', 'Toys', 'Others'];

    return (
        <>
            <Navbar />
            {subcategories.map((subcategory, index) => {
                const subcategoryProducts = products.filter(product => product.category === "Entertainment" && product.sub_category === subcategory);

                if (subcategoryProducts.length === 0) {
                    return null; // Don't render the div if there are no products for this subcategory
                }

                return (
                    <div key={index} className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                        <div className="flex flex-col items-end pt-12">
                            <p className="text-2xl font-medium">{subcategory}</p>
                            <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
                            {subcategoryProducts.map((product, index) => (
                                <ProductCard key={index} product={product} />
                            ))}
                        </div>
                    </div>
                );
            })}
            <Footer />
        </>
    );
};

export default Entertainment;