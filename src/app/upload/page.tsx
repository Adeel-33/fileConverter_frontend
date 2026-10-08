"use client";

import Link from "next/link";
import { useRef, useState } from "react";

function UploadIcon() {
  return (
    <svg
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} bytes`;

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function UploadContent() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  function selectFile(selectedFile?: File) {
    if (selectedFile) {
      setFile(selectedFile);

      // Remove the old converted file
      // when a new PDF is selected
      setConvertedFile(null);
    }
  }

  function handleDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files[0]);
  }

  const convertFileMethod = async () => {
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      setIsConverting(true);

      const response = await fetch("http://localhost:4000/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();

        alert(data.message || "Something went wrong");

        return;
      }

      // Get the converted DOCX file
      const blob = await response.blob();

      // Store the converted file
      // Instead of downloading it automatically
      setConvertedFile(blob);
    } catch (error) {
      console.error("Error converting file:", error);

      alert(
        "An error occurred while converting the file. Please try again."
      );
    } finally {
      setIsConverting(false);
    }
  };

  const downloadConvertedFile = () => {
    if (!convertedFile) return;

    const url = window.URL.createObjectURL(convertedFile);

    const link = document.createElement("a");

    link.href = url;
    link.download = "converted.docx";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            filedrop
          </Link>

        
        </div>
      </header>

      {/* Upload section */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            PDF to Word
          </h1>

          <p className="mt-3 text-gray-600">
            Convert your PDF files to editable Word documents.
          </p>
        </div>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`mt-10 rounded-2xl border-2 border-dashed p-12 text-center transition ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          <div className="flex flex-col items-center">
            <div className="text-gray-500">
              <UploadIcon />
            </div>

            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Drop your PDF file here
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              or click the button below to select a file
            </p>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer mt-6 rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              Choose File
            </button>

            <p className="mt-3 text-xs text-gray-400">
              PDF files only
            </p>

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,application/pdf"
              aria-label="Choose a PDF file to upload"
              className="hidden"
              onChange={(event) => {
                selectFile(event.target.files?.[0]);
              }}
            />
          </div>
        </div>

        {/* Selected file */}
        {file && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-gray-100 p-3 text-gray-600">
                  <FileIcon />
                </div>

                <div>
                  <p className="font-medium text-gray-900">
                    {file.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setConvertedFile(null);

                  if (inputRef.current) {
                    inputRef.current.value = "";
                  }
                }}
                className="cursor-pointer   text-sm font-medium text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {/* Convert button */}
        {file && (
          <button
            type="button"
            onClick={convertFileMethod}
            disabled={isConverting}
            className="cursor-pointer mt-6 w-full rounded-xl bg-gray-900 px-6 py-4 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isConverting ? "Converting..." : "Convert File"}
          </button>
        )}

        {/* Download button */}
        {convertedFile && (
          <button
            type="button"
            onClick={downloadConvertedFile}
            className="cursor-pointer mt-4 w-full rounded-xl bg-green-600 px-6 py-4 font-semibold text-white hover:bg-green-700"
          >
            Download converted file
          </button>
        )}

        {/* Second hidden input */}
        <input
          type="file"
          accept=".pdf,application/pdf"
          aria-label="Choose a different PDF file"
          className="hidden"
        />
      </section>
    </main>
  );
}

export default function UploadPage() {
  return <UploadContent />;
}