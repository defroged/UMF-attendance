import React from "react";

const Confirmation = ({
  findStudent,
  confirmHandler,
  message,
  gobackHandler,
  btnPress,
}) => {
  return (
    <div className="space-y-10">
      {!(message.success || message.error) && (
        <>
          <p className="text-2xl font-semibold text-center">
            {findStudent.name}様でよろしいですか?
          </p>
          <div className="w-full lg:w-6/12 m-auto space-y-10">
            <button
              className={`bg-blue-500 text-white p-2 text-md text-center outline-0 w-full rounded-md ${
                btnPress && "opacity-50"
              }`}
              onClick={() => confirmHandler("yes")}
              disabled={btnPress}
            >
              はい
            </button>
            <button
              className={`bg-blue-500 text-white p-2 text-md text-center outline-0 w-full rounded-md ${
                btnPress && "opacity-50"
              }`}
              onClick={() => confirmHandler("no")}
              disabled={btnPress}
            >
              いいえ
            </button>
          </div>
        </>
      )}
      {message.success ? (
        <p className="text-center text-green-500 text-2xl font-semibold">
          {message.success}
        </p>
      ) : (
        <p className="text-center text-red-500 text-2xl font-semibold">
          {message.error}
        </p>
      )}
      <p className="cursor-pointer text-lg text-center" onClick={gobackHandler}>
        最初の画面へ戻る
      </p>
    </div>
  );
};

export default Confirmation;
