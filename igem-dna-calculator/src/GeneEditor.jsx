import { useEffect, useState } from "react";
import { Slide, ToastContainer, toast } from "react-toastify";
import { FaCopy, FaCloudArrowUp } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { jsonToFasta, jsonToGenbank } from "@teselagen/bio-parsers";

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
  let placeHolderText = suffixData[0].value; // USED TO CHECK IF VALID SECOND OPTION HAS BEEN SELECTED
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
  // const [exportFile, setExportFile] = useState();

  const [globalId, setGlobalId] = useState(0);
  const [currentId, setCurrentId] = useState(false);
  const [geneBank, setGeneBank] = useState([]);
  const [toastType, setToastType] = useState("");

  const re = /[^ATGCWSMKRYBDHVN-]/i;
  const reg = /[^ATGCWSMKRYBDHVN-]/gi;

  useEffect(() => {
    const id = JSON.parse(window.localStorage.getItem("GLOBAL_ID"));
    if (id) setGlobalId(id);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("GLOBAL_ID", JSON.stringify(globalId));
  }, [globalId]);

  useEffect(() => {
    const data = JSON.parse(window.localStorage.getItem("BANK"));
    if (data) if (data.length !== 0) setGeneBank(data);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("BANK", JSON.stringify(geneBank));
    // console.log(geneBank);
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
      case "deleteSuccess":
        toast("Gene Successfully Deleted", {
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
      case "geneEditSuccess":
        toast("Gene Successfully Edited", {
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
      case "resetSuccess":
        toast("Editor Reset Successfully!", {
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
      default:
        break;
    }
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

  // COLOR CODE INVALID CHARACTERS OR RETURN INPUT IF NOT INVALID CHARACTERS
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

  // ADD GENOME TO BANK
  const bankGene = () => {
    console.log(currentId);
    if (currentId !== false) {
      const index = geneBank.findIndex((gene) => gene.listId === currentId);
      const temp = geneBank;

      temp[index] = {
        currentId,
        name,
        description,
        prefix,
        suffix,
        inputValue,
      };

      setGeneBank(temp);
      window.localStorage.setItem("BANK", JSON.stringify(geneBank));

      setCurrentId(false);
      reset();
      notify("geneEditSuccess");
      return true;
    } else {
      const listId = globalId;
      setGeneBank(() => [
        ...geneBank,
        {
          listId,
          name,
          description,
          prefix,
          suffix,
          inputValue,
        },
      ]);
      setGlobalId(globalId + 1);
      notify("addToBankSuccess");
      reset();
      return true;
    }
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
    notify("resetSuccess");
  };

  const clearBank = () => {
    setGeneBank([]);
    setGlobalId(0);
  };

  const exportToFile = () => {
    const options = {
      isProtein: false,
      guessIfProtein: false,
      guessIfProteinOptions: {
        threshold: 0.9,
        dnaLetters: ["G", "A", "T", "C"],
      },
      inclusive1BasedStart: false,
      inclusive1BasedEnd: false,
    };
    switch (exportType) {
      case "FASTA (.fasta)":
        // let data = ``;
        // geneBank.forEach((genome) => {
        //   data += `>${genome.name} | ${genome.description}\n${
        //     genome.prefix + genome.inputValue + genome.suffix
        //   }\n`;
        // });
        // let blob = new Blob([data], { type: "text/plain" });
        // blob.lastModifiedDate = new Date();
        // blob.name = "fastaFile.fasta";

        // let link = document.createElement("a");
        // link.download = "fastaFile.fasta";
        // link.href = URL.createObjectURL(blob);
        // link.click();
        // URL.revokeObjectURL(link.href);

        let outputFastaString = ``;
        let fastaData = [];
        geneBank.forEach((genome) => {
          let sequence = genome.prefix + genome.inputValue + genome.suffix;
          let size = sequence.length;
          let name = genome.name;
          let description = genome.description;
          fastaData.push({
            size,
            sequence,
            circular: false,
            name,
            description,
            parts: [],
            primers: [],
            features: [],
          });
        });
        fastaData.forEach((el) => {
          outputFastaString += jsonToFasta(el, options) + "\n";
        });
        let fastaBlob = new Blob([outputFastaString], { type: "text/plain" });
        fastaBlob.lastModifiedDate = new Date();
        fastaBlob.name = "fastaFile.fasta";

        let fastaLink = document.createElement("a");
        fastaLink.download = "fastaBlob.fasta";
        fastaLink.href = URL.createObjectURL(fastaBlob);
        fastaLink.click();
        URL.revokeObjectURL(fastaLink.href);
        break;
      case "GenBank (.gb)":
        let outputString = ``;
        let genBankData = [];
        geneBank.forEach((genome) => {
          let sequence = genome.prefix + genome.inputValue + genome.suffix;
          let size = sequence.length;
          let name = genome.name;
          let description = genome.description;
          genBankData.push({
            size,
            sequence,
            circular: false,
            name,
            description,
            parts: [],
            primers: [],
            features: [],
          });
        });
        genBankData.forEach((gB) => {
          outputString += jsonToGenbank(gB, options) + "\n";
        });
        let genBlob = new Blob([outputString], { type: "text/plain" });
        genBlob.lastModifiedDate = new Date();
        genBlob.name = "genBlobFile.gb";

        let genLink = document.createElement("a");
        genLink.download = "genBlobFile.gb";
        genLink.href = URL.createObjectURL(genBlob);
        genLink.click();
        URL.revokeObjectURL(genLink.href);
        break;
      case "SnapGene (.dna)":
        console.log("EXPORT SNAPGENE");
        break;
      default:
        break;
    }
  };

  const editGenome = (listId) => {
    if (!name && !description && !inputValue) {
      let data = geneBank;
      let geneData = data.find((gene) => gene.listId === listId);
      if (geneData) {
        setCurrentId(listId);
        document.getElementById("name-field").value = geneData.name;
        setName(geneData.name);
        document.getElementById("description-field").value =
          geneData.description;
        setDescription(geneData.description);
        setPrefix(geneData.prefix);
        setSuffix(geneData.suffix);
        document.getElementById("sequence-input").value = geneData.inputValue;
        setInputValue(geneData.inputValue);
      }
    } else {
      // SHOW CONFIRMATION DIALOG
      console.log("Warning: Fields have data!");
      if (
        window.confirm(
          "Warning! Some of the fields have data in them! Are you sure you want to load the new data?"
        ) === true
      ) {
        let data = geneBank;
        let geneData = data.find((gene) => gene.listId === listId);
        if (geneData) {
          setCurrentId(listId);
          document.getElementById("name-field").value = geneData.name;
          setName(geneData.name);
          document.getElementById("description-field").value =
            geneData.description;
          setDescription(geneData.description);
          setPrefix(geneData.prefix);
          setSuffix(geneData.suffix);
          document.getElementById("sequence-input").value = geneData.inputValue;
          setInputValue(geneData.inputValue);
        }
      } else {
        return;
      }
    }
  };

  const removeGenome = (listId) => {
    let i = 0;
    let data = geneBank;
    for (i; i < data.length; i++) {
      if (data[i].listId === listId) break;
    }
    data.splice(i, 1);
    setGeneBank([...data]);
    if (geneBank.length === 0) setGlobalId(0);
    notify("deleteSuccess");
  };

  return (
    <div className="m-10">
      {/* TOAST CONTAINER FOR SUCCESSFULLY COPIED TO CLIPBOARD */}
      <ToastContainer
        toastClassName={() =>
          `${toastType ? "bg-royal-green" : "bg-red-600"} rounded-3xl p-0 my-2`
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
          id="name-field"
          multiline={false}
          label={nameLabel}
          placeholder={namePlaceholder}
          value={name}
          inputHandler={setName}
        />
        {/* DESCRIPTION FIELD */}
        <InputComponent
          id="description-field"
          multiline={true}
          label={descriptionLabel}
          placeholder={descriptionPlaceholder}
          value={description}
          inputHandler={setDescription}
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
        <div className="my-4">
          <InputComponent
            id="sequence-input"
            multiline={true}
            label={inputFieldLabel}
            placeholder={inputPlaceholderLabel}
            value={inputValue}
            inputHandler={setInputValue}
          />
          {invalidCharactersPresent && (
            <div className="w-full flex justify-between">
              <p className="text-red-600">Your input has invalid characters.</p>
              <button
                className=" px-4 py-2 bg-emerald-600 rounded-lg text-white"
                onClick={() => {
                  const textArea = document.querySelector("#sequence-input");
                  textArea.value = inputValue.replaceAll(reg, "");
                  setInputValue(textArea.value);
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
                    onClick={exportToFile}
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
                        listId={genome.listId}
                        name={genome.name}
                        description={genome.description}
                        onEdit={editGenome}
                        onDelete={removeGenome}
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
