import Link from "next/link";

const conversionOptions = [
  {
    id: "pdf-to-word",
    label: "PDF to Word",
    description: "Convert a PDF into an editable Word document.",
  },
  {
    id: "word-to-pdf",
    label: "Word to PDF",
    description: "Turn a Word file into a polished PDF document.",
  },
] ;

function ConversionIcon({ type }: { type: "pdf" | "word" }) {
  return (
    <span
      className={`grid size-[54px] shrink-0 place-items-center rounded-[14px] ${
        type === "pdf"
          ? "bg-[#fff0f0] text-[#d84a4a]"
          : "bg-[#edf0ff] text-[#4355d9]"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="size-7"
      >
        <path
          d="M13.5 3.75H7.75A1.75 1.75 0 0 0 6 5.5v13a1.75 1.75 0 0 0 1.75 1.75h8.5A1.75 1.75 0 0 0 18 18.5V8.25l-4.5-4.5Z"
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
    </span>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_50%_43%,rgba(232,237,255,0.72),transparent_48%),#f5f7fb] px-5 sm:px-[6.25%]">
      <header className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center justify-between border-b border-[#e7eaf1] sm:h-[84px]">
        <Link
          className="inline-flex items-center gap-2.5 text-[18px] font-bold tracking-[-0.6px] text-[#202942] no-underline"
          href="/"
          aria-label="Filedrop home"
        >
          <span className="grid size-8 place-items-center rounded-[10px] bg-[#4355d9] text-white">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="size-[18px]"
            >
              <path
                d="M12 15V3m0 0L7.5 7.5M12 3l4.5 4.5M5 14.5v3A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-3"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>filedrop</span>
        </Link>
        <span className="text-[13px] font-medium text-[#68738a]">
          Select format
        </span>
      </header>

      <main className="grid flex-1 place-items-center py-[34px] sm:py-14">
        <section
          className="w-full max-w-[600px] rounded-[17px] border border-[#e9ecf3] bg-white/[0.95] p-6 shadow-[0_24px_70px_rgba(38,51,91,0.08),0_2px_8px_rgba(38,51,91,0.03)] sm:rounded-[20px] sm:p-12"
          aria-labelledby="page-title"
        >
          <div className="mb-[25px] text-center sm:mb-[30px]">
            <span className="mb-3 inline-block text-[10px] font-bold tracking-[1.7px] text-[#4355d9]">
              CONVERT FILES
            </span>
            <h1
              className="m-0 text-[clamp(27px,4vw,34px)] font-semibold leading-[1.2] tracking-[-1.25px] text-[#1b2439]"
              id="page-title"
            >
              Choose your conversion
            </h1>
            <p className="mt-[11px] text-sm leading-[1.6] text-[#778197]">
              Select the file type you need to convert.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
            {conversionOptions.map((option) => (
              <Link
                key={option.id}
                className="flex min-h-[92px] items-center gap-4 rounded-2xl border border-[#e6eaf6] bg-gradient-to-b from-white to-[#f9faff] px-[18px] py-5 text-left no-underline transition duration-150 hover:-translate-y-px hover:border-[#b3bef5] hover:shadow-[0_12px_30px_rgba(67,85,217,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4355d9] sm:min-h-[120px]"
                href={`/upload?type=${option.id}`}
              >
                <ConversionIcon
                  type={option.id === "pdf-to-word" ? "pdf" : "word"}
                />
                <span className="flex min-w-0 flex-col gap-1.5">
                  <span className="text-[18px] font-bold tracking-[-0.35px] text-[#1c2740]">
                    {option.label}
                  </span>
                  <span className="text-xs leading-[1.5] text-[#73809a]">
                    {option.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
