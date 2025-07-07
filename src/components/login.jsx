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
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm({ ...signupForm, [name]: value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token); // Store token
      alert("Login successful!");
      navigate("/choose"); // Redirect to ChooseCelebrity
    } else {
      setError(data.error || "Login failed");
      setShowSignup(true);
    }
  } catch (err) {
    setError("Network error");
  } finally {
    setLoading(false);
  }
};


  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupForm),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signed up successfully!");
        setShowSignup(false);
        setSignupForm({ name: "", email: "", password: "" });
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
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
        <Tilt className="xs:w-[520px] w-full">
          <motion.div
            variants={fadeIn("right", "spring", 0.5, 0.75)}
            className="green-pink-gradient p-[2px] rounded-[24px] shadow-card"
          >
            <div
              options={{ max: 45, scale: 1, speed: 450 }}
              className="bg-tertiary rounded-[20px] py-16 px-10 flex flex-col items-center"
            >
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

              {error && <p className="text-red-500 mt-2">{error}</p>}

              <p className="text-center mt-6 text-secondary text-[16px]">
                New to the crew?{" "}
                <button
                  className="text-white underline cursor-pointer"
                  onClick={() => setShowSignup(true)}
                >
                  Sign up now
                </button>
              </p>
            </div>
          </motion.div>
        </Tilt>
      </div>

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className="bg-tertiary rounded-[20px] p-10 w-[400px] max-w-full"
          >
            <h2 className="text-white text-2xl font-bold mb-6 text-center">Sign Up</h2>
            <form onSubmit={handleSignupSubmit} className="flex flex-col gap-5">
              <input
                type="text"
                name="name"
                value={signupForm.name}
                onChange={handleSignupChange}
                placeholder="Your full name"
                required
                className="bg-primary py-3 px-4 text-white placeholder:text-secondary rounded-md outline-none border-none font-medium"
              />
              <input
                type="email"
                name="email"
                value={signupForm.email}
                onChange={handleSignupChange}
                placeholder="Your email"
                required
                className="bg-primary py-3 px-4 text-white placeholder:text-secondary rounded-md outline-none border-none font-medium"
              />
              <input
                type="password"
                name="password"
                value={signupForm.password}
                onChange={handleSignupChange}
                placeholder="Password"
                required
                className="bg-primary py-3 px-4 text-white placeholder:text-secondary rounded-md outline-none border-none font-medium"
              />
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-700 to-pink-500 py-3 px-6 rounded-xl text-white font-bold shadow-md hover:scale-105 transition-transform"
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => setShowSignup(false)}
                  className="text-secondary underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default SectionWrapper(Login, "login");
