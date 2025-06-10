import "./App.css";
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  handleLoggedUserAPI,
  handleToClearErrorAndSucces,
} from "./slices/UserSlice";
import ProtectedRoute from "./ProtectedRoute";
import LoaderCompo from "./components/LoaderCompo";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
const WellcomePage = lazy(() => import("./pages/WellcomePage"));
const HomePage = lazy(() => import("./pages/HomePage"));
function App() {
  const Dispatch = useDispatch();
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
      Dispatch(handleToClearErrorAndSucces());
    }
  }, [userError, userSuccess, userSuccess_message]);

  return (
    <>
      <div className=" h-screen w-screen   flex items-center justify-center">
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
        </Routes>
      </div>
    </>
  );
}

export default App;
