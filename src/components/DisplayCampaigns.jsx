import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconAi,
  IconAlertCircle,
  IconChevronRight,
  IconCircleDashedCheck,
  IconFolder,
  IconHourglassHigh,
  IconUserScan,
} from "@tabler/icons-react";
import { usePrivy } from "@privy-io/react-auth";
import { getAllRecordData } from "../actions";

const DisplayCampaigns = () => {
  const navigate = useNavigate();
  const { user } = usePrivy();
  const [userRecords, setUserRecords] = useState([]);
  const [metrics, setMetrics] = useState({
    totalFolders: 0,
    aiPersonalizedTreatment: 0,
    totalScreenings: 0,
    completedScreenings: 0,
    pendingScreenings: 0,
    overdueScreenings: 0,
  });

  useEffect(() => {
    if (user) {
      getAllRecordData()
        .then(({ documents }) => {
          const filteredRecords = documents.filter(
            (record) => record.user_id === user.id
          );
          setUserRecords(filteredRecords);

          // Calculate metrics
          const totalFolders = filteredRecords.length;
          let aiPersonalizedTreatment = 0;
          let totalScreenings = 0;
          let completedScreenings = 0;
          let pendingScreenings = 0;
          let overdueScreenings = 0;

          filteredRecords.forEach((record) => {
            if (record.kanban_records) {
              try {
                const kanban = JSON.parse(record.kanban_records);
                aiPersonalizedTreatment += kanban[0].columns.some(
                  (column) => column.title === "AI Personalized Treatment"
                )
                  ? 1
                  : 0;
                totalScreenings += kanban[0].tasks.length;
                completedScreenings += kanban[0].tasks.filter(
                  (task) => task.columnId === "done"
                ).length;
                pendingScreenings += kanban[0].tasks.filter(
                  (task) => task.columnId === "doing"
                ).length;
                overdueScreenings += kanban[0].tasks.filter(
                  (task) => task.columnId === "overdue"
                ).length;
              } catch (error) {
                console.error("Failed to parse kanban_records:", error);
              }
            }
          });

          setMetrics({
            totalFolders,
            aiPersonalizedTreatment,
            totalScreenings,
            completedScreenings,
            pendingScreenings,
            overdueScreenings,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [user]);

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  const getProgress = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const renderCircularProgressBar = (percentage) => (
    <div className="relative size-28">
      <svg
        className="size-full"
        width="26"
        height="26"
        viewBox="0 0 36 36"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-current text-gray-200 dark:text-neutral-700"
          strokeWidth="3"
        ></circle>
        <g className="origin-center -rotate-90 transform">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-current text-green-600 dark:text-green-500"
            strokeWidth="3"
            strokeDasharray="100"
            strokeDashoffset={100 - percentage}
          ></circle>
        </g>
      </svg>
      <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <span className="text-center text-2xl font-bold text-gray-800 dark:text-white">
          {percentage}%
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-[26px]">
      <div className="grid sm:grid-cols-2 mt-7 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
        <div className="flex flex-col w-full bg-white border shadow-sm rounded-xl dark:bg-[#13131a] dark:border-neutral-800 p-4">
          <div className="flex justify-between gap-x-3">
            <div>
              <p className="text-lg tracking-wide text-gray-500 dark:text-neutral-500">
                Specialist Appointments Pending
              </p>
              <div className="mt-1 flex items-center gap-x-2">
                <h3 className="text-md font-medium text-gray-800 dark:text-neutral-200">
                  You have appointments with specialists that need your
                  attention. Please review and complete them.
                </h3>
              </div>
            </div>
            <div className="">
              {renderCircularProgressBar(
                getProgress(metrics.pendingScreenings, metrics.totalScreenings)
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full bg-white border shadow-sm rounded-xl dark:bg-[#13131a] dark:border-neutral-800 p-4">
          <div className="flex justify-between gap-x-3">
            <div>
              <p className="text-lg tracking-wide text-gray-500 dark:text-neutral-500">
                Treatment Progress Update{" "}
              </p>
              <div className="mt-1 flex items-center gap-x-2">
                <h3 className="text-md font-medium text-gray-800 dark:text-neutral-200">
                  Great job! You've completed 3 specialist visits. Keep up the
                  excellent progress.{" "}
                </h3>
              </div>
            </div>
            {/* <div className="justify-center items-center text-7xl"> */}
            {/* <span className="">🏆</span> */}
            <div className="">
              {renderCircularProgressBar(
                getProgress(
                  metrics.completedScreenings,
                  metrics.totalScreenings
                )
              )}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 mt-[9px] lg:grid-cols-4 gap-4 sm:gap-6 w-full">
        <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-[#13131a] dark:border-neutral-800">
          <div className="p-4 md:p-5 flex justify-between gap-x-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                Total <br /> Folders
              </p>
              <div className="mt-1 flex items-center gap-x-2">
                <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                  {metrics.totalFolders}
                </h3>
              </div>
            </div>
            <div className="flex-shrink-0 flex justify-center items-center w-11 h-11 size-[46px] bg-blue-600 text-white rounded-full dark:bg-[#1c1c24] dark:text-blue-200">
              <IconFolder size={25} className="text-green-500" />
            </div>
          </div>

          <a
            className="py-3 px-4 md:px-5 inline-flex justify-between items-center text-sm text-gray-600 border-t border-gray-200 hover:bg-gray-50 rounded-b-xl dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
            href="#"
          >
            View
            <IconChevronRight />
          </a>
        </div>

        <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-[#13131a] dark:border-neutral-800">
          <div className="p-4 md:p-5 flex justify-between gap-x-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                Total <br /> Screenings
              </p>
              <div className="mt-1 flex items-center gap-x-2">
                <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                  {metrics.totalScreenings}
                </h3>
              </div>
            </div>
            <div className="flex-shrink-0 flex justify-center items-center w-11 h-11 size-[46px] bg-blue-600 text-white rounded-full dark:bg-[#1c1c24] dark:text-blue-200">
              <IconUserScan size={25} className="text-green-500" />
            </div>
          </div>

          <a
            className="py-3 px-4 md:px-5 inline-flex justify-between items-center text-sm text-gray-600 border-t border-gray-200 hover:bg-gray-50 rounded-b-xl dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
            href="#"
          >
            View
            <IconChevronRight />
          </a>
        </div>

        <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-[#13131a] dark:border-neutral-800">
          <div className="p-4 md:p-5 flex justify-between gap-x-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                Completed <br /> Screenings
              </p>
              <div className="mt-1 flex items-center gap-x-2">
                <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                  {metrics.completedScreenings}
                </h3>
              </div>
            </div>
            <div className="flex-shrink-0 flex justify-center items-center w-11 h-11 size-[46px] bg-blue-600 text-white rounded-full dark:bg-[#1c1c24] dark:text-blue-200">
              <IconCircleDashedCheck size={25} className="text-green-500" />
            </div>
          </div>

          <a
            className="py-3 px-4 md:px-5 inline-flex justify-between items-center text-sm text-gray-600 border-t border-gray-200 hover:bg-gray-50 rounded-b-xl dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
            href="#"
          >
            View
            <IconChevronRight />
          </a>
        </div>

        <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-[#13131a] dark:border-neutral-800">
          <div className="p-4 md:p-5 flex justify-between gap-x-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                Pending <br /> Screenings
              </p>
              <div className="mt-1 flex items-center gap-x-2">
                <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                  {metrics.pendingScreenings}
                </h3>
              </div>
            </div>
            <div className="flex-shrink-0 flex justify-center items-center w-11 h-11 size-[46px] bg-blue-600 text-white rounded-full dark:bg-[#1c1c24] dark:text-blue-200">
              <IconHourglassHigh size={25} className="text-green-500" />
            </div>
          </div>

          <a
            className="py-3 px-4 md:px-5 inline-flex justify-between items-center text-sm text-gray-600 border-t border-gray-200 hover:bg-gray-50 rounded-b-xl dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
            href="#"
          >
            View
            <IconChevronRight />
          </a>
        </div>

        <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-[#13131a] dark:border-neutral-800">
          <div className="p-4 md:p-5 flex justify-between gap-x-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                Overdue <br /> Screenings
              </p>
              <div className="mt-1 flex items-center gap-x-2">
                <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                  {metrics.overdueScreenings}
                </h3>
              </div>
            </div>
            <div className="flex-shrink-0 flex justify-center items-center w-11 h-11 size-[46px] bg-blue-600 text-white rounded-full dark:bg-[#1c1c24] dark:text-blue-200">
              <IconAlertCircle size={25} className="text-green-500" />
            </div>
          </div>

          <a
            className="py-3 px-4 md:px-5 inline-flex justify-between items-center text-sm text-gray-600 border-t border-gray-200 hover:bg-gray-50 rounded-b-xl dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
            href="#"
          >
            View
            <IconChevronRight />
          </a>
        </div>
      </div>
    </div>
  );
};

export default DisplayCampaigns;
