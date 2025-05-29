// src/App.jsx
import Footer from "./Components/Footer";
import PromoBar from "./Components/HomeComponents/PromoBar";
import Navbar from "./Components/Navbar";
import { Outlet, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <PromoBar />}

      <div className={!isDashboard ? "pt-10" : ""}>
        {!isDashboard && <Navbar />}

        <div className="min-h-[calc(100vh-196px)]">
          <Outlet />
        </div>

        {!isDashboard && <Footer />}
      </div>
    </>
  );
}

export default App;
