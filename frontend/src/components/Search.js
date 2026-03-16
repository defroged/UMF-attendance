import React, { useState } from "react";

const Search = ({ onSubmit, searchHandler, message, initData }) => {
  const [searchValue, setSearchValue] = useState("");

  const onChangeHandler = (e) => {
    setSearchValue(e.target.value);
    searchHandler();
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    onSubmit(searchValue);
  };

  return (
    <div>
      <p className="text-2xl font-semibold text-center">
        ID番号を入れてください
      </p>
      <form
        className="w-full lg:w-6/12 m-auto mt-10"
        onSubmit={onSubmitHandler}
      >
        <input
          type="text"
          className="border border-gray-600 p-2 text-xl text-center font-bold outline-0 w-full"
          onChange={onChangeHandler}
        />
        <p
          className={`mt-4 text-center text-red-500 text-lg font-semibold ${
            message.error ? "opacity-100" : "opacity-0"
          }`}
        >
          {message.error}
        </p>
        <button
          className={`bg-blue-500 text-white p-2 text-md text-center outline-0 w-full mt-16 rounded-md ${
            initData.disableBtn && "opacity-50"
          }`}
          disabled={initData.disableBtn}
        >
          {initData.disableBtn ? "お待ちください..." : "送信"}
        </button>
      </form>
      {initData.message && (
        <p className="text-center text-red-500 text-lg font-semibold mt-5">
          {initData.message}
        </p>
      )}
    </div>
  );
};

export default Search;
