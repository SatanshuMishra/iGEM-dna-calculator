// PACKAGE IMPORTS
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
import Switch from "./components/Switch";

// DATA IMPORTS
import presetData from "./data/presets-data-set.json";
import prefixData from "./data/prefix-data.json";
import suffixData from "./data/suffix-data.json";
import recognitionSiteData from "./data/recognition-site-data.json";
import exportData from "./data/export-formats.json";

function GeneEditor() {
	// CONFIG VARIABLES
	// CONFIGURE THE FOLLOWING VARIABLES TO SETUP THE CALCULATOR LABELS & BEHAVIOR

	let appTitle = "DNAdapter";
	let settingsTitle = "CALCULATOR SETTINGS";
	let informationTitle = "DNA INFORMATION";
	let nameLabel = "Sequence Name";
	let namePlaceholder = "Enter the Name of Your DNA Sequence";
	let descriptionLabel = "Sequence Description";
	let descriptionPlaceholder = "Enter the Description of the DNA";
	let buildSequenceTitle = "DNA Sequence";
	let presetLabel = "Select Preset";
	let prefixLabel = "Select Prefix";
	let suffixLabel = "Select Suffix";
	let recognitionSiteLabel = "Select Recognition Site";
	let inputTitle = "INPUT SEQUENCE";
	let inputPlaceholderLabel = "Enter your DNA Sequence here";
	let resultTitle = "RESULT";
	let exportSequenceTitle = "EXPORT SEQUENCE";
	let bankTitle = "GENOME BANK";
	let exportBankTitle = "EXPORT BANK";

	// REGEX USED TO DEFINE THE VALID CHARACTERS
	// STRICT MODE REGEX
	let sre = /[^AGCT-]/i;
	let sreg = /[^AGCT-]/gi;

	// RELAXED MODE REGEX
	let re = /[^ATGCSMKYBDHVN-]/i;
	let reg = /[^ATGCSMKYBDHVN-]/gi;

	// ---------------------------------------------------------------- //

	// ~~~~~~ STATE CONDITIONS ~~~~~~ //
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [preset, setPreset] = useState(0);
	const [prefix, setPrefix] = useState(0);
	const [suffix, setSuffix] = useState(0);
	const [recognitionSite, setRecognitionSite] = useState(0);
	const [strictToggle, setStrictToggle] = useState(true);
	const [colorToggle, setColorToggle] = useState(true);
	const [inputValue, setInputValue] = useState("");
	const [invalidCharactersPresent, setInvalidCharactersPresent] = useState(false);
	const [exportSeqType, setExportSeqType] = useState(0);
	const [exportBankType, setExportBankType] = useState(0);
	const [globalId, setGlobalId] = useState(0);
	const [currentId, setCurrentId] = useState(false);
	const [geneBank, setGeneBank] = useState([]);
	const [toastType, setToastType] = useState("");

	// ON STRICT MODE TOGGLE, RE-CHECKS THE INPUT SEQUENCE
	useEffect(() => {
		// console.log("ASDASDASD")
		strictToggle && setInvalidCharactersPresent(sre.test(inputValue));
		!strictToggle && setInvalidCharactersPresent(re.test(inputValue));
		validateUserInput() && getFormattedData();
	}, [strictToggle]);

	// ON RELOAD, SETS CLIENT GLOBAL ID TO LOCAL STORAGE GLOBAL_ID IF IT EXISTS
	useEffect(() => {
		const id = JSON.parse(window.localStorage.getItem("GLOBAL_ID"));
		if (id) setGlobalId(id);
	}, []);

	// SETS LOCAL STORAGE GLOBAL_ID WHEN CLIENT GLOBAL ID CHANGES.
	useEffect(() => {
		window.localStorage.setItem("GLOBAL_ID", JSON.stringify(globalId));
		// setCurrentId(globalId);
	}, [globalId]);

	// ON RELOAD, SETS CLIENT BANK TO LOCAL STORAGE GENEBANK IF IT EXISTS
	useEffect(() => {
		const data = JSON.parse(window.localStorage.getItem("BANK"));
		if (data) if (data.length !== 0) setGeneBank(data);
	}, []);

	// WHEN CLIENT BANK CHANGES, UPDATES LOCAL STORAGE GENEBANK TO MATCH THE CHANGE
	useEffect(() => {
		window.localStorage.setItem("BANK", JSON.stringify(geneBank));
	}, [geneBank]);

	// WHEN THE INPUTED VALUE CHANGES, VALIDATES THE INPUT TO
	useEffect(() => {
		strictToggle && setInvalidCharactersPresent(sre.test(inputValue));
		!strictToggle && setInvalidCharactersPresent(re.test(inputValue));
	}, [inputValue]);

	// WHEN THE VALUE OF PREFIX, SUFFIX, OR RECOGNITION SITE CHANGES, WILL RUN THE ISPRESET FUNCTION TO CHECK IF A PRESET IS SELECTED
	useEffect(() => {
		console.log("PREFIX: ", prefix, "SUFFIX: ", suffix, "RECOGNITION SITE: ", recognitionSite);
		isPreset();
	}, [prefix, suffix, recognitionSite]);

	// ~~~~~~ FUNCTIONS ~~~~~~ //

	/**
	 * Configuration function for Toastify toast notification. This function determines what toast message will be displayed given a specific type.
	 * @param {String} type The type of toast message to display.
	 */

	const notify = type => {
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

	/**
	 * Selects the chosen preset. Updates the prefix, suffix and recognition site fields based upon the selected preset.
	 * @param {Number} type Index value of the chosen preset.
	 */
	const selectPreset = idx => {
		setPreset(idx);
		if (presetData[idx].id !== 998 && presetData[idx].id !== 999) {
			setPrefix(presetData[idx].preset[0]);
			setSuffix(presetData[idx].preset[1]);
			setRecognitionSite(presetData[idx].preset[2]);
		}
	};

	/**
	 * Using the values for prefix, suffix and recognition site fields, checks if a preset is selected. If a preset is selected, updates the preset field to represent the selected preset. Otherwise sets the preset field to custom.
	 */
	const isPreset = () => {
		// Checkes if the preset, suffix and recognition site indecies are equal to zero. If so, they are at their default values and set the preset field to its default value.
		if (prefix === 0 || suffix === 0 || recognitionSite === 0) {
			setPreset(0);
			return;
		}
		// Checks if the combination of prefix, suffix and recognition site are equal to a known preset. If so, returns the index of the preset. Otherwise, returns -1;
		let presetIdx = presetData.findIndex(
			p =>
				p.id !== 998 &&
				p.id !== 999 &&
				p.preset[0] === prefix &&
				p.preset[1] === suffix &&
				p.preset[2] === recognitionSite,
		);

		if (presetIdx !== -1) {
			setPreset(presetIdx);
		} else {
			setPreset(presetData.length - 1);
		}
	};

	/**
	 * Determines whether the prefix, suffix, recognition site and input value fields have valid data.
	 */
	const validateUserInput = () => {
		return (
			prefixData[prefix].id !== 998 &&
			suffixData[suffix].id !== 998 &&
			recognitionSiteData[recognitionSite].id !== 998 &&
			inputValue.trim() !== ""
		);
	};

	/**
	 * Checks whether invalid characters are present in the inputed value. If so, color codes each invalid character in red and returns the formatted input. Otherwise, returns
	 * @return {String} Formatted representation of the inputted text.
	 */
	const getFormattedInput = () => {
		if (inputValue !== "") {
			if (invalidCharactersPresent) {
				return inputValue.replace(strictToggle ? sreg : reg, str => {
					return `<span style="background-color: #ff0044; color: #FFFFFF; padding: 1px 2px; margin: 0px 2px; letter-spacing: 0px;">${str}</span>`;
				});
			} else return inputValue.toLocaleUpperCase();
		} else {
			return `<span style="background-color: #ff0044; color: #FFFFFF; padding: 5px; margin: 10px; border-radius:4px;">Please provide a valid input.</span>`;
		}
	};

	/**
	 * Color codes the output to allow users to identify different parts of the sequence.
	 * @return {String} Formatted representation of the result.
	 */
	const getFormattedData = () => {
		let formattedString = !!!!!!!!!colorToggle
			? "NNNNNN" +
			  recognitionSiteData[recognitionSite].prefix +
			  "NN" +
			  "CTCA" +
			  prefixData[prefix].value +
			  getFormattedInput() +
			  suffixData[suffix].value +
			  "CGAG" +
			  "NN" +
			  recognitionSiteData[recognitionSite].suffix +
			  "NNNNNN"
			: `<span style="background-color: #bfadd9; color: #000000; padding: 1px 2px; margin: 0px 0px; border-radius:2px 0 0 2px; letter-spacing: 3px;">${
					"NNNNNN" + recognitionSiteData[recognitionSite].prefix + "NN" + "CTCA"
			  }</span>` +
			  `<span style="background-color: ${presetData[preset].color["prefix&suffix"]}; color: ${presetData[preset].color["prefix&suffixText"]}; padding: 1px 2px; margin: 0px 0px; border-radius:0px; letter-spacing: 3px;">${prefixData[prefix].value}</span>` +
			  `<span style="background-color: ${presetData[preset].color["input"]}; color: ${
					presetData[preset].color["inputText"]
			  }; padding: 1px 2px; margin: 0px 0px; border-radius:0px; letter-spacing: 3px;">${getFormattedInput()}</span>` +
			  `<span style="background-color: ${presetData[preset].color["prefix&suffix"]}; color: ${presetData[preset].color["prefix&suffixText"]}; padding: 1px 2px; margin: 0px 0px; border-radius:0px; letter-spacing: 3px;">${suffixData[suffix].value}</span>` +
			  `<span style="background-color: #bfadd9; color: #000000; padding: 1px 2px; margin: 0px 0px; border-radius:0 2px 2px 0; letter-spacing: 3px;">${
					"CGAG" + "NN" + recognitionSiteData[recognitionSite].suffix + "NNNNNN"
			  }</span>`;
		document.querySelector("#outputDisplay").innerHTML = formattedString;
	};

	/**
	 * Copies the result to the clipboard. Triggers a success toast upon completion.
	 * @return {Boolean} Returns "true" if successful.
	 */
	const copyToClipboard = () => {
		navigator.clipboard.writeText(
			`NNNNNN` +
				recognitionSiteData.find(val => val.id === recognitionSite - 1).prefix +
				`NN` +
				prefixData[prefix].value +
				inputValue +
				suffixData[suffix].value +
				`NN` +
				recognitionSiteData.find(val => val.id === recognitionSite - 1).suffix +
				"NNNNNN",
		);
		notify("copiedSuccess");
		return true;
	};

	/**
	 * Adds or updates a sequence in the bank.

    If the sequence id already exists in the bank, this function updates
    its values with the new sequence data. Otherwise, it adds the sequence data
    as a new entry.

	 * @return {Boolean} Returns "true" if successful.
	 */
	const bankGene = () => {
		if (currentId !== false) {
			const index = geneBank.findIndex(gene => gene.listId === currentId);
			const dataset = geneBank;

			dataset[index] = {
				currentId,
				name,
				description,
				prefix,
				suffix,
				inputValue,
				recognitionSite,
				strictToggle,
			};

			setGeneBank(dataset);
			window.localStorage.setItem("BANK", JSON.stringify(geneBank));
			notify("geneEditSuccess");
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
					recognitionSite,
					strictToggle,
				},
			]);
			setGlobalId(globalId + 1);
			notify("addToBankSuccess");
		}
		reset(false);
		return true;
	};

	/**
	 * Resets all the fields to their default values.
	 * @param {boolean} checkEmpty Specifies whether to check if fields are empty before resetting them. Defaults to "true".
	 */
	const reset = (checkEmpty = true) => {
		const resetFields = () => {
			setPreset(0);
			setPrefix(0);
			setSuffix(0);
			setCurrentId(false);
			setInputValue("");
			setInvalidCharactersPresent(false);
			setName("empty");
			setDescription("empty");
			setStrictToggle(true);
			setRecognitionSite(0);
			document.querySelector("#sequence-input").value = "";
			document.querySelector("#outputDisplay").innerHTML = "";
			notify("resetSuccess");
		};

		if (checkEmpty) {
			if (!name && !description && !inputValue) {
				resetFields();
			} else {
				if (
					window.confirm(
						"Warning! Some of your fields have data in them. Are you sure you want to continue? All data will be permanently removed.",
					) === true
				) {
					resetFields();
				}
			}
		} else {
			resetFields();
		}
	};

	/**
	 * Empties the bank. Resets the global id to zero.
	 */
	const clearBank = () => {
		setGeneBank([]);
		setGlobalId(0);
	};

	/**
	 * Exports the data in the selected file format. Used for both sequence and bank export.
	 * @param {boolean} isBank Used to identify if the function is being called from the sequence or bank export sequence and determines the functionality of the function. Defaults to "true" if not specified.
	 */
	const exportToFile = (isBank = true) => {
		let data = [];
		if (isBank) {
			geneBank.forEach(genome => {
				let sequence =
					"NNNNNN" +
					recognitionSiteData[genome.recognitionSite].prefix +
					"NN" +
					"CTCA" +
					prefixData[genome.prefix].value +
					genome.inputValue +
					suffixData[genome.suffix].value +
					"CGAG" +
					"NN" +
					recognitionSiteData[recognitionSite].suffix +
					"NNNNNN";
				let size = sequence.length;
				let name = genome.name;
				let description = genome.description;
				data.push({
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
		} else {
			let sequence =
				"NNNNNN" +
				recognitionSiteData[recognitionSite].prefix +
				"NN" +
				"CTCA" +
				prefixData[prefix].value +
				inputValue +
				suffixData[suffix].value +
				"CGAG" +
				"NN" +
				recognitionSiteData[recognitionSite].suffix +
				"NNNNNN";
			let size = sequence.length;
			data.push({
				size,
				sequence,
				circular: false,
				name,
				description,
				parts: [],
				primers: [],
				features: [],
			});
		}

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
		let type = isBank ? exportData[exportBankType].value : exportData[exportSeqType].value;
		switch (type) {
			case "FASTA (.fasta)":
				let outputFastaString = ``;
				data.forEach(el => {
					outputFastaString += jsonToFasta(el, options) + "\n";
				});
				let fastaBlob = new Blob([outputFastaString], {
					type: "text/plain",
				});
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
				data.forEach(gB => {
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
			default:
				break;
		}
	};

	/**
	 * Checks if the selected values for prefix, suffix, and recognition site are a prefix. If a prefix is found, returns it's index.
	 * @param {Number} prefix
	 * @param {Number} suffix
	 * @param {Number|Boolean} idx Retruns the index value of the preset found. Otherwise returns "false"
	 */
	const findPreset = (prefix, suffix) => {
		let preset = presetData.findIndex(
			p =>
				p.id !== 998 && p.id !== 999 && p.preset.toString() === [prefix, suffix].toString(),
		);
		console.log(presetData[2].preset.toString() === [prefix, suffix].toString());
		return preset === -1 ? false : preset;
	};

	/**
	 * Gets the sequence in the bank and updates all the fields to reflect the values of that sequence.
	 * @param {Number} listId List ID of the sequence used to identify the sequence.
	 */
	const editGenome = listId => {
		if (
			!name &&
			!description &&
			!inputValue &&
			prefix === 0 &&
			suffix === 0 &&
			recognitionSite === 0
		) {
			let data = geneBank;
			let geneData = data.find(gene => gene.listId === listId);
			if (geneData) {
				setCurrentId(listId);
				document.getElementById("name-field").value = geneData.name;
				setName(geneData.name);
				document.getElementById("description-field").value = geneData.description;
				setDescription(geneData.description);
				setStrictToggle(geneData.strictToggle);
				let preset = findPreset(geneData.prefix, geneData.suffix);
				if (preset) {
					selectPreset(preset);
				} else {
					setPreset(presetData.length - 1);
					setPrefix(geneData.prefix);
					setSuffix(geneData.suffix);
				}
				setRecognitionSite(geneData.recognitionSite);
				document.getElementById("sequence-input").value = geneData.inputValue;
				setInputValue(geneData.inputValue);
			}
		} else {
			// SHOW CONFIRMATION DIALOG
			if (
				window.confirm(
					"Warning! Some of the fields have data in them! Are you sure you want to load the new data?",
				) === true
			) {
				let data = geneBank;
				let geneData = data.find(gene => gene.listId === listId);
				if (geneData) {
					setCurrentId(listId);
					document.getElementById("name-field").value = geneData.name;
					setName(geneData.name);
					document.getElementById("description-field").value = geneData.description;
					setDescription(geneData.description);
					setPrefix(geneData.prefix);
					setSuffix(geneData.suffix);
					setRecognitionSite(geneData.recognitionSite);
					document.getElementById("sequence-input").value = geneData.inputValue;
					setInputValue(geneData.inputValue);
				}
			} else {
				return;
			}
		}
	};

	// REMOVING A SEQUENCE FROM THE BANK
	/**
	 * Gets the sequence in the bank and removes it from the bank.
	 * @param {Number} listId List ID of the sequence used to identify the sequence.
	 */
	const removeGenome = listId => {
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
				<section>
					<div className="flex flex-row justify-between items-center mb-2">
						<h1 className="text-3xl font-black">{appTitle}</h1>
						<button
							className="m-2 p-2 bg-pink-600 rounded-lg font-semibold text-white"
							onClick={reset}>
							RESET
						</button>
					</div>
					{/* CALCULATOR SETTINGS */}
					<div className="flex flex-row justify-between items-center mb-2">
						<h1 className="text-xl pb-2 font-bold">{settingsTitle}</h1>
						<div className="flex flex-row items-center">
							<div className="m-2 flex flex-col items-center justify-center">
								<p className="flex-none font-normal py-1">STRICT MODE</p>
								<Switch
									toggle={strictToggle}
									setToggle={setStrictToggle}
								/>
							</div>
							<div className="m-2 flex flex-col items-center justify-center">
								<p className="flex-none font-normal py-1">COLOR MODE</p>
								<Switch
									toggle={colorToggle}
									setToggle={setColorToggle}
								/>
							</div>
						</div>
					</div>
				</section>
				{/* DNA INFORMATION */}
				<section>
					<div className="mb-2">
						<h1 className="text-xl pb-2 font-bold">{informationTitle}</h1>
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
					</div>
				</section>
				{/* DNA SEQUENCE */}
				<section>
					<div className="mb-2">
						<h1 className="text-xl pb-2 font-bold">{buildSequenceTitle}</h1>
						<p className="flex-none font-normal pt-1 pb-2">
							CHOOSE FROM THE SELECTION OF PRESET SEQUENCES IN{" "}
							<span className="text-royal-yellow font-bold">Lv0FP</span>:
						</p>
						{/* PRESET SELECTOR */}
						<SelectionComponent
							label={presetLabel}
							type={"preset"}
							dataset={presetData}
							value={presetData[preset].value}
							selectedOption={selectPreset}
						/>

						{/* <p className="flex-none font-normal py-2">
                        </p> */}

						<hr className="h-px" />

						{/* PREFIX SELECTOR*/}
						<SelectionComponent
							label={prefixLabel}
							type={"normal"}
							dataset={prefixData}
							value={prefixData[prefix].value}
							selectedOption={setPrefix}
						/>
						{/* SUFFIX SELECTOR*/}
						<SelectionComponent
							label={suffixLabel}
							type={"normal"}
							dataset={suffixData}
							value={suffixData[suffix].value}
							selectedOption={setSuffix}
						/>
						{/* RECOGNITION SITE SELECTOR*/}
						<SelectionComponent
							label={recognitionSiteLabel}
							type={"normal"}
							dataset={recognitionSiteData}
							value={recognitionSiteData[recognitionSite].value}
							selectedOption={setRecognitionSite}
						/>
					</div>
				</section>
				{/* INPUT SEQUENCE */}
				<section>
					<div className="mb-2">
						<h1 className="text-xl pb-2 font-bold">{inputTitle}</h1>
						<p className="flex-none font-normal py-1">INPUT YOUR SEQUENCE BELOW:</p>
						{/* INPUT FIELD */}
						<InputComponent
							id="sequence-input"
							multiline={true}
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
										textArea.value = inputValue.replaceAll(
											strictToggle ? sreg : reg,
											"",
										);
										setInputValue(textArea.value);
									}}>
									Remove Invalid Characters
								</button>
							</div>
						)}
						{!invalidCharactersPresent && inputValue !== "" && (
							<p className="text-green-600">Your input is valid.</p>
						)}
					</div>
				</section>
				{/* RESULT */}
				<section>
					<div className="mb-2">
						<h1 className="text-xl pb-2 font-bold">{resultTitle}</h1>
						{/* OUTPUT BOX */}
						<div className="flex flex-col md:flex-row w-full justify-between rounded-md shadow-lg text-black bg-gray-50">
							{/* OUTPUT DISPLAY AREA */}
							<div
								id="outputDisplay"
								className="p-2 break-all">
								{validateUserInput() ? getFormattedData() : ""}
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
												validateUserInput() &&
												inputValue &&
												!invalidCharactersPresent &&
												bankGene()
											) && notify("addToBankFailed");
										}}>
										<FaCloudArrowUp />
									</div>
									<div
										className="h-full flex flex-col justify-center px-3 py-3 rounded-tr-lg rounded-br-lg bg-teal-500 text-base"
										onClick={() => {
											!(
												validateUserInput() &&
												inputValue &&
												!invalidCharactersPresent &&
												copyToClipboard()
											) && notify("copyFailed");
										}}>
										<FaCopy />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				{/* EXPORT ACTIVE SEQUENCE SECTION */}
				{name &&
					description &&
					validateUserInput() &&
					inputValue &&
					!invalidCharactersPresent && (
						<section>
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
									}}>
									<h1 className="flex-none text-xl pb-2 font-bold">
										{exportSequenceTitle}
									</h1>
									<p className="flex-none font-normal py-1">
										EXPORT YOUR SEQUENCE IN YOUR PREFERED FORMAT 🙂:
									</p>
									<div className="flex w-full">
										<div className="flex-grow">
											<SelectorMenu
												type={"normal"}
												dataset={exportData}
												value={exportData[exportSeqType].value}
												selectedOption={setExportSeqType}
											/>
										</div>
										<button
											className="m-2 p-2 bg-blue-500 rounded-lg font-semibold text-white"
											onClick={() => exportToFile(false)}>
											EXPORT
										</button>
									</div>
								</motion.div>
							</AnimatePresence>
						</section>
					)}
				{/* BANK SECTION */}
				<section>
					<div className="mt-8 flex flex-col">
						{/* HEADER */}
						<div className="flex flex-row justify-between items-center">
							<h1 className="text-xl pb-2 font-bold h-full">{bankTitle}</h1>
							<button
								className="m-2 p-2 bg-pink-600 rounded-lg font-semibold text-white"
								onClick={clearBank}>
								EMPTY BANK
							</button>
						</div>
						{/* LIST SECTION */}
						<div>
							<AnimatePresence>
								{geneBank.length > 0
									? geneBank.map((genome, i) => {
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
									: "NO GENOMES HAVE BEEN SAVED"}
							</AnimatePresence>
						</div>
					</div>
					{/* EXPORT SECTION */}
					{geneBank.length > 0 && (
						<section>
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
									}}>
									<h1 className="flex-none text-xl pb-2 font-bold">
										{exportBankTitle}
									</h1>
									<p className="flex-none font-normal py-1">
										EXPORT YOUR BANK IN YOUR PREFERED FORMAT:
									</p>
									<div className="flex w-full">
										<div className="flex-grow">
											<SelectorMenu
												type={"normal"}
												dataset={exportData}
												value={exportData[exportBankType].value}
												selectedOption={setExportBankType}
											/>
										</div>
										<button
											className="m-2 p-2 bg-blue-500 rounded-lg font-semibold text-white"
											onClick={exportToFile}>
											EXPORT
										</button>
									</div>
								</motion.div>
							</AnimatePresence>
						</section>
					)}
				</section>
			</div>
		</div>
	);
}

export default GeneEditor;
