import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconAlertCircle,
  IconChevronRight,
  IconCircleDashedCheck,
  IconFolder,
  IconHourglassHigh,
  IconUserScan,
} from "@tabler/icons-react";
import { usePrivy } from "@privy-io/react-auth";
import { getAllRecordData } from "../actions";

const DisplayInfo = () => {
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
            (record) => record.user_id === user.id,
          );
          setUserRecords(filteredRecords);

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
                  (column) => column.title === "AI Personalized Treatment",
                )
                  ? 1
                  : 0;
                totalScreenings += kanban[0].tasks.length;
                completedScreenings += kanban[0].tasks.filter(
                  (task) => task.columnId === "done",
                ).length;
                pendingScreenings += kanban[0].tasks.filter(
                  (task) => task.columnId === "doing",
                ).length;
                overdueScreenings += kanban[0].tasks.filter(
                  (task) => task.columnId === "overdue",
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
      <div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
        <span className="text-center text-2xl font-bold text-gray-800 dark:text-white">
          {percentage}%
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-[26px]">
      <div className="mt-7 grid w-full gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
        <div className="flex w-full flex-col rounded-xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-[#13131a]">
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
                getProgress(metrics.pendingScreenings, metrics.totalScreenings),
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col rounded-xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-[#13131a]">
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

            <div className="">
              {renderCircularProgressBar(
                getProgress(
                  metrics.completedScreenings,
                  metrics.totalScreenings,
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[9px] grid w-full gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <div className="flex flex-col rounded-xl border bg-white shadow-sm dark:border-neutral-800 dark:bg-[#13131a]">
          <div className="flex justify-between gap-x-3 p-4 md:p-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                Total <br /> Folders
              </p>
              <div className="mt-1 flex items-center gap-x-2">
                <h3 className="text-xl font-medium text-gray-800 sm:text-2xl dark:text-neutral-200">
                  {metrics.totalFolders}
                </h3>
              </div>
            </div>
            <div className="flex size-[46px] h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-[#1c1c24] dark:text-blue-200">
              <IconFolder size={25} className="text-green-500" />
            </div>
          </div>

          <a
            className="inline-flex items-center justify-between rounded-b-xl border-t border-gray-200 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 md:px-5 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
            href="#"
          >
            View
            <IconChevronRight />
          </a>
        </div>

        <div className="flex flex-col rounded-xl border bg-white shadow-sm dark:border-neutral-800 dark:bg-[#13131a]">
          <div className="flex justify-between gap-x-3 p-4 md:p-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                Total <br /> Screenings
              </p>
              <div className="mt-1 flex items-center gap-x-2">
                <h3 className="text-xl font-medium text-gray-800 sm:text-2xl dark:text-neutral-200">
                  {metrics.totalScreenings}
                </h3>
              </div>
            </div>
            <div className="flex size-[46px] h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-[#1c1c24] dark:text-blue-200">
              <IconUserScan size={25} className="text-green-500" />
            </div>
          </div>

          <a
            className="inline-flex items-center justify-between rounded-b-xl border-t border-gray-200 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 md:px-5 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
            href="#"
          >
            View
            <IconChevronRight />
          </a>
        </div>

        <div className="flex flex-col rounded-xl border bg-white shadow-sm dark:border-neutral-800 dark:bg-[#13131a]">
          <div className="flex justify-between gap-x-3 p-4 md:p-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                Completed <br /> Screenings
              </p>
              <div className="mt-1 flex items-center gap-x-2">
                <h3 className="text-xl font-medium text-gray-800 sm:text-2xl dark:text-neutral-200">
                  {metrics.completedScreenings}
                </h3>
              </div>
            </div>
            <div className="flex size-[46px] h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-[#1c1c24] dark:text-blue-200">
              <IconCircleDashedCheck size={25} className="text-green-500" />
            </div>
          </div>

          <a
            className="inline-flex items-center justify-between rounded-b-xl border-t border-gray-200 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 md:px-5 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
            href="#"
          >
            View
            <IconChevronRight />
          </a>
        </div>

        <div className="flex flex-col rounded-xl border bg-white shadow-sm dark:border-neutral-800 dark:bg-[#13131a]">
          <div className="flex justify-between gap-x-3 p-4 md:p-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                Pending <br /> Screenings
              </p>
              <div className="mt-1 flex items-center gap-x-2">
                <h3 className="text-xl font-medium text-gray-800 sm:text-2xl dark:text-neutral-200">
                  {metrics.pendingScreenings}
                </h3>
              </div>
            </div>
            <div className="flex size-[46px] h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-[#1c1c24] dark:text-blue-200">
              <IconHourglassHigh size={25} className="text-green-500" />
            </div>
          </div>

          <a
            className="inline-flex items-center justify-between rounded-b-xl border-t border-gray-200 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 md:px-5 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
            href="#"
          >
            View
            <IconChevronRight />
          </a>
        </div>

        <div className="flex flex-col rounded-xl border bg-white shadow-sm dark:border-neutral-800 dark:bg-[#13131a]">
          <div className="flex justify-between gap-x-3 p-4 md:p-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                Overdue <br /> Screenings
              </p>
              <div className="mt-1 flex items-center gap-x-2">
                <h3 className="text-xl font-medium text-gray-800 sm:text-2xl dark:text-neutral-200">
                  {metrics.overdueScreenings}
                </h3>
              </div>
            </div>
            <div className="flex size-[46px] h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-[#1c1c24] dark:text-blue-200">
              <IconAlertCircle size={25} className="text-green-500" />
            </div>
          </div>

          <a
            className="inline-flex items-center justify-between rounded-b-xl border-t border-gray-200 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 md:px-5 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
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

export default DisplayInfo;
