import type { TDocumentDefinitions } from "pdfmake/interfaces";
import dummy from '../data/opd-data.json' with { type: "json" };
import { pdfStyles } from "../utils/pdf-style.util.js";
import { buildFooter } from "./builder/builder-footer.js";
import { buildHeader } from "./builder/builder-header.js";
import { buildNotes } from "./builder/builder-notes.js";
import { buildTableInvoice } from "./builder/builder-table-invoice.js";
import { buildTax } from "./builder/builder-tax.js";

export const buildInvoice = (): TDocumentDefinitions => {
  return {
    pageSize: 'A4',
    pageMargins: [30, 200, 30, 140],
    header: () => buildHeader(dummy.data),
    content: [
      buildTableInvoice(dummy.data),
      buildTax(dummy.data.invoice_details),
      buildNotes(dummy.data),
    ],
    footer: (currentPage: string, pageCount: string) => buildFooter(currentPage, pageCount),
    styles: pdfStyles,
    defaultStyle: { font: 'Helvetica' },
  }
}