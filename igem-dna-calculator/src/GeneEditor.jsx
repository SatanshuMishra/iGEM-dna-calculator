import { useEffect, useState } from "react";
import { Slide, ToastContainer, toast } from "react-toastify";
import { FaCopy, FaCloudArrowUp } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

// COMPONENT IMPORTS
import SelectorMenu from "./components/SelectionMenu";
import SelectionComponent from "./components/SelectionComponent";
import GenomeCard from "./components/GenomeCard";
import InputComponent from "./components/InputComponent";

// DATA IMPORTS
import presetData from "./data/presets-data-set.json";
import prefixData from "./data/data-set-A.json";
import suffixData from "./data/data-set-B.json";
import exportData from "./data/export-formats.json";

function GeneEditor() {
  // CONFIG VARIABLES
  // CONFIGURE THE FOLLOWING VARIABLES TO SETUP THE CALCULATOR LABELS & BEHAVIOR
  let nameLabel = "NAME";
  let descriptionLabel = "DESCRIPTION";
  let namePlaceholder = "PLACEHOLDER";
  let descriptionPlaceholder = "PLACEHOLDER";
  let placeHolderText = "SELECT AN OPTION 👀"; // USED TO CHECK IF VALID SECOND OPTION HAS BEEN SELECTED
  let titleLabel = "GENOME EDITOR";
  let presetLabel = "SELECT PRESET";
  let prefixSelectorLabel = "SELECT PREFIX";
  let suffixLabel = "SELECT SUFFIX";
  let inputFieldLabel = "INPUT LABEL";
  let inputPlaceholderLabel = "PLACEHOLDER";

  // ---------------------------------------------------------------- //

  // STATE CONDITIONS //
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [preset, setPreset] = useState(presetData[0].value);
  const [prefix, setPrefix] = useState(prefixData[0].value);
  const [suffix, setSuffix] = useState(suffixData[0].value);
  const [inputValue, setInputValue] = useState("");
  const [invalidCharactersPresent, setInvalidCharactersPresent] =
    useState(false);
  const [exportType, setExportType] = useState(exportData[0].value);
  const [geneBank, setGeneBank] = useState([]);
  const [toastType, setToastType] = useState("");

  const re = /[^ATGCWSMKRYBDHVN-]/i;
  const reg = /[^ATGCWSMKRYBDHVN-]/gi;

  useEffect(() => {
    const data = JSON.parse(window.localStorage.getItem("BANK"));
    if (data) if (data.length !== 0) setGeneBank(data);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("BANK", JSON.stringify(geneBank));
    console.log(geneBank);
  }, [geneBank]);

  useEffect(() => {
    setInvalidCharactersPresent(re.test(inputValue));
  }, [inputValue]);

  // FUNCTION VARIABLES //
  // SUCCESS TOAST SETTINGS FUNCTIONS
  // TODO: ADD CONDITION FOR EMPTY COPY TO CLIPBOARD

  const notify = (type) => {
    setToastType(() => {
      return type.endsWith("Success") ? true : false;
    });
    switch (type) {
      case "copiedSuccess":
        toast("Copied to Clipboard", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        break;
      case "copyFailed":
        toast("Failed to Copy to Clipboard", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        break;
      case "addToBankSuccess":
        toast("Added to Genome Bank", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        break;
      case "addToBankFailed":
        toast("Failed to Add to Bank", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        break;
    }
  };

  const onChangeNameHandler = (value) => {
    setName(value);
  };

  const onChangeDescriptionHandler = (value) => {
    setDescription(value);
  };

  // UPDATE TEXT AREA VIEWPORT SIZE FUNCTION
  const onChangeTextAreaHandler = () => {
    const textArea = document.querySelector("#sequence-input");
    setInputValue(textArea.value);
    // setInvalidCharactersPresent(re.test(textArea.value));
    textArea.style.height = "auto";
    let scrollHeight = textArea.scrollHeight;
    textArea.style.height =
      Math.floor(scrollHeight / 24) > 20 ? `480px` : `${scrollHeight}px`;
  };

  // PRESET SELECTOR FUNCTION -> USED WITHIN "PRESETSELECT" COMPONENT
  const selectPreset = (value, preset) => {
    setPreset(value);
    setPrefix(prefixData[preset[0]].value);
    setSuffix(suffixData[preset[1]].value);
  };

  // SELECTOR FUNCTIONS
  const setSelectedPrefix = (value) => {
    setPreset("CUSTOM");
    setPrefix(value);
  };

  const setSelectedSuffix = (value) => {
    setPreset("CUSTOM");
    setSuffix(value);
  };

  // CHECK IF VALID DATA HAS BEEN SELECTED & ENTERED
  const validateData = () => {
    return prefix && suffix && suffix !== placeHolderText;
  };

  const getFormattedInput = () => {
    if (inputValue !== "") {
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
    let formattedString = prefix + getFormattedInput() + suffix;
    document.querySelector("#outputDisplay").innerHTML = formattedString;
  };

  // COPY TO CLIPBOARD
  const copyToClipboard = () => {
    navigator.clipboard.writeText(prefix + inputValue + suffix);
    notify("copiedSuccess");
    return true;
  };

  const bankGene = () => {
    setGeneBank(() => [
      ...geneBank,
      {
        name,
        description,
        prefix,
        suffix,
        inputValue,
      },
    ]);
    notify("addToBankSuccess");
    return true;
  };

  //RESET FUNCTION
  const reset = () => {
    setPreset(presetData[0].value);
    setPrefix(prefixData[0].value);
    setSuffix(suffixData[0].value);
    setInputValue("");
    setInvalidCharactersPresent(false);
    setName("empty");
    setDescription("empty");
    // document.querySelector("#name-field").value = "";
    // document.querySelector("#description-field").value = "";
    document.querySelector("#sequence-input").value = "";
    document.querySelector("#outputDisplay").innerHTML = "";
  };

  const clearBank = () => {
    setGeneBank([]);
  };

  return (
    <div className="m-10">
      {/* TOAST CONTAINER FOR SUCCESSFULLY COPIED TO CLIPBOARD */}
      <ToastContainer
        toastClassName={() =>
          `${toastType ? "bg-royal-green" : "bg-red-600"} rounded-3xl p-0 m-0`
        }
        bodyClassName={() =>
          "w-full h-full flex flex-row justify-center items-center text-md text-white text-center font-semibold font-med block p-3"
        }
        closeButton={false}
        position="bottom-center"
        autoClose={100000}
        limit={3}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        transition={Slide}
        theme="dark"
      />

      <div className="w-full p-6 rounded-lg bg-white">
        {/* HEADER */}
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-xl pb-4 font-black">{titleLabel}</h1>
          <button
            className="m-2 p-2 bg-pink-600 rounded-lg font-semibold text-white"
            onClick={reset}
          >
            RESET
          </button>
        </div>
        {/* NAME FIELD */}
        <InputComponent
          multiline={false}
          label={nameLabel}
          placeholder={namePlaceholder}
          value={name}
          inputHandler={onChangeNameHandler}
        />
        {/* DESCRIPTION FIELD */}
        <InputComponent
          multiline={true}
          label={descriptionLabel}
          placeholder={descriptionPlaceholder}
          value={description}
          inputHandler={onChangeDescriptionHandler}
        />
        {/* PRESET SELECTOR */}
        <SelectionComponent
          label={presetLabel}
          type={"preset"}
          dataset={presetData}
          value={preset}
          selectedOption={selectPreset}
        />
        {/* PREFIX SELECTOR*/}
        <SelectionComponent
          label={prefixSelectorLabel}
          type={"normal"}
          dataset={prefixData}
          value={prefix}
          selectedOption={setSelectedPrefix}
        />
        {/* SUFFIX SELECTOR*/}
        <SelectionComponent
          label={suffixLabel}
          type={"normal"}
          dataset={suffixData}
          value={suffix}
          selectedOption={setSelectedSuffix}
        />
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
          {invalidCharactersPresent && (
            <div className="w-full flex justify-between">
              <p className="text-red-600">Your input has invalid characters.</p>
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
          {!invalidCharactersPresent && inputValue !== "" && (
            <p className="text-green-600">Your input is valid.</p>
          )}
        </div>
        {/* OUTPUT BOX */}
        <div className="flex flex-col md:flex-row w-full justify-between rounded-md shadow-lg text-black bg-gray-50">
          {/* OUTPUT DISPLAY AREA */}
          <div id="outputDisplay" className="p-2 break-all">
            {validateData() && getFormattedData()}
          </div>
          {/* OPTIONS */}
          <div className="flex flex-col rounded-tr-lg rounded-br-lg cursor-pointer text-black">
            <div className="h-full flex justify-end p-1 md:p-0 text-white">
              <div
                //md:rounded-tl-none md:rounded-bl-none
                className="h-full flex flex-col justify-center px-3 py-3 rounded-tl-lg rounded-bl-lg  bg-blue-500 text-base"
                onClick={() => {
                  !(
                    name &&
                    validateData() &&
                    inputValue &&
                    !invalidCharactersPresent &&
                    bankGene()
                  ) && notify("addToBankFailed");
                }}
              >
                <FaCloudArrowUp />
              </div>
              <div
                className="h-full flex flex-col justify-center px-3 py-3 rounded-tr-lg rounded-br-lg bg-teal-500 text-base"
                onClick={() => {
                  !(
                    validateData() &&
                    inputValue &&
                    !invalidCharactersPresent &&
                    copyToClipboard()
                  ) && notify("copyFailed");
                }}
              >
                <FaCopy />
              </div>
            </div>
          </div>
        </div>
        {/* EXPORT SECTION */}
        {name &&
          description &&
          validateData() &&
          inputValue &&
          !invalidCharactersPresent && (
            <AnimatePresence>
              <motion.div
                className="flex flex-col justify-start items-start mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  layout: {
                    duration: 5,
                  },
                }}
              >
                <h1 className="flex-none pr-6 font-black">EXPORT</h1>
                <div className="flex w-full">
                  <div className="flex-grow">
                    <SelectorMenu
                      type={"normal"}
                      dataset={exportData}
                      value={exportType}
                      selectedOption={setExportType}
                    />
                  </div>
                  <button
                    className="m-2 p-2 bg-blue-500 rounded-lg font-semibold text-white"
                    onClick={null}
                  >
                    EXPORT
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

        {/* BANK SECTION */}
        <div className="mt-8 flex flex-col">
          {/* HEADER */}
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-xl pb-4 font-black h-full">GENOME BANK</h1>
            <button
              className="m-2 p-2 bg-pink-600 rounded-lg font-semibold text-white"
              onClick={clearBank}
            >
              EMPTY BANK
            </button>
          </div>
          {/* LIST SECTION */}
          <div>
            <AnimatePresence>
              {geneBank.length > 0
                ? geneBank.map((genome, i) => {
                    console.log(JSON.stringify(genome));
                    return (
                      <GenomeCard
                        key={i}
                        name={genome.name}
                        description={genome.description}
                      />
                    );
                  })
                : "NO GENOME'S HAVE BEEN SAVED"}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneEditor;
