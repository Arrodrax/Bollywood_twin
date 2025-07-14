import React, { useState } from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      setLoading(false);
      alert("Login successful!");
      navigate("/choose"); // Make sure route is lowercase 'choose'
    } catch (error) {
      setLoading(false);
      alert("Network error: " + error.message);
    }
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
        <Tilt className="xs:w-[520px] w-full" tiltMaxAngleX={45} tiltMaxAngleY={45} perspective={1000} scale={1} transitionSpeed={450}>
          <motion.div
            variants={fadeIn("right", "spring", 0.5, 0.75)}
            className="green-pink-gradient p-[2px] rounded-[24px] shadow-card"
          >
            <div className="bg-tertiary rounded-[20px] py-16 px-10 flex flex-col items-center">
              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
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
                <Link to="/signup" className="text-white underline">
                  Sign up now
                </Link>
              </p>
            </div>
          </motion.div>
        </Tilt>
      </div>
    </>
  );
};

export default SectionWrapper(Login, "login");
