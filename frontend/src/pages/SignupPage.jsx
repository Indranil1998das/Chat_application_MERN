import React from "react";
import { RiUserLine } from "react-icons/ri";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleSignupAPI } from "../slices/UserSlice";
import { toast } from "react-toastify";
import LoaderCompo from "../components/LoaderCompo";
function SignupPage() {
  const Dispatch = useDispatch();
  const Navigate = useNavigate();
  const { success, isLoading } = useSelector((state) => state.User);
  const resetScroll = () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  const [ishiddenPassword, setIshiddenPassword] = React.useState(false);
  const [ishiddenConfirmPassword, setIshiddenConfirmPassword] =
    React.useState(false);
  const [data, setData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "male",
    profilePhoto: null,
  });
  const file_name = React.useRef(" Upload Your Photo");
  React.useEffect(() => {
    if (success) {
      Navigate("/login");
    }
  }, [success]);

  const handleToHiddenPassword = () => {
    setIshiddenPassword(!ishiddenPassword);
  };
  const handleToHiddenConfirmPassword = () => {
    setIshiddenConfirmPassword(!ishiddenConfirmPassword);
  };

  const hnadleToChangeUserDate = (e) => {
    if (e.target.name === "profilePhoto") {
      file_name.current = e.target.files[0].name;
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        if (reader.readyState === 2) {
          setData({ ...data, profilePhoto: reader.result });
        }
      };
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const handleToSubmitSignUp = (e) => {
    if (
      !data.confirmPassword ||
      !data.password ||
      !data.email ||
      !data.name ||
      !data.profilePhoto
    ) {
      toast.error("Please fill all fields required");
      return;
    }
    e.preventDefault();
    Dispatch(handleSignupAPI(data));
  };
  return (
    <>
      {isLoading ? (
        <LoaderCompo />
      ) : (
        <div className="w-[94%]  flex items-center justify-center">
          <div className="w-[100%] text-white flex flex-col items-center ">
            <h1 className="mb-1 title text-white md:text-3xl">
              Create Your Profile
            </h1>
            <div className="flex items-center justify-center w-[100%]">
              <div className="flex flex-col space-y-2  p-1 w-[100%] sm:w-[80%]">
                <div className="flex space-x-3 items-center">
                  <RiUserLine className="text-2xl" />
                  <input
                    type="text"
                    placeholder="Enter User Name"
                    name="name"
                    onBlur={resetScroll}
                    onChange={hnadleToChangeUserDate}
                    className=" p-2 font-bold text-base  w-[100%]  bg-green-300/45  rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <div className="flex space-x-3 items-center">
                  <AiOutlineMail className="text-2xl" />
                  <input
                    type="email"
                    name="email"
                    onBlur={resetScroll}
                    placeholder="Enter your email"
                    onChange={hnadleToChangeUserDate}
                    className=" p-2 font-bold  text-base  w-[100%]  bg-green-300/45  rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <div className="flex space-x-3 items-center">
                  <RiLockPasswordLine className="text-2xl" />
                  <div className=" w-full flex items-center relative">
                    <input
                      type={`${ishiddenPassword ? "text" : "password"}`}
                      onBlur={resetScroll}
                      placeholder="Enter your password"
                      name="password"
                      required
                      onChange={hnadleToChangeUserDate}
                      className=" p-2 font-bold  text-base  w-[100%]  bg-green-300/45  rounded-md focus:outline-none focus:ring-2 focus:ring-white"
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
                <div className="flex space-x-3 items-center">
                  <RiLockPasswordLine className="text-2xl" />
                  <div className=" w-full flex items-center relative">
                    <input
                      type={`${ishiddenConfirmPassword ? "text" : "password"}`}
                      onBlur={resetScroll}
                      placeholder="Enter your confirm password"
                      name="confirmPassword"
                      onChange={hnadleToChangeUserDate}
                      className=" p-2 font-bold  text-base  w-[100%]  bg-green-300/45  rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    {!ishiddenConfirmPassword ? (
                      <button
                        onClick={handleToHiddenConfirmPassword}
                        type="button"
                        className=" absolute right-5 text-2xl cursor-pointer"
                      >
                        <FaRegEye />
                      </button>
                    ) : (
                      <button
                        onClick={handleToHiddenConfirmPassword}
                        type="button"
                        className=" absolute right-5 text-2xl cursor-pointer"
                      >
                        <FaRegEyeSlash />
                      </button>
                    )}
                  </div>
                </div>
                <div className=" flex flex-row items-center justify-center w-[100%] ">
                  <div className=" space-x-2 flex flex-row items-center mr-2">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      className=" h-5 w-5 cursor-pointer appearance-none rounded-full bg-white  checked:bg-red-500 transition-all"
                      onChange={hnadleToChangeUserDate}
                      defaultChecked
                    />
                    <span className=" text-base  font-normalTextfont">
                      Male
                    </span>
                  </div>
                  <div
                    className=" space-x-2 flex flex-row items-center ml-2"
                    onChange={hnadleToChangeUserDate}
                  >
                    <input
                      type="radio"
                      value="female"
                      name="gender"
                      className=" h-5 w-5 cursor-pointer appearance-none rounded-full bg-white  checked:bg-red-500  transition-all"
                    />
                    <span className="text-base   font-normalTextfont">
                      Female
                    </span>
                  </div>
                  <div className=" flex flex-col justify-center w-[100%] items-center ">
                    <label
                      htmlFor="profilePhoto"
                      className=" p-1 w-[80%] font-bold text-base cursor-pointer   rounded-md  bg-green-700/45  flex items-center justify-center"
                    >
                      {file_name.current}
                    </label>
                    <input
                      type="file"
                      name="profilePhoto"
                      accept="image/jpeg"
                      id="profilePhoto"
                      onChange={hnadleToChangeUserDate}
                      className=" hidden"
                    />
                  </div>
                </div>
                <div className=" w-full flex justify-center mb-1">
                  <button
                    className="py-2 px-3  w-[100%] sm:w-[80%]  rounded-md font-bold text-lg bg-green-400 cursor-pointer drop-shadow-md  shadow-lg shadow-green-400 hover:bg-[#57f3c2]  duration-500"
                    onClick={handleToSubmitSignUp}
                  >
                    SignUp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SignupPage;
