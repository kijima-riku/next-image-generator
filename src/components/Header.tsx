import React from "react";

const Header: React.FC = () => (
  <header className="h-[20vh] w-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white flex items-center">
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold">
        Image <span className="text-yellow-300">Generator</span>
      </h1>
    </div>
  </header>
);
export default Header;
