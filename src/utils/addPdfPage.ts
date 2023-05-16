import { PDFDocument } from "pdf-lib";

const addPdfPage = async (pdfDocument: PDFDocument, sourcePdf) => {
  const [existingPage] = await pdfDocument.copyPages(sourcePdf, [0]); // add first page from source PDF
  pdfDocument.addPage(existingPage);
};

export default addPdfPage;
