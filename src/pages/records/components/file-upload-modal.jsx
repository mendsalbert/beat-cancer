import React from "react";
import Modal from "./Modal";
import { IconProgress } from "@tabler/icons-react";

const FileUploadModal = ({
  isOpen,
  onClose,
  onFileChange,
  onFileUpload,
  uploading,
  uploadSuccess,
  filename,
}) => {
  return (
    <Modal
      title="Upload Reports"
      isOpen={isOpen}
      onClose={onClose}
      onAction={onFileUpload}
      actionLabel="Upload and Analyze"
    >
      <div className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 p-8 text-slate-700 dark:border-slate-700 dark:text-slate-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="currentColor"
          className="h-12 w-12 opacity-75"
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
              onChange={onFileChange}
            />
            Browse{" "}
          </label>
          or drag and drop here
        </div>
        <small id="validFileFormats">PNG, PDF, JPEG - Max 5MB</small>
      </div>
      {uploading && (
        <IconProgress
          size={15}
          className="mr-3 mt-3 h-7 w-5 animate-spin text-white"
        />
      )}

      {uploadSuccess && (
        <p className="mt-2 text-green-600">Upload successful!</p>
      )}
      <span className="text-md text-left text-white">{filename}</span>
    </Modal>
  );
};

export default FileUploadModal;
