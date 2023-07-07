import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { RxCopy } from "react-icons/rx";
import "react-toastify/dist/ReactToastify.css";

// CUSTOM IMPORTS
import SelectorMenu from "./components/SelectorMenu";
import PresetsData from "./data/presets-data-set.json";
import SelectorAData from "./data/data-set-A.json";
import SelectorBData from "./data/data-set-B.json";
import PresetSelector from "./components/PresetSelector";

function App() {
  // CONFIG VARIABLES
  // CONFIGURE THE FOLLOWING VARIABLES TO SETUP THE CALCULATOR LABELS & BEHAVIOR
  let placeHolderText = "SELECT AN OPTION 👀"; // USED TO CHECK IF VALID SECOND OPTION HAS BEEN SELECTED
  let titleLabel = "TITLE LABEL";
  let presetLabel = "PRESET FIELD LABEL";
  let selectorALabel = "SELECTION LABEL";
  let selectorBLabel = "SELECTION LABEL";
  let inputFieldLabel = "INPUT LABEL";
  let inputPlaceholderLabel = "PLACEHOLDER";

  // ---------------------------------------------------------------- //

  // STATE CONDITIONS //
  const [selectedPreset, setSelectedPreset] = useState(PresetsData[0].value);
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

  // FUNCTION VARIABLES //
  // SUCCESS TOAST SETTINGS FUNCTIONS
  // TODO: ADD CONDITION FOR EMPTY COPY TO CLIPBOARD
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

  // UPDATE TEXT AREA VIEWPORT SIZE FUNCTION
  const updateTextAreaViewport = () => {
    const textArea = document.querySelector("#sequence-input");
    textArea.addEventListener("input", (e) => {
      textArea.style.height = "auto";
      let scrollHeight = e.target.scrollHeight;
      textArea.style.height =
        Math.floor(scrollHeight / 24) > 20 ? `480px` : `${scrollHeight}px`;
    });
  };

  // PRESET SELECTOR FUNCTION -> USED WITHIN "PRESETSELECT" COMPONENT
  const selectPreset = (value, preset) => {
    setSelectedPreset(value);
    setSelectorMenuAValue(SelectorAData[preset[0]].value);
    setSelectorMenuBValue(SelectorBData[preset[1]].value);
  };

  // CHECK IF VALID DATA HAS BEEN SELECTED & ENTERED
  const validateData = () => {
    return (
      selectorMenuAValue &&
      selectorMenuBValue &&
      selectorMenuBValue !== placeHolderText &&
      inputValue
    );
  };

  // RETURN FORMATTED DATA
  const getFormattedData = () => {
    return selectorMenuAValue + " " + inputValue + " " + selectorMenuBValue;
  };

  // COPY TO CLIPBOARD
  const copyToClipboard = () => {
    navigator.clipboard.writeText(getFormattedData());
    notify();
  };

  //RESET FUNCTION
  const reset = () => {
    setSelectedPreset(PresetsData[0].value);
    setSelectorMenuAValue(SelectorAData[0].value);
    setSelectorMenuBValue(SelectorBData[0].value);
    setInputValue("");
    document.querySelector("#sequence-input").value = "";
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

      <div className="w-full p-6 rounded-lg bg-white">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-xl pb-4 font-black">{titleLabel}</h1>
          <button
            className="m-2 p-2 bg-pink-600 rounded-lg font-semibold text-white"
            onClick={reset}
          >
            RESET
          </button>
        </div>
        {/* PRESET SELECTOR */}
        <div className="flex justify-between items-center">
          <h1 className="flex-none pr-6 font-semibold">{presetLabel}</h1>
          <PresetSelector
            dataset={PresetsData}
            value={selectedPreset}
            selectedPreset={selectPreset}
          />
        </div>
        {/* SELECTOR A */}
        <div className="flex justify-between items-center">
          <h1 className="flex-none pr-6 font-semibold">{selectorALabel}</h1>
          <SelectorMenu
            dataset={SelectorAData}
            value={selectorMenuAValue}
            selectedOption={setSelectorMenuAValue}
          />
        </div>
        {/* SELECTOR B */}
        <div className="flex justify-between items-center">
          <h1 className="flex-none pr-6 font-semibold">{selectorBLabel}</h1>
          <SelectorMenu
            dataset={SelectorBData}
            value={selectorMenuBValue}
            selectedOption={setSelectorMenuBValue}
          />
        </div>
        {/* INPUT FIELD */}
        <div className=" my-4 flex flex-col justify-between items-start">
          <h1 className="flex-none pr-6 font-semibold">{inputFieldLabel}</h1>
          <textarea
            id="sequence-input"
            type="text"
            className="my-4 h-auto w-full resize-none pl-4 p-2 text-base rounded-md text-left cursor-text leading-6 shadow-lg text-black bg-gray-100"
            rows={1}
            placeholder={inputPlaceholderLabel}
            onChange={updateTextAreaViewport}
          />
        </div>
        <div className="flex justify-end my-2 mt-4 h-auto pl-2 text-base rounded-md text-left shadow-lg text-black bg-gray-100">
          <div className="grow p-2">
            {validateData()
              ? getFormattedData()
              : "PLEASE SELECT OR ENTER VALID DATA ABOVE."}
          </div>
          <div
            className="pr-4 pl-4 pt-3 pb-2 bg-teal-600 rounded-tr-lg rounded-br-lg text-center cursor-pointer text-white"
            onClick={() => {
              (validateData() && copyToClipboard()) ||
                console.log("DEBUG: PLEASE SELECT OR ENTER VALID DATA");
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
