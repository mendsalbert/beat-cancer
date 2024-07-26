//TODO: NOW WE HAVE BEEN ABLE TO GET THE AI WORKING
// WE HAVE TO MAKE SURE THE FILE UPLOAD UX IS GOOD, AND THINK OF WAY TO DISPLAY THE RESULTS
// WE ALMOST TRHOUGH WITH THIS PAGE
//LET THE AI GENERATE DATA FOR THE KANBAN BOARD OF THE TREATMENT
import React, { useState } from "react";
import {
  IconChevronRight,
  IconChevronsLeft,
  IconCirclePlus,
  IconFileUpload,
  IconFolderOpen,
  IconX,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import OpenAI from "openai";
import { updateRecrod } from "../../actions";
const apiKey = import.meta.env.VITE_API_KEY;
import ReactMarkdown from "react-markdown";
const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

function SingleRecordDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [processing, setisProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(
    state.analysis_result || ``
  );
  const [filename, setFilename] = useState("");
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setFilename(file.name);
    setFile(file);
  };

  const handleFileUpload = async () => {
    if (file) {
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("purpose", "fine-tune");

      try {
        const response = await openai.files.create({
          purpose: "assistants",
          file: formData.get("file"),
        });

        const assistant = await openai.beta.assistants.create({
          name: "AI recommended treatment planner",
          instructions:
            "You are an expert cancer and any diasease diagnonsis analyst. Use you knowledge base to answer questions about giving personalized recommended treatments  .",
          model: "gpt-4o",
          tools: [{ type: "file_search" }],
        });
        // A user wants to attach a file to a specific message, let's upload it.

        const thread = await openai.beta.threads.create({
          messages: [
            {
              role: "user",
              content:
                "give a detailed treatment plan for me, make it more readable, clear and easy to understand make it paragraphs to make it more readable",
              // Attach the new file to the message.
              attachments: [
                { file_id: response.id, tools: [{ type: "file_search" }] },
              ],
            },
          ],
        });

        // The thread now has a vector store in its tool resources.

        const stream = openai.beta.threads.runs
          .stream(thread.id, {
            assistant_id: assistant.id,
          })
          .on("textCreated", () => console.log("assistant >"))
          .on("toolCallCreated", (event) =>
            console.log("assistant " + event.type)
          )
          .on("messageDone", async (event) => {
            if (event.content[0].type === "text") {
              const { text } = event.content[0];
              const { annotations } = text;
              const citations = [];

              let index = 0;
              for (let annotation of annotations) {
                text.value = text.value.replace(
                  annotation.text,
                  "[" + index + "]"
                );
                const { file_citation } = annotation;
                if (file_citation) {
                  const citedFile = await openai.files.retrieve(
                    file_citation.file_id
                  );
                  citations.push("[" + index + "]" + citedFile.filename);
                }
                index++;
              }

              console.log(text.value);
              setAnalysisResult(text.value);
              const updateRecord = await updateRecrod({
                documentID: state.$id,
                analysis_result: text.value,
                kanban_records: "",
              });
              console.log(updateRecord);
              console.log(citations.join("\n"));
            }
          });

        console.log("stream", stream);
        setUploadSuccess(true);
        setFilename("");
        setUploadProgress(100);
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadSuccess(false);
        setUploadProgress(100);
      } finally {
        setUploading(false);
      }
    }
  };

  const processTreatmentPlan = async () => {
    setisProcessing(true);
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `using this treatment plan ${analysisResult} create  Columns:
                - Todo: Tasks that need to be started
                - Doing: Tasks that are in progress
                - Done: Tasks that are completed
          
                Each task should include a brief description. The tasks should be categorized appropriately based on the stage of the treatment process.
          
                Please use the following JSON format for the response:
          
                {
                  "columns": [
                    { "id": "todo", "title": "Todo" },
                    { "id": "doing", "title": "Work in progress" },
                    { "id": "done", "title": "Done" }
                  ],
                  "tasks": [
                    { "id": "1", "columnId": "todo", "content": "Example task 1" },
                    { "id": "2", "columnId": "todo", "content": "Example task 2" },
                    { "id": "3", "columnId": "doing", "content": "Example task 3" },
                    { "id": "4", "columnId": "doing", "content": "Example task 4" },
                    { "id": "5", "columnId": "done", "content": "Example task 5" }
                  ]
                }
          
                Use the treatment plan to create an effective Kanban board for managing the treatment.
                let your response to be only array in javascript return no other text and also removing the markdown quotes
                `,
        },
      ],
      model: "gpt-4o",
    });
    const results = chatCompletion.choices[0].message.content;
    const parsedResponse = JSON.parse(results);
    const updateRecord = await updateRecrod({
      documentID: state.$id,
      analysis_result: analysisResult,
      kanban_records: results,
    });
    navigate("/screening-schedules", { state: parsedResponse });
    setisProcessing(false);

    // console.log(parsedResponse);
  };

  console.log(state);

  return (
    <div className="flex flex-wrap gap-[26px]">
      <button
        type="button"
        onClick={handleOpenModal}
        className="py-2 px-4 mt-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-[#13131a] dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
      >
        <IconFileUpload />
        Upload Reports
      </button>{" "}
      {/* modal start */}
      <div
        id="hs-modal-recover-account"
        className="hs-overlay hidden fixed top-0 left-0 z-[80] w-full h-full bg-[#000000] bg-opacity-50 justify-center items-center"
      >
        <div className="relative bg-white border border-gray-100 rounded-xl shadow-sm dark:bg-[#13131a] dark:border-neutral-800 w-11/12 md:w-1/2 lg:w-1/3">
          <div className="p-4 sm:p-7">
            <div className="flex w-full max-w-xl text-center flex-col gap-1">
              <span className="w-fit pb-3 pl-0.5 text-lg text-slate-700 dark:text-slate-300">
                Upload Reports
              </span>
              <div className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 p-8 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="currentColor"
                  className="w-12 h-12 opacity-75"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.5 3.75a6 6 0 0 0-5.98 6.496A5.25 5.25 0 0 0 6.75 20.25H18a4.5 4.5 0 0 0 2.206-8.423 3.75 3.75 0 0 0-4.133-4.303A6.001 6.001 0 0 0 10.5 3.75Zm2.03 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v4.94a.75.75 0 0 0 1.5 0v-4.94l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="group">
                  <label
                    htmlFor="fileInputDragDrop"
                    className="cursor-pointer font-medium text-blue-700 group-focus-within:underline dark:text-blue-600"
                  >
                    <input
                      id="fileInputDragDrop"
                      type="file"
                      className="sr-only"
                      aria-describedby="validFileFormats"
                      onChange={handleFileChange}
                    />
                    Browse{" "}
                  </label>
                  or drag and drop here
                </div>
                <small id="validFileFormats">PNG, PDF, JPEG - Max 5MB</small>
              </div>
              {uploading && (
                <div role="status" className="mt-2">
                  <svg
                    aria-hidden="true"
                    class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              )}
              {uploadSuccess && (
                <p className="mt-2 text-green-600">Upload successful!</p>
              )}
              <span className="text-white text-left text-md">{filename}</span>
              <button
                type="button"
                onClick={handleFileUpload}
                className="mt-4 py-2 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                Upload and Analyze
              </button>
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
      {/* modal end */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
        <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-[#13131a] dark:border-neutral-800">
          <div className="p-4 md:p-5 flex justify-between gap-x-3">
            <div className="flex-shrink-0 flex justify-center items-center w-11 h-11 text-white rounded-full dark:text-blue-200">
              <IconFolderOpen size={70} className="text-green-500" />
            </div>
          </div>

          <a
            className="py-3 px-4 md:px-5 inline-flex justify-between items-center text-sm text-gray-600 border-t border-gray-200 hover:bg-gray-50 rounded-b-xl dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
            href="#"
          >
            {state.record_name}
          </a>
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-[#13131a] dark:border-neutral-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                    Personalized AI-Driven Treatment Plan
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    A tailored medical strategy leveraging advanced AI insights.
                  </p>
                </div>

                <div className="w-full flex text-white flex-col px-6 py-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Analysis Result
                    </h2>

                    <div className="space-y-2">
                      <ReactMarkdown>{analysisResult}</ReactMarkdown>
                    </div>
                  </div>

                  <div className="mt-5 grid sm:flex gap-2">
                    <button
                      type="button"
                      onClick={processTreatmentPlan}
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                    >
                      View Treatment plan
                      <IconChevronRight size={20} />
                      {processing && (
                        <div role="status" className="">
                          <svg
                            aria-hidden="true"
                            class="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      <span className="font-semibold text-gray-800 dark:text-neutral-200"></span>{" "}
                    </p>
                  </div>
                  <div>
                    <div className="inline-flex gap-x-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleRecordDetails;
