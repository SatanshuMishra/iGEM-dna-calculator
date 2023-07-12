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

function GeneEditor() {
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
  const [invalidCharactersPresent, setInvalidCharactersPresent] =
    useState(false);

  const re = /[^ATGCWSMKRYBDHVN-]/i;
  const reg = /[^ATGCWSMKRYBDHVN-]/gi;

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
  const onChangeTextAreaHandler = () => {
    console.log("ENTERED UPDATE TEXT");
    const textArea = document.querySelector("#sequence-input");
    setInputValue(textArea.value);
    setInvalidCharactersPresent(re.test(textArea.value));
    textArea.style.height = "auto";
    let scrollHeight = textArea.scrollHeight;
    textArea.style.height =
      Math.floor(scrollHeight / 24) > 20 ? `480px` : `${scrollHeight}px`;
  };

  // PRESET SELECTOR FUNCTION -> USED WITHIN "PRESETSELECT" COMPONENT
  const selectPreset = (value, preset) => {
    setSelectedPreset(value);
    setSelectorMenuAValue(SelectorAData[preset[0]].value);
    setSelectorMenuBValue(SelectorBData[preset[1]].value);
  };

  // SELECTOR FUNCTIONS
  const setSelectedA = (value) => {
    setSelectedPreset("CUSTOM");
    setSelectorMenuAValue(value);
  };

  const setSelectedB = (value) => {
    setSelectedPreset("CUSTOM");
    setSelectorMenuBValue(value);
  };

  // CHECK IF VALID DATA HAS BEEN SELECTED & ENTERED
  const validateData = () => {
    return (
      selectorMenuAValue &&
      selectorMenuBValue &&
      selectorMenuBValue !== placeHolderText
    );
  };

  const getFormattedInput = () => {
    if (inputValue != "") {
      if (invalidCharactersPresent) {
        return inputValue.replace(reg, (str) => {
          return `<span style="background-color: #fa0a6a; color: #FFFFFF; padding: 1px 2px; margin: 0px 2px; border-radius:2px;">${str}</span>`;
        });
      } else return inputValue;
    } else {
      return `<span style="background-color: #fa0a6a; color: #FFFFFF; padding: 5px; margin: 10px; border-radius:4px;">PLACEHOLDER</span>`;
    }
  };

  // RETURN FORMATTED DATA
  const getFormattedData = () => {
    let formattedString =
      selectorMenuAValue + getFormattedInput() + selectorMenuBValue;
    console.log(
      "BEFORE: " + document.querySelector("#outputDisplay").innerHTML
    );
    document.querySelector("#outputDisplay").innerHTML = formattedString;
    console.log("AFTER: " + document.querySelector("#outputDisplay").innerHTML);
    // return selectorMenuAValue + getFormattedInput() + selectorMenuBValue;
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
    setInvalidCharactersPresent(false);
    document.querySelector("#sequence-input").value = "";
    document.querySelector("#outputDisplay").innerHTML = "";
  };

  const getInvalidIndecies = () => {
    // let match;
    // let str = "";
    // while ((match = reg.exec(inputValue)) != null) {
    //   console.log(match);
    //   str += match.index + ", ";
    // }
    // return str.substring(0, str.length - 2);
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
            selectedOption={setSelectedA}
          />
        </div>
        {/* SELECTOR B */}
        <div className="flex justify-between items-center">
          <h1 className="flex-none pr-6 font-semibold">{selectorBLabel}</h1>
          <SelectorMenu
            dataset={SelectorBData}
            value={selectorMenuBValue}
            selectedOption={setSelectedB}
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
            onInput={onChangeTextAreaHandler}
          />
          {/* {true && <Notification />} */}
          {invalidCharactersPresent && (
            <div className="w-full flex justify-between">
              <p className="text-red-600">
                Your input has invalid characters present at index
                {" " + getInvalidIndecies()}
              </p>
              <button
                className=" px-4 py-2 bg-emerald-600 rounded-lg text-white"
                onClick={() => {
                  const textArea = document.querySelector("#sequence-input");
                  textArea.value = inputValue.replaceAll(reg, "");
                  onChangeTextAreaHandler();
                }}
              >
                Remove Invalid Characters
              </button>
            </div>
          )}
          {!invalidCharactersPresent && inputValue != "" && (
            <p className="text-green-600">Your input is valid.</p>
          )}
        </div>
        <div className="flex flex-row w-full justify-between rounded-md shadow-lg text-black bg-gray-100">
          <div id="outputDisplay" className="p-2 break-all">
            {validateData() && getFormattedData()}
          </div>
          <div
            className=" flex flex-col justify-center pr-4 pl-4 pt-3 pb-2 bg-teal-600 rounded-tr-lg rounded-br-lg text-center cursor-pointer text-white"
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

export default GeneEditor;
