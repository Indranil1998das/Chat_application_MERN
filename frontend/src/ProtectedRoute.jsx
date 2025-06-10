import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function ProtectedRoute({ Component }) {
  const Navigate = useNavigate();
  const { isAuthenticared } = useSelector((state) => state.User);
  React.useEffect(() => {
    if (!isAuthenticared) {
      Navigate("/");
    }
  }, [isAuthenticared, Navigate]);
  return (
    <>
      <Component />
    </>
  );
}

export default ProtectedRoute;
