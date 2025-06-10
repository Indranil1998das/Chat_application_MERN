import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { handleChangePasswordAPI } from "../slices/UserSlice";
import LoaderCompo from "./LoaderCompo";
function ChangePassword({ handleChangePasswordPanel }) {
  const Dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.User);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    Dispatch(
      handleChangePasswordAPI({
        currentPassword,
        newPassword,
        confirmPassword,
      })
    );
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      {isLoading ? (
        <div className=" h-auto w-auto  p-3  rounded-2xl bg-green-500/45  flex flex-col justify-center items-center relative animationCSSRToL active">
          <LoaderCompo />
        </div>
      ) : (
        <div className="w-auto  h-auto p-3   bg-white shadow-xl rounded-lg flex flex-col justify-center items-center  relative animationCSSRToL active">
          <div className="  w-full flex justify-between items-center">
            <h1 className="text-2xl font-bold text-center text-green-300">
              Change Password
            </h1>
            <button
              className="p-1 ml-11 cursor-pointer rounded-full  text-black text-xl  md:text-3xl hover:bg-red-500 duration-500 "
              onClick={handleChangePasswordPanel}
            >
              <IoIosCloseCircleOutline />
            </button>
          </div>
          <div>
            <form className="w-full " onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="currentPassword"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  placeholder="Enter current password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="newPassword"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="Enter new password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full cursor-pointer duration-500"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ChangePassword;
