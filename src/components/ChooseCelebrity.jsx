import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { technologies } from "../constants";

const ChooseCelebrity = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (selected !== null) {
      navigate(`/chat/${selected + 1}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-zinc-900 to-gray-900 flex flex-col items-center justify-center px-6 py-12 text-white">
      <h2 className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Choose Your Bollywood Star
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 max-w-6xl w-full">
        {technologies.map((tech, idx) => (
          <div
            key={tech.name}
            onClick={() => setSelected(idx)}
            className={`cursor-pointer rounded-xl p-2 border-4 transition-shadow duration-300
              ${
                selected === idx
                  ? "border-pink-500 shadow-[0_0_25px_#ff0080]"
                  : "border-transparent hover:border-pink-600 hover:shadow-[0_0_10px_#ff0080]"
              } bg-gradient-to-br from-zinc-800 to-zinc-900 flex flex-col items-center`}
          >
            <img
              src={tech.icon}
              alt={tech.name}
              className="w-24 h-24 object-cover rounded-full mb-3 shadow-lg"
              draggable={false}
            />
            <p className="text-center text-lg font-semibold tracking-wide">
              {tech.name}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={handleGetStarted}
        disabled={selected === null}
        className={`mt-12 px-14 py-3 rounded-full font-bold text-lg transition
          ${
            selected !== null
              ? "bg-pink-600 hover:bg-pink-700 shadow-lg"
              : "bg-pink-600/30 cursor-not-allowed"
          }`}
      >
        Get Started
      </button>
    </div>
  );
};

export default ChooseCelebrity;
