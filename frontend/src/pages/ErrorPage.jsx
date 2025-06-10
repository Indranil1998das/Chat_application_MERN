import React from "react";

function ErrorPage() {
  return (
    <div className=" h-screen w-screen  ">
      <div className=" h-full w-full bg-white/40 backdrop-blur-md flex flex-col items-center justify-center">
        <p className=" font-bold text-5xl">404 - Page Not Found</p>
        <p className=" font-bold text-3xl">
          Oops! Please log in to access this page.
        </p>
      </div>
    </div>
  );
}

export default ErrorPage;
