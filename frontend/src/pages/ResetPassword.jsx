import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleToResetPasswordAPI } from "../slices/UserSlice";
function ResetPassword() {
  const Dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.User);
  const { token } = useParams();
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    Dispatch(
      handleToResetPasswordAPI({
        token: token,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      })
    );
    setConfirmPassword("");
    setNewPassword("");
  };

  return (
    <div className="bg-white/90 rounded-xl shadow-lg p-8 flex flex-col items-center max-w-sm w-full">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Reset Password</h2>
      <p className="text-gray-600 mb-6 text-center">
        Enter your new password below to reset your account password.
      </p>
      <form className="w-full" onSubmit={handleSubmit}>
        <input
          type="password"
          className="w-full px-4 py-2 text-black border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-200"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full px-4 py-2 text-black border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-200"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition"
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
