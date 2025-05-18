"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { HiHome } from "react-icons/hi";
import { BsExclamationOctagon } from "react-icons/bs";

enum Error {
  Configuration = "Configuration",
}

const errorMap = {
  [Error.Configuration]: (
    <p>
      There was a problem when trying to authenticate. Please contact us if this
      error persists. Unique error code:{" "}
      <code className="rounded-sm bg-slate-100 p-1 text-xs">Configuration</code>
    </p>
  ),
};

export default function AuthErrorPage() {
  const search = useSearchParams();
  const error = search.get("error") as Error;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 text-center shadow dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BsExclamationOctagon className="size-5" />
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Something went wrong
          </h5>
        </div>

        <div className="mb-4 font-normal text-gray-700 dark:text-gray-400">
          {errorMap[error] || "Please contact us if this error persists."}
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <HiHome className="h-5 w-5" />
          Return Home
        </Link>
      </div>
    </div>
  );
}
