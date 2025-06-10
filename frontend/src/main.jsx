import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Store from "./app/Store";
import { SocketProvider } from "./context/SocketContext.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={Store}>
      <SocketProvider>
        <App />
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Slide}
        />
      </SocketProvider>
    </Provider>
  </BrowserRouter>
);
