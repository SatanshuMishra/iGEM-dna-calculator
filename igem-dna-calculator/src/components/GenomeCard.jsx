import React from "react";
import { useRef } from "react";
import { useHover } from "usehooks-ts";
import { AnimatePresence, motion } from "framer-motion";

import { FaTrash, FaPenToSquare } from "react-icons/fa6";

function GenomeCard(props) {
  const removeRef = useRef(null);
  const removeHover = useHover(removeRef);

  const editRef = useRef(null);
  const editHover = useHover(editRef);

  return (
    <AnimatePresence>
      <motion.div
        className="my-2 p-4 flex flex-row w-full justify-between rounded-md shadow-lg text-black bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          layout: {
            duration: 5,
          },
        }}
      >
        <div className="max-w-[60%] md:max-w-[80%]">
          <h1 className="text-lg pb-2 font-bold">{props.name}</h1>
          <p>{props.description}</p>
        </div>
        <div className="flex flex-col justify-end items-end">
          <button
            className="w-fit flex flex-row justify-center items-center text-center my-0.5 px-2 py-2 bg-red-600 rounded-lg font-medium text-white"
            onClick={null}
            ref={removeRef}
          >
            <motion.div
              className="h-full flex flex-col justify-center overflow-x-hidden"
              layout="position"
              transition={{
                layout: {
                  duration: 0.3,
                },
              }}
            >
              <FaTrash className="text-white text-sm" />
            </motion.div>
            {removeHover && (
              <AnimatePresence>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="ml-2 text-sm flex flex-col justify-center font-semibold h-[14px]"
                >
                  REMOVE
                </motion.p>
              </AnimatePresence>
            )}
          </button>
          <button
            className="w-fit flex flex-row justify-center items-center text-center my-0.5 px-2 py-2 bg-blue-600 rounded-lg font-medium text-white"
            onClick={null}
            ref={editRef}
          >
            <motion.div
              className="h-full flex flex-col justify-center overflow-x-hidden"
              layout="position"
              transition={{
                layout: {
                  duration: 0.3,
                },
              }}
            >
              <FaPenToSquare className="text-white text-sm" />
            </motion.div>
            {editHover && (
              <AnimatePresence>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="ml-2 text-sm flex flex-col justify-center font-semibold h-[14px]"
                >
                  EDIT
                </motion.p>
              </AnimatePresence>
            )}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default GenomeCard;
