import React from "react";
import Modal from "./Modal";

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
        <div role="status" className="mt-2">
          <svg
            aria-hidden="true"
            className="inline h-8 w-8 animate-spin fill-green-500 text-gray-200 dark:text-gray-600"
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
      <span className="text-md text-left text-white">{filename}</span>
    </Modal>
  );
};

export default FileUploadModal;
