import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoaderCompo from "../components/LoaderCompo";
function WellcomePage() {
  const Navigate = useNavigate();
  const { isAuthenticared, isLoading } = useSelector((state) => state.User);
  React.useEffect(() => {
    if (isAuthenticared) {
      Navigate("/home");
    }
  }, [Navigate, isAuthenticared]);

  const handleToContinue = () => {
    if (isAuthenticared) {
      Navigate("/home");
    } else {
      Navigate("/login");
    }
  };
  return (
    <>
      {isLoading ? (
        <LoaderCompo />
      ) : (
        <div className=" text-white w-[94%] h-[100%] flex flex-col items-center justify-center ">
          <div className="w-[95%] flex flex-col items-center justify-center font-thin  ">
            <div className="p-4 w-[100%] flex  flex-col items-center justify-center  ">
              <img src="logo.png" alt="Logo" className="w-[30vmin]" />
              <h1 className="title flex  flex-col items-start gap-2 sm:flex-row bg-white">
                <span>Welcome to</span>
                <span>Chat</span>
                <span>Application</span>
              </h1>
            </div>
            <div className=" w-[100%] flex items-center justify-center  mb-2">
              <button
                className="w-[100%]  sm:w-[45%] p-2  text-xl text-white font-bold rounded-md bg-green-400 cursor-pointer font-normalfont flex justify-center items-center  hover:bg-[#57f3c2]  duration-500"
                onClick={handleToContinue}
              >
                Continue
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center mb-1">
            <p className="font-semibold text-xs">Created by</p>
            <h4 className="font-semibold text-sm">Indranil das</h4>
            <p className="font-semibold text-xs">@2024</p>
          </div>
        </div>
      )}
    </>
  );
}

export default WellcomePage;
