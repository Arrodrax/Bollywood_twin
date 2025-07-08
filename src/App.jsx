import { BrowserRouter, Routes, Route } from "react-router-dom";

import { About, Contact, Hero, Navbar, Tech, StarsCanvas } from "./components";

import Login from "./pages/login";
import ChooseCelebrity from "./pages/ChooseCelebrity";
import Chat from "./pages/Chat";

import Chat from ".//Chat";
import ChooseCelebrity from ".pages/components/ChooseCelebrity";
import Login from "./components/login";
import Signup from "./components/signup";  

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Homepage route */}
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


        {/* Standalone pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/choosecelebrity" element={<ChooseCelebrity />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <About />
                <Tech />
                <div className='relative z-0'>
                  <Contact />
                  <StarsCanvas />
                </div>
              </>
            }
          />
          <Route path="/chat" element={<Chat celebId={1} />} />
          <Route path="/choose" element={<ChooseCelebrity />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat/:celebId" element={<Chat />} />
        </Routes>
    </BrowserRouter>
  );
};

export default App;