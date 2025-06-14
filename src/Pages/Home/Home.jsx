import React from "react";
import Banner from "../../Components/HomeComponents/Banner";
import Categories from "../../Components/HomeComponents/Categories";
import HomeProducts from "../../Components/HomeComponents/HomeProducts";
import OfferSection from "../../Components/HomeComponents/OfferSection";
import FeaturedProducts from "../../Components/HomeComponents/FeaturedProducts";
import HomeFAQ from "../../Components/HomeComponents/HomeFAQ";

const Home = () => {
  return (
    <div>
      <Banner />
      <Categories />
      <FeaturedProducts />
      <HomeProducts />
      <OfferSection />
      <HomeFAQ />
    </div>
  );
};

export default Home;
