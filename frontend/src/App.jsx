import "./App.css";
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  handleLoggedUserAPI,
  handleToClearErrorAndSucces,
} from "./slices/UserSlice";
import ProtectedRoute from "./ProtectedRoute";
import LoaderCompo from "./components/LoaderCompo";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
const WellcomePage = lazy(() => import("./pages/WellcomePage"));
const HomePage = lazy(() => import("./pages/HomePage"));
function App() {
  const Dispatch = useDispatch();
  const Navigate = useNavigate();
  const userError = useSelector((state) => state.User.error);
  const userSuccess = useSelector((state) => state.User.success);
  const userSuccess_message = useSelector(
    (state) => state.User.success_message
  );
  React.useEffect(() => {
    Dispatch(handleLoggedUserAPI());
  }, [Dispatch]);
  React.useEffect(() => {
    if (userError) {
      toast.error(userError);
      Dispatch(handleToClearErrorAndSucces());
    }
    if (userSuccess) {
      toast.success(userSuccess_message);
      if (userSuccess_message === "password is change") {
        Navigate("/login");
      }

      Dispatch(handleToClearErrorAndSucces());
    }
  }, [userError, userSuccess, userSuccess_message]);

  return (
    <>
      <div className=" h-screen w-screen flex items-center justify-center">
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<LoaderCompo />}>
                <WellcomePage />
              </Suspense>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
          <Route
            path="/home"
            element={
              <Suspense fallback={<LoaderCompo />}>
                <ProtectedRoute Component={HomePage} />
              </Suspense>
            }
          />
          <Route path="/forget/password" element={<ForgetPassword />} />
          <Route path="/reset/password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
