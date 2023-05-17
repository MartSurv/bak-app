import { PDFDocument } from "pdf-lib";

import { Sticker } from "@/interfaces/lpexpress";

const createPDF = async (stickers: Sticker[]) => {
  const pdfDoc = await PDFDocument.create();

  for (const sticker of stickers) {
    const sourcePdf = await PDFDocument.load(
      `data:application/pdf;base64,${sticker.label}`
    );
    const [existingPage] = await pdfDoc.copyPages(sourcePdf, [0]);
    pdfDoc.addPage(existingPage);
  }

  return pdfDoc;
};

export default createPDF;
