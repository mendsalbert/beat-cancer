import React, { useState, useEffect } from "react";
import { IconCirclePlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useStateContext } from "../../context/index";
import CreateRecordModal from "./components/create-record-modal"; // Adjust the import path
import RecordCard from "./components/record-card"; // Adjust the import path

const Index = () => {
  const navigate = useNavigate();
  const { user } = usePrivy();
  const {
    records,
    fetchUserRecords,
    createRecord,
    fetchUserByEmail,
    currentUser,
  } = useStateContext();
  const [userRecords, setUserRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserByEmail(user.email.address);
      fetchUserRecords(user.email.address);
    }
  }, [user, fetchUserByEmail, fetchUserRecords]);

  useEffect(() => {
    setUserRecords(records);
    localStorage.setItem("userRecords", JSON.stringify(records));
  }, [records]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const createFolder = async (foldername) => {
    try {
      if (currentUser) {
        const newRecord = await createRecord({
          userId: currentUser.id,
          recordName: foldername,
          analysisResult: "",
          kanbanRecords: "",
          createdBy: user.email.address,
        });

        if (newRecord) {
          fetchUserRecords(user.email.address);
          handleCloseModal();
        }
      }
    } catch (e) {
      console.log(e);
      handleCloseModal();
    }
  };

  const handleNavigate = (name) => {
    const filteredRecords = userRecords.filter(
      (record) => record.recordName === name,
    );
    navigate(`/medical-records/${name}`, {
      state: filteredRecords[0],
    });
  };

  return (
    <div className="flex flex-wrap gap-[26px]">
      <button
        type="button"
        className="mt-6 inline-flex items-center gap-x-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-[#13131a] dark:text-white dark:hover:bg-neutral-800"
        onClick={handleOpenModal}
      >
        <IconCirclePlus />
        Create Record
      </button>

      <CreateRecordModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreate={createFolder}
      />

      <div className="grid w-full gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {userRecords?.map((record) => (
          <RecordCard
            key={record.recordName}
            record={record}
            onNavigate={handleNavigate}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
