"use client"; // very important!

import dynamic from "next/dynamic";
import { useEffect } from "react";

// Load react-pdf components dynamically to avoid SSR issues
const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false }
);
const Page = dynamic(
  () => import("react-pdf").then((mod) => mod.Page),
  { ssr: false }
);

interface BookReaderProps {
  file: string;
}

export default function BookReader({ file }: BookReaderProps) {
  useEffect(() => {
    // Only runs on the client
    import("react-pdf").then((m) => {
      m.pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;
    });
  }, []);

  return (
    <div>
      <Document file={file}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
}
