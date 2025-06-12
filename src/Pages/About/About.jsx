import React from "react";
import { Link } from "react-router-dom";
const About = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            About SM Clothing
          </h1>
          <p className="text-lg sm:text-xl">
            Handcrafted. Unique. Made for you.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 sm:px-10">
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
              Our Story
            </h2>
            <p className="text-gray-700 mb-4">
              SM Clothing began with a passion for handcrafted fashion. Founded
              by designers who believe that every garment should tell a story,
              we source the finest fabrics and work with skilled artisans to
              create pieces that stand out. From our first sketch to the final
              stitch, each item is made with intention and care.
            </p>
            <p className="text-gray-700">
              Our commitment is to offer you exclusive designs that no one else
              will have—because style should be about expressing your
              individuality.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-gray-50 py-16 px-4 sm:px-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-black text-center mb-8">
            Mission & Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold text-black mb-2">
                Craftsmanship
              </h3>
              <p className="text-gray-600">
                We partner with artisans who pour their expertise into every
                stitch, ensuring unparalleled quality and attention to detail.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold text-black mb-2">
                Sustainability
              </h3>
              <p className="text-gray-600">
                From eco-friendly materials to responsible production methods,
                we strive to minimize our environmental footprint.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold text-black mb-2">
                Exclusivity
              </h3>
              <p className="text-gray-600">
                Each design is a limited edition—once it's sold out, it won't be
                reproduced. Your style remains uniquely yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      {/* <section className="py-16 px-4 sm:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-8">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <img
                src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Team Member"
                className="w-32 h-32 rounded-full object-cover mb-4 shadow-md"
              />
              <h3 className="text-xl font-semibold">Aisha Rahman</h3>
              <p className="text-gray-600">Founder & Lead Designer</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Team Member"
                className="w-32 h-32 rounded-full object-cover mb-4 shadow-md"
              />
              <h3 className="text-xl font-semibold">Rahim Karim</h3>
              <p className="text-gray-600">Head of Production</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Call to Action */}
      <section className="bg-black text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Elevate Your Wardrobe?
          </h2>
          <p className="text-gray-200 mb-6">
            Browse our exclusive collections and find your one-of-a-kind piece.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-white text-black font-semibold px-8 py-3 rounded-md hover:bg-gray-100 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
