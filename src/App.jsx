import { BrowserRouter, Routes, Route } from "react-router-dom";
import { About, Contact, Hero, Navbar, Tech, StarsCanvas } from "./components";
import Chat from "./components/Chat";
import ChooseCelebrity from "./components/ChooseCelebrity";

const App = () => {
  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary'>
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          <Navbar />
          <Hero />
        </div>

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
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
