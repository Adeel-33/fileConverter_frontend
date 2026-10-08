"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";

function UploadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="size-6"
    >
      <path
        d="M12 15V3m0 0L7.5 7.5M12 3l4.5 4.5M5 14.5v3A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="size-6"
    >
      <path
        d="M13.5 3.75H7.75A1.75 1.75 0 0 0 6 5.5v13A1.75 1.75 0 0 0 7.75 20.25h8.5A1.75 1.75 0 0 0 18 18.5V8.25l-4.5-4.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M13.25 4v4.5h4.5M9 13h6m-6 3.25h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} bytes`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024)
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function UploadContent() {
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const conversionType = searchParams.get("type");

  const isPdfToWord = conversionType === "pdf-to-word";
  const isWordToPdf = conversionType === "word-to-pdf";
  const conversionLabel = isPdfToWord
    ? "PDF to Word"
    : isWordToPdf
      ? "Word to PDF"
      : "Choose a format";
  const acceptedFileType = isPdfToWord ? ".pdf,application/pdf" : ".doc,.docx";
  const acceptedFileLabel = isPdfToWord ? "PDF" : "Word";

  function selectFile(selectedFile?: File) {
    if (selectedFile) setFile(selectedFile);
  }

  function handleDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files[0]);
  }
 
 const convertFileMethod = async () => {

  try{

  if (!file) return;
  
  const formData = new FormData();

  formData.append("file", file);
  formData.append("type", conversionType || "");
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

const blob = await response.blob();
setConvertedFile(blob);
  }catch (error) {
    console.error("Error converting file:", error);
    alert("An error occurred while converting the file. Please try again.");
  }finally{
    setIsConverting(false);
  }

};

const downloadConvertedFile = () => {
  if (!convertedFile) return;
  setIsDownloading(true);
  const url = window.URL.createObjectURL(convertedFile);
  const link = document.createElement("a");
  link.href = url;
  link.download = isPdfToWord ? "converted.docx" : "converted.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
  setIsDownloading(false);
}
  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_50%_43%,rgba(232,237,255,0.72),transparent_48%),#f5f7fb] px-5 sm:px-[6.25%]">
      <header className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center justify-between border-b border-[#e7eaf1] sm:h-[84px]">
        <Link
          className="inline-flex items-center gap-2.5 text-[18px] font-bold tracking-[-0.6px] text-[#202942] no-underline"
          href="/"
          aria-label="Filedrop home"
        >
          <span className="grid size-8 place-items-center rounded-[10px] bg-[#4355d9] text-white">
            <UploadIcon />
          </span>
          <span>filedrop</span>
        </Link>
        <span className="text-[13px] font-medium text-[#68738a]">
          {conversionLabel}
        </span>
      </header>

      <main className="grid flex-1 place-items-center py-[34px] sm:py-14">
        <section
          className="w-full max-w-[600px] rounded-[17px] border border-[#e9ecf3] bg-white/[0.95] p-6 shadow-[0_24px_70px_rgba(38,51,91,0.08),0_2px_8px_rgba(38,51,91,0.03)] sm:rounded-[20px] sm:p-12"
          aria-labelledby="page-title"
        >
          <div className="mb-[18px] text-center">
            <span className="mb-3 inline-block text-[10px] font-bold tracking-[1.7px] text-[#4355d9]">
              FILE UPLOAD
            </span>
            <h1
              className="m-0 text-[clamp(27px,4vw,34px)] font-semibold leading-[1.2] tracking-[-1.25px] text-[#1b2439]"
              id="page-title"
            >
              {conversionLabel}
            </h1>
            <p className="mt-[11px] text-sm leading-[1.6] text-[#778197]">
              Choose a {acceptedFileLabel} file from your device to get started.
            </p>
          </div>

          <div className="mb-5 flex flex-wrap items-start justify-between gap-3.5 rounded-xl border border-[#e4eaf7] bg-[#f7f9ff] p-3 sm:items-center">
            <span className="inline-flex items-center rounded-full bg-[#edf0ff] px-[9px] py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4355d9]">
              Selected format
            </span>
            <strong className="text-sm font-bold text-[#1c2740]">
              {conversionLabel}
            </strong>
            <Link
              className="rounded-[9px] border border-[#dde3f3] bg-white px-3 py-[9px] text-xs font-semibold text-[#46516d] no-underline hover:bg-[#f8f9ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4355d9]"
              href="/"
            >
              Change format
            </Link>
          </div>

          {!file ? (
            <div
              className={`group relative flex min-h-[270px] flex-col items-center justify-center overflow-hidden rounded-[14px] border-[1.5px] border-dashed px-[14px] py-[26px] text-center transition duration-150 sm:min-h-[294px] sm:px-[22px] sm:py-8 ${
                isDragging
                  ? "border-[#7c89e9] bg-[#f7f8ff] shadow-[inset_0_0_0_1px_#7c89e9]"
                  : "border-[#ccd3e5] bg-[#fbfcff] hover:border-[#7c89e9] hover:bg-[#f7f8ff]"
              }`}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                  setIsDragging(false);
                }
              }}
              onDrop={handleDrop}
            >
              <input
                accept={acceptedFileType}
                aria-label={`Choose a ${acceptedFileLabel} file to upload`}
                className="absolute inset-0 z-10 size-full cursor-pointer opacity-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4355d9]"
                onChange={(event) => {
                  selectFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
                ref={inputRef}
                type="file"
              />
              <div className="mb-[17px] grid size-[54px] place-items-center rounded-2xl border border-[#e4e8ff] bg-[#eff1ff] text-[#4355d9]">
                <UploadIcon />
              </div>
              <h2 className="m-0 text-[15px] font-semibold tracking-[-0.15px] text-[#252e43]">
                Drag and drop your file here
              </h2>
              <p className="my-2 mb-3 text-xs text-[#929bad]">or</p>
              <button
                className="pointer-events-none min-h-[42px] rounded-[9px] bg-[#4355d9] px-[19px] text-[13px] font-semibold text-white shadow-[0_3px_7px_rgba(67,85,217,0.2)] transition hover:bg-[#3545c4] active:translate-y-px"
                onClick={() => inputRef.current?.click()}
                type="button"
              >
                Browse files
              </button>
              <p className="mt-[15px] text-[11px] text-[#8992a5]">
                {isPdfToWord
                  ? "PDF files only"
                  : isWordToPdf
                    ? "DOC or DOCX files only"
                    : "PDF, DOC, or DOCX files"}
              </p>
            </div>
          ) : (
            <>
              <div
                className="grid min-h-[100px] grid-cols-[40px_minmax(0,1fr)] items-center gap-3 rounded-[13px] border border-[#e5e9f2] bg-[#fcfcfe] p-[15px] sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:gap-[15px] sm:p-[18px]"
                aria-live="polite"
              >
                <span className="grid size-10 place-items-center rounded-[11px] bg-[#eff1ff] text-[#4355d9] sm:size-11">
                  <FileIcon />
                </span>
                <span className="flex min-w-0 flex-col gap-[5px]">
                  <span
                    className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-semibold text-[#273149]"
                    title={file.name}
                  >
                    {file.name}
                  </span>
                  <span className="text-[11px] text-[#818ba0]">
                    {formatFileSize(file.size)}
                  </span>
                </span>
                <span className="col-start-2 row-start-2 justify-self-start rounded-full bg-[#eaf7f0] px-[9px] py-[5px] text-[10px] font-semibold text-[#268354] sm:col-auto sm:row-auto">
                  Selected
                </span>
                <div className="col-start-2 row-start-3 flex items-center gap-[18px] sm:col-[2/-1] sm:row-auto sm:gap-4">
                  <button
                    className="cursor-pointer border-0 bg-transparent p-0.5 py-0 text-xs font-semibold text-[#4355d9] hover:underline hover:underline-offset-[3px]"
                    onClick={() => inputRef.current?.click()}
                    type="button"
                  >
                    Change
                  </button>
                  <button
                    aria-label="Remove selected file"
                    className="cursor-pointer border-0 bg-transparent p-0.5 py-0 text-xs font-medium text-[#788196] hover:underline hover:underline-offset-[3px]"
                    onClick={() => setFile(null)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
                <input
                  accept={acceptedFileType}
                  aria-label={`Choose a different ${acceptedFileLabel} file`}
                  className="sr-only"
                  onChange={(event) => {
                    selectFile(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                  ref={inputRef}
                  type="file"
                />
              </div>
              <button
                className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#4355d9] px-5 text-sm font-semibold text-white shadow-[0_4px_10px_rgba(67,85,217,0.2)] transition hover:bg-[#3545c4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4355d9]"
                type="button"
                onClick={convertFileMethod}              >
               {isConverting ? "Converting..." : "Convert file"}
               {!isConverting && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="size-[18px]"
                >
                  <path
                    d="M4.167 10h11.666m0 0L10 4.167M15.833 10 10 15.833"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
               )}


              </button>
              {convertedFile && (
                <button
                  className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#4355d9] px-5 text-sm font-semibold text-white shadow-[0_4px_10px_rgba(67,85,217,0.2)] transition hover:bg-[#3545c4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4355d9]"
                  type="button"
                  onClick={downloadConvertedFile}
                >
                 {isDownloading ? "Downloading..." : "Download converted file"}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="size-[18px]"
                >
                  <path
                    d="M4.167 10h11.666m0 0L10 4.167M15.833 10 10 15.833"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-[calc(100vh-68px)] place-items-center px-5 sm:min-h-[calc(100vh-84px)]">
          <p className="text-sm text-[#778197]">Loading upload page...</p>
        </main>
      }
    >
      <UploadContent />
    </Suspense>
  );
}
