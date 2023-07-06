import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { RxCopy } from "react-icons/rx";
import "react-toastify/dist/ReactToastify.css";

// CUSTOM IMPORTS
import SelectorMenu from "./components/SelectorMenu";
import PresetsDate from "./data/presets-data-set.json";
import SelectorAData from "./data/data-set-A.json";
import SelectorBData from "./data/data-set-B.json";
import PresetSelector from "./components/PresetSelector";

function App() {
  // CONFIG VARIABLES
  let placeHolderText = "SELECT AN OPTION 👀";

  // STATE CONDITIONS
  const [selectorMenuAValue, setSelectorMenuAValue] = useState(
    SelectorAData[0].value
  );
  const [selectorMenuBValue, setSelectorMenuBValue] = useState(
    SelectorBData[0].value
  );
  const [inputValue, setInputValue] = useState("");

  document.addEventListener("input", () => {
    setInputValue(document.querySelector("#sequence-input").value.trim());
  });

  const updateTextAreaViewport = () => {
    const textArea = document.querySelector("#sequence-input");
    textArea.addEventListener("input", (e) => {
      textArea.style.height = "auto";
      let scrollHeight = e.target.scrollHeight;
      textArea.style.height =
        Math.floor(scrollHeight / 24) > 20 ? `480px` : `${scrollHeight}px`;
    });
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

  const selectPreset = (preset) => {
    console.log("Preset: " + SelectorAData[preset[0]].value);
    setSelectorMenuAValue(SelectorAData[preset[0]].value);
    setSelectorMenuBValue(SelectorBData[preset[1]].value);
  };

  return (
    <div className="m-10">
      {/* TOAST CONTAINER FOR SUCCESSFULLY COPIED TO CLIPBOARD */}
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
          <PresetSelector dataset={PresetsDate} selectedPreset={selectPreset} />
        </div>
        <div className="flex justify-between items-center">
          <h1 className="pr-6 flex-none font-semibold">ENTER FIELD TITLE</h1>
          <SelectorMenu
            dataset={SelectorAData}
            value={selectorMenuAValue}
            selectedOption={setSelectorMenuAValue}
          />
        </div>
        <div className="flex justify-between items-center">
          <h1 className="pr-6 flex-none font-semibold">ENTER FIELD TITLE</h1>
          <SelectorMenu
            dataset={SelectorBData}
            value={selectorMenuBValue}
            selectedOption={setSelectorMenuBValue}
          />
        </div>
        <div className=" my-4 flex flex-col justify-between items-start">
          <h1 className="pr-6 flex-none font-semibold">ENTER FIELD TITLE</h1>
          <textarea
            id="sequence-input"
            type="text"
            className="my-4 h-auto resize-none w-full text-black bg-gray-100 pl-4 p-2 text-base rounded-md text-left shadow-lg  cursor-text leading-6"
            rows={1}
            placeholder="PLACEHOLDER TEXT"
            onChange={updateTextAreaViewport}
          />
        </div>
        <div className="my-2 mt-4 h-auto text-black bg-gray-100 pl-4 text-base rounded-md text-left shadow-lg flex justify-end">
          <div className="grow p-2">
            {selectorMenuAValue &&
            selectorMenuBValue &&
            selectorMenuBValue !== placeHolderText &&
            inputValue
              ? selectorMenuAValue + " " + inputValue + " " + selectorMenuBValue
              : "PLEASE SELECT OR ENTER VALID DATA ABOVE."}
          </div>
          <div
            className="pr-4 pl-4 pt-3 pb-2 text-white  bg-teal-500 rounded-tr-lg rounded-br-lg text-center cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(
                selectorMenuAValue && selectorMenuBValue && inputValue
                  ? selectorMenuAValue +
                      " " +
                      inputValue +
                      " " +
                      selectorMenuBValue
                  : ""
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
