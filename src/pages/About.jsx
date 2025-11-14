import React from "react";
import {
  FaCar,
  FaUsers,
  FaLeaf,
  FaShieldAlt,
  FaMoneyBillWave,
  FaCommentAlt,
} from "react-icons/fa";

const About = () => {
  return (
    <div className="p-6 sm:p-10">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">About Sharezy</h1>
        <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto leading-relaxed">
          Share the Ride. Save Money. Travel Smarter.
        </p>
      </header>

      <div className="text-justify text-gray-700 leading-relaxed space-y-6">
        <p className="text-lg">
          At <span className="font-semibold text-gray-800">Sharezy</span>, we
          believe travel should be more affordable, more social, and better for
          the planet. That's why we created a carpooling platform that connects
          drivers with empty seats to passengers heading in the same direction.
        </p>

        <p className="text-lg">
          Our goal is simple: to help people share their journeys, reduce travel
          costs, and cut down on unnecessary car trips — all while building a
          trusted community of everyday travelers.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 flex items-center gap-3">
          <FaCar className="text-blue-600" />
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-blue-600 font-bold text-lg">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Drivers Post a Trip
            </h3>
            <p className="text-gray-700">
              Drivers list their planned trips, including origin, destination,
              date, time, and price per seat.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-green-600 font-bold text-lg">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Passengers Book a Ride
            </h3>
            <p className="text-gray-700">
              Passengers search for available rides, choose the one that suits
              their needs, and book a seat directly.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-purple-600 font-bold text-lg">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Ride and Connect
            </h3>
            <p className="text-gray-700">
              Once booked, both driver and passenger can communicate through
              Sharezy to coordinate the journey — then enjoy the ride together.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 flex items-center gap-3">
          <FaUsers className="text-green-600" />
          Why Sharezy?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
            <FaMoneyBillWave className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Affordable Travel
              </h3>
              <p className="text-gray-700 text-sm">
                Split travel costs and save money.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
            <FaLeaf className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Eco-Friendly</h3>
              <p className="text-gray-700 text-sm">
                Reduce traffic and cut carbon emissions by carpooling.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
            <FaShieldAlt className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Simple & Secure
              </h3>
              <p className="text-gray-700 text-sm">
                Easy-to-use interface with built-in messaging for smooth
                coordination.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mt-6">
          <p className="text-gray-700">
            <span className="font-semibold text-gray-800">
              We charge a small commission
            </span>{" "}
            from the driver's seat price to maintain and improve the platform.
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 flex items-center gap-3">
          <FaCommentAlt className="text-orange-600" />
          Important Notice
        </h2>

        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <p className="text-gray-700 mb-4">
            <span className="font-semibold text-gray-800">
              Sharezy is a platform that connects drivers and passengers
            </span>{" "}
            — we do not operate the vehicles or employ the drivers.
          </p>
          <p className="text-gray-700 mb-4">
            All users are responsible for their own safety and conduct during
            rides. In the unlikely event of an accident, Sharezy is not liable
            for any damages, injuries, or losses that may occur during the trip.
          </p>
          <p className="text-gray-700">
            We strongly encourage users to verify each other's profiles and
            travel responsibly.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Join the Sharezy Community Today
          </h3>
          <p className="text-gray-700">
            Start sharing rides, saving money, and making travel more
            sustainable together.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
