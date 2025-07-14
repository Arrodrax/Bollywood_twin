import { BrowserRouter, Routes, Route } from "react-router-dom";

// Sections (used on homepage)
import { About, Contact, Hero, Navbar, Tech, StarsCanvas } from "./components";

// Pages
import Login from "./components/login";
import Signup from "./components/Signup";
import ChooseCelebrity from "./components/ChooseCelebrity";
import Chat from "./pages/Chat"; // ✅ Chat with mic input already handled

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🏠 Homepage */}
        <Route
          path="/"
          element={
            <div className="relative z-0 bg-primary">
              <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
                <Navbar />
                <Hero />
              </div>
              <About />
              <Tech />
              <div className="relative z-0">
                <Contact />
                <StarsCanvas />
              </div>
            </div>
          }
        />

        {/* ✅ Routes for individual pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/choose" element={<ChooseCelebrity />} />
        <Route path="/chat/:celebId" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
