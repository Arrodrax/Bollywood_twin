import { BrowserRouter, Routes, Route } from "react-router-dom";

import { About, Contact, Hero, Navbar, Tech, StarsCanvas } from "./components";
import Login from "./pages/login";
import ChooseCelebrity from "./pages/ChooseCelebrity";
import Chat from "./pages/Chat";

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
    </BrowserRouter>
  );
};

export default App;