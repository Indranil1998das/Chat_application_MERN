import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleToForgetPasswordAPI } from "../slices/UserSlice";
function ForgetPassword() {
  const Dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.User);
  const [email, setEmail] = React.useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(email);

    Dispatch(handleToForgetPasswordAPI(email));
  };
  return (
    <div className="bg-white/90 rounded-xl shadow-lg p-8 flex flex-col items-center max-w-sm w-full">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        Forgot Password?
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>
      <form className="w-full" onSubmit={handleSubmit}>
        <input
          type="email"
          className="w-full px-4 py-2 border  text-black rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-200"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}

export default ForgetPassword;
