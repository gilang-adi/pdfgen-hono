import { formatAmount } from "@utils/format-amount.util.js";
import type { Content } from "pdfmake/interfaces.js";
import type { InvoiceDetails } from "types/opd.js";

export const buildTax = (data: InvoiceDetails): Content => {
  return {
    margin: [0, 10, 0, 0],
    stack: [
      {
        text: [
          { text: 'Tax Base :\u00A0', style: 'tax' },
          {
            text:
              formatAmount(data.tax_base_amount) +
              '\u00A0\u00A0\u00A0\u00A0\u00A0',
            style: 'taxValue',
          },
          { text: 'VAT : ', style: 'tax' },
          {
            text: formatAmount(data.vat) + '\u00A0\u00A0\u00A0\u00A0\u00A0',
            style: 'taxValue',
          },
          { text: '*) VAT Exempted : ', style: 'tax' },
          { text: formatAmount(data.vat_exempted), style: 'taxValue' },
        ],
      },
      {
        text: [
          {
            text: 'IN WORDS PATIENT :\u00A0',
            style: 'tax',
          },
          {
            text: data.in_words_patient,
            style: 'taxValue',
          },
        ],
      },
      {
        text: [
          {
            text: 'IN WORDS PAYER :\u00A0',
            style: 'tax',
          },
          {
            text: data.in_words_payer,
            style: 'taxValue',
          },
        ],
      },
    ],
  };
}