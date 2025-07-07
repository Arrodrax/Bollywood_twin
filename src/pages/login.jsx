import React, { useState } from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 🚀 for redirect

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Login successful!");
      navigate("/ChooseCelebrity"); 
    }, 1000);
  };

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Enter the Spotlight</p>
        <h2 className="text-[42px] font-extrabold text-white">Login</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[18px] max-w-3xl leading-[30px]"
      >
        Step into the Bollywood universe and interact with your favorite stars.
        Just log in and let the show begin ✨
      </motion.p>

      <div className="mt-20 flex justify-center">
        <Tilt className="xs:w-[520px] w-full">
          <motion.div
            variants={fadeIn("right", "spring", 0.5, 0.75)}
            className="green-pink-gradient p-[2px] rounded-[24px] shadow-card"
          >
            <div
              options={{ max: 45, scale: 1, speed: 450 }}
              className="bg-tertiary rounded-[20px] py-16 px-10 flex flex-col items-center"
            >
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-6"
              >
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  required
                  className="bg-primary py-4 px-5 text-[18px] text-white placeholder:text-secondary rounded-lg outline-none border-none font-medium"
                />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="bg-primary py-4 px-5 text-[18px] text-white placeholder:text-secondary rounded-lg outline-none border-none font-medium"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-700 to-pink-500 py-4 px-8 rounded-xl text-[18px] text-white font-bold shadow-md hover:scale-105 transition-transform"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <p className="text-center mt-6 text-secondary text-[16px]">
                New to the crew?{" "}
                <a href="/signup" className="text-white underline">
                  Sign up now
                </a>
              </p>
            </div>
          </motion.div>
        </Tilt>
      </div>
    </>
  );
};

export default SectionWrapper(Login, "login");