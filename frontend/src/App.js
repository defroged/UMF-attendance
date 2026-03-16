import React, { useEffect, useState } from "react";
import Axios from "axios";
import moment from "moment";
import Search from "./components/Search";
import Confirmation from "./components/Confirmation";
import baseUrl from "./utils/baseUrl";

const App = () => {
  const [page, setPage] = useState("search");
  const [data, setData] = useState([]);
  const [findStudent, setFindStudent] = useState({});
  const [message, setMessage] = useState({
    success: "",
    error: "",
  });
  const [btnPress, setBtnPress] = useState(false);
  const [initData, setInitData] = useState({
    disableBtn: true,
    message: "",
  });

  useEffect(() => {
    Axios.get(`${baseUrl}/getdata`)
      .then((res) => {
        setData(res.data);
        setInitData({
          disableBtn: false,
          message: "",
        });
      })
      .catch(() => {
        setInitData({
          disableBtn: false,
          message: "ページをリロードして、もう一度お試しください。",
        });
      });
  }, []);

  const onSubmit = (value) => {
    const findData = data.find((el) => el.ID.toString() === value);
    if (findData && findData.name) {
      setFindStudent(findData);
      setPage("confirmation");
    } else {
      setMessage({
        success: "",
        error: "そのID番号がありません",
      });
    }
  };

  const searchHandler = () => {
    setMessage({
      success: "",
      error: "",
    });
  };

  const confirmHandler = (value) => {
    const sheetName = moment(new Date()).format("MMM Do");
    const timestamp = moment(new Date()).format("LLL");
    const obj = {
      sheetName: sheetName,
      timestamp: timestamp,
      name: findStudent.name,
      id: findStudent.ID,
    };
    if (findStudent.name) {
      if (value === "yes") {
        setBtnPress(true);
        Axios.post(`${baseUrl}/adddata`, obj)
          .then(() => {
            setMessage({
              success: "出席の確認ができました！",
              error: "",
            });
            setBtnPress(false);
          })
          .catch((err) => {
            setBtnPress(false);
            console.log(err);
          });
      } else {
        setMessage({
          success: "",
          error: "お近くのスタッフにご確認下さい",
        });
      }
    }
  };

  const gobackHandler = () => {
    setPage("search");
    setMessage({
      success: "",
      error: "",
    });
    setFindStudent({});
    setBtnPress(false);
  };

  return (
    <div className="w-10/12 sm:w-4/12 m-auto mt-20 border border-gray-600 p-5 sm:p-10">
      {page === "search" && (
        <Search
          onSubmit={onSubmit}
          searchHandler={searchHandler}
          message={message}
          initData={initData}
        />
      )}
      {page === "confirmation" && (
        <Confirmation
          findStudent={findStudent}
          confirmHandler={confirmHandler}
          message={message}
          gobackHandler={gobackHandler}
          btnPress={btnPress}
        />
      )}
    </div>
  );
};

export default App;
