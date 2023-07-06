import { useState } from "react";
import SelectorMenu from "./components/SelectorMenu";
import SelectorAData from "./data/data-set-A.json";
import SelectorBData from "./data/data-set-B.json";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { RxCopy } from "react-icons/rx";

function App() {
  const [valueA, setValueA] = useState("");
  const [valueB, setValueB] = useState("");
  const selectedValueA = (value) => {
    setValueA(value);
  };
  const selectedValueB = (value) => {
    setValueB(value);
  };

  const notify = () =>
    toast.success("Copied to Clipboard.", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  return (
    <div className="m-10">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
      <div className="bg-white w-full p-6 rounded-lg">
        <h1 className="text-xl font-black pb-4">ENTER TITLE HERE</h1>
        <div className="flex justify-between items-center">
          <h1 className="pr-6 flex-none font-semibold">ENTER FIELD TITLE</h1>
          <SelectorMenu
            dataset={SelectorAData}
            selectedValue={selectedValueA}
          />
        </div>
        <div className="flex justify-between items-center">
          <h1 className="pr-6 flex-none font-semibold">ENTER FIELD TITLE</h1>
          <SelectorMenu
            dataset={SelectorBData}
            selectedValue={selectedValueB}
          />
        </div>
        <div className="m-2 mt-4 h-10 text-black bg-gray-100 pl-4 text-base rounded-md text-left shadow-lg flex justify-end">
          <div className="grow p-2">
            {valueA && valueB ? valueA + " " + valueB : ""}
          </div>
          <div
            className="pr-4 pl-4 pt-3 pb-2 text-white  bg-teal-500 rounded-tr-lg rounded-br-lg text-center cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(
                valueA && valueB ? valueA + " " + valueB : ""
              );
              notify();
            }}
          >
            <RxCopy />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
