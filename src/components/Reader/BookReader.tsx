"use client";

import { useState } from "react";

interface BookReaderProps {
  file: string;
}

export default function BookReader({ file }: BookReaderProps) {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
  }

  if (!file) {
    return <div className="flex justify-center items-center h-64 text-gray-500">No file selected</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <div className="border border-gray-300 rounded-lg overflow-hidden w-full max-w-4xl">
        <iframe
          src={`${file}#toolbar=0&navpanes=0&scrollbar=1`}
          className="w-full h-screen"
          title="PDF Preview"
          onError={() => setError("Failed to load PDF preview")}
        />
      </div>

    </div>
  );
}
