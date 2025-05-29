import React from "react";
import { useGetBannerQuery } from "../../redux/apiSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Banner = () => {
  const { data, isLoading, isError, error } = useGetBannerQuery();
  console.log(data);
  // Default banner configuration
  const defaultBanner = {
    image:
      "https://via.placeholder.com/1920x500.png?text=Summer+Collection+2024",
    header: "New Season Arrivals",
    subHeader: "Discover Our Exclusive Collection",
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    adaptiveHeight: true,
  };

  if (isLoading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[500px] flex items-center justify-center text-red-500">
        Error: {error?.message || "Failed to load banners"}
      </div>
    );
  }

  const banners = data?.length > 0 ? data : [defaultBanner];

  return (
    <div className="relative w-full h-[560px] bg-gray-100 overflow-hidden">
      {banners.length > 1 ? (
        <Slider {...sliderSettings}>
          {banners.map((banner, index) => (
            <BannerSlide key={index} banner={banner} />
          ))}
        </Slider>
      ) : (
        <BannerSlide banner={banners[0]} />
      )}
    </div>
  );
};

const BannerSlide = ({ banner }) => (
  <div className="relative w-full h-[500px] flex items-center justify-center">
    <img
      src={banner.image}
      alt="Fashion Model"
      className="absolute w-full h-full object-cover brightness-75"
    />
    <div className="relative z-10 text-center text-white px-6 max-w-2xl">
      <h1 className="text-5xl font-bold mb-4 uppercase tracking-wide">
        {banner.header}
      </h1>
      <p className="text-lg mb-6">{banner.subHeader}</p>
      <button className="font-semibold py-3 px-6 rounded-full shadow-md border-2 bg-[#800f2f] hover:bg-[#f4f3ee] text-white hover:text-gray-900 border-white hover:border-[#800f2f] transition-all">
        Shop Now
      </button>
    </div>
  </div>
);

export default Banner;
