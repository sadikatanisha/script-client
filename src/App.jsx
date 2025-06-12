import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./Components/Utils/ScrollToTop";
function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <ScrollToTop />
      <div>
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
