function RequestSummary({
  data,
  handleChangeStatus,
  id,
  handleToOtherUserInfoOpen,
}) {
  return (
    <div className="text-lg m-2 flex  flex-col items-center  justify-evenly cursor-pointer  hover:bg-green-400/10 rounded-md duration-500 p-2 shadow-xl">
      <div
        className=" w-full flex items-center  justify-evenly "
        onClick={() => handleToOtherUserInfoOpen(data)}
      >
        <div>
          <img
            src={data.profilePhoto.url}
            alt="abc"
            className=" w-16 h-16 rounded-full"
          />
        </div>
        <div>
          <h1 className="text-lg font-semibold">{data.fullName}</h1>
          <span>{data.userEmail}</span>
        </div>
      </div>
      <div className="w-full  flex  justify-end mt-2 gap-4">
        <button
          className="p-2  font- shadow-xl rounded-3xl cursor-pointer bg-green-200"
          onClick={() => handleChangeStatus(id, "accept", data)}
        >
          Accept
        </button>
        <button
          className="p-2  shadow-xl rounded-3xl  cursor-pointer bg-red-400"
          onClick={() => handleChangeStatus(id, "reject", data)}
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export default RequestSummary;
