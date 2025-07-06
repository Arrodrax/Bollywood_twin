import React from "react";

import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const Tech = () => {
  return (
    <>
    <section id = "stars">
      <div className='flex flex-row flex-wrap justify-center gap-10'>
        <h2 className='text-white text-[24px] font-bold text-center mb-6'>
          You can talk with bollywood stars
          <hr className='mt-2 border-gray-600' />
        </h2>
      </div>

      <div className='flex flex-row flex-wrap justify-center gap-10'>
        {technologies.map((technology) => (
          <div className='w-28 h-28' key={technology.name}>
            <BallCanvas icon={technology.icon} />
          </div>
        ))}
      </div>
    </section>
    </>
  );
};


export default SectionWrapper(Tech, "");
