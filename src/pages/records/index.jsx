import React, { useState, useEffect } from "react";
import {
  IconChevronRight,
  IconCirclePlus,
  IconFolder,
  IconX,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { createRecord, getAllRecordData } from "../../actions";
import { usePrivy } from "@privy-io/react-auth";

function Index() {
  const navigate = useNavigate();
  const [foldername, setFoldername] = useState("");
  const { user } = usePrivy();
  const [userRecords, setUserRecords] = useState([]);

  useEffect(() => {
    const cachedRecords = localStorage.getItem("userRecords");
    if (cachedRecords) {
      setUserRecords(JSON.parse(cachedRecords));
    }

    getAllRecordData()
      .then(({ documents }) => {
        const filteredRecords = documents.filter(
          (record) => record.user_id === user.id
        );
        setUserRecords(filteredRecords);
        localStorage.setItem("userRecords", JSON.stringify(filteredRecords));
      })
      .catch((e) => {
        console.log(e);
      });
  }, [user]);

  const handleOpenModal = () => {
    const modal = document.getElementById("hs-modal-recover-account");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  };

  const handleCloseModal = () => {
    const modal = document.getElementById("hs-modal-recover-account");
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  };

  const createFolder = () => {
    createRecord({
      user_id: user.id,
      record_name: foldername,
      analysis_result: "",
      kanban_records: "",
    })
      .then(() => {
        getAllRecordData().then(({ documents }) => {
          const filteredRecords = documents.filter(
            (record) => record.user_id === user.id
          );
          setUserRecords(filteredRecords);
          localStorage.setItem("userRecords", JSON.stringify(filteredRecords));
          setFoldername("");
          handleCloseModal();
        });
      })
      .catch((e) => {
        console.log(e);
        setFoldername("");
        handleCloseModal();
      });
  };

  const handleNavigate = (name) => {
    const filteredRecords = userRecords.filter(
      (record) => record.record_name === name
    );
    console.log(filteredRecords[0]);

    navigate(`/medical-records/${name}`, {
      state: filteredRecords[0],
    });
  };

  return (
    <div className="flex flex-wrap gap-[26px]">
      <button
        type="button"
        className="py-2 px-4 mt-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-[#13131a] dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
        onClick={handleOpenModal}
      >
        <IconCirclePlus />
        Create Record
      </button>

      <div
        id="hs-modal-recover-account"
        className="hs-overlay hidden fixed top-0 left-0 z-[80] w-full h-full bg-[#000000] bg-opacity-50 justify-center items-center"
      >
        <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-[#13131a] dark:border-neutral-800 w-11/12 md:w-1/2 lg:w-1/3">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h2 className="block text-2xl font-bold text-gray-800 dark:text-neutral-200">
                Create Records
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                Enter the records details below.
              </p>
            </div>

            <div className="mt-5">
              <div className="grid gap-y-4">
                <div>
                  <label
                    htmlFor="folder-name"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Record Name
                  </label>
                  <div className="relative">
                    <input
                      value={foldername}
                      onChange={(e) => {
                        setFoldername(e.target.value);
                      }}
                      type="text"
                      className="py-3 px-4 block w-full  rounded-lg text-sm  disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:placeholder-neutral-500 border-2 focus:outline-none focus:border-2"
                      required
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    createFolder();
                  }}
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Create Folder
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 text-gray-800 hover:text-gray-600 dark:text-neutral-200 dark:hover:text-neutral-400"
          >
            <IconX />
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
        {userRecords?.map((record) => (
          <div
            key={record.record_name}
            className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-[#13131a] dark:border-neutral-800"
          >
            <div className="p-4 md:p-5 flex justify-between gap-x-3">
              <div className="flex-shrink-0 flex justify-center items-center w-11 h-11 text-white rounded-full dark:text-blue-200">
                <IconFolder size={70} className="text-green-500" />
              </div>
            </div>

            <a
              onClick={() => handleNavigate(record.record_name)}
              className="py-3 px-4 md:px-5 inline-flex justify-between items-center text-sm text-gray-600 border-t border-gray-200 hover:bg-gray-50 rounded-b-xl dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 cursor-pointer"
            >
              {record.record_name}
              <IconChevronRight />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Index;
