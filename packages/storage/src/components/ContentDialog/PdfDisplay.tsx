import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import type { StorageDataType } from "../../types";

// Css
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Web worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfDisplay(props: StorageDataType) {
  const [numPages, setNumPages] = useState<number>();

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: {
    numPages: number;
  }): void {
    setNumPages(nextNumPages);
  }

  return (
    <Document
      file={getCloudinaryURL(props, { filters: [], raw: true })}
      onLoadSuccess={onDocumentLoadSuccess}
      className="flex flex-col w-max gap-3 mb-3"
    >
      {Array(numPages)
        .fill(undefined)
        .map((_, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
    </Document>
  );
}
