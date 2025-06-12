import React, { useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleLoginAPI } from "../slices/UserSlice";
import LoaderCompo from "../components/LoaderCompo";
function LoginPage() {
  const Dispatch = useDispatch();
  const Navigate = useNavigate();
  const { isAuthenticared, isLoading } = useSelector((state) => state.User);
  const [ishiddenPassword, setIshiddenPassword] = useState(false);
  const resetScroll = () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };
  React.useEffect(() => {
    if (isAuthenticared) {
      Navigate("/home");
    }
  }, [isAuthenticared]);
  const handleToHiddenPassword = () => {
    setIshiddenPassword(!ishiddenPassword);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const fromData = new FormData(e.target);
    const obj = Object.fromEntries(fromData.entries());
    Dispatch(handleLoginAPI(obj));
  };
  return (
    <>
      {isLoading ? (
        <LoaderCompo />
      ) : (
        <div className="w-[94%] rounded-xl flex items-center justify-center transition-all duration-100">
          <div className="w-[100%] flex flex-col items-center">
            <h1 className="mb-4  title  text-white md:text-3xl">
              Hi, Welcome Back...
            </h1>
            <div className="flex items-center flex-col  justify-center w-[100%]">
              <form
                className="flex flex-col space-y-4 text-white w-[100%] sm:w-[80%]"
                onSubmit={handleSubmit}
              >
                <div className="flex space-x-2 items-center">
                  <AiOutlineMail className="text-2xl " />
                  <input
                    type="email"
                    name="email"
                    required
                    autoFocus
                    onBlur={resetScroll}
                    placeholder="Enter Email Id"
                    aria-label="Email Address"
                    className=" p-2 font-bold text-base  w-[100%]  bg-green-300/45  rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <div className="flex space-x-2 items-center">
                  <RiLockPasswordLine className="text-2xl" />
                  <div className=" w-full flex items-center relative">
                    <input
                      type={`${ishiddenPassword ? "text" : "password"}`}
                      name="password"
                      required
                      onBlur={resetScroll}
                      placeholder="Enter Your Password"
                      className=" p-2 font-bold text-base  w-[100%]  bg-green-300/45  rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    {!ishiddenPassword ? (
                      <button
                        onClick={handleToHiddenPassword}
                        type="button"
                        className=" absolute right-5 text-2xl cursor-pointer"
                      >
                        <FaRegEye />
                      </button>
                    ) : (
                      <button
                        onClick={handleToHiddenPassword}
                        type="button"
                        className=" absolute right-5 text-2xl cursor-pointer"
                      >
                        <FaRegEyeSlash />
                      </button>
                    )}
                  </div>
                </div>
                <Link
                  to="/forget/password"
                  className="font-semibold text-base  text-red-400 text-right hover:text-red-300 duration-500"
                >
                  Forget password
                </Link>
                <div className="w-full flex justify-center">
                  <button
                    className="py-2 px-3  w-[100%] sm:w-[80%] rounded-md font-bold text-lg bg-green-400 cursor-pointer drop-shadow-md  shadow-lg shadow-green-400 hover:bg-[#57f3c2]  duration-500"
                    type="submit"
                  >
                    LogIn
                  </button>
                </div>
              </form>
              <div className="w-[80%]  text-white m-1 flex items-center justify-center">
                <p className="text-base font-thin">Don't have account ? </p>
                <Link
                  to="/sign-up"
                  className="text-lg font-semibold ml-2  hover:text-red-400 duration-500"
                >
                  Sign Up
                </Link>
                <div />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginPage;
