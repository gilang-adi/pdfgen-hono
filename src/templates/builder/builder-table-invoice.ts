import { formatAmount } from '@utils/format-amount.util.js';
import type { Content, TableCell } from 'pdfmake/interfaces.js';
import type { InvoiceData } from 'types/opd.js';

export const buildTableInvoice = (data: InvoiceData): Content => {
  const body: TableCell[][] = [];

  // header
  body.push([
    { text: 'No' },
    { text: 'Name', border: [false, true, false, true] },
    {
      text: 'Description',
      alignment: 'right',
      border: [false, true, true, true],
    },
    { text: 'Qty' },
    { text: 'Uom' },
    { text: 'Amount' },
    { text: 'Disc' },
    { text: 'Payer' },
    { text: 'Patient' },
  ]);

  // group by sales_item_type_name
  data.invoiced_items.forEach((group) => {
    // group header
    body.push([
      { text: '', border: [true, false, true, false] },
      {
        text: group.sales_item_type_name,
        colSpan: 2,
        bold: true,
        border: [true, false, true, false],
      },
      { text: '', border: [true, false, true, false] },
      { text: '', border: [true, false, true, false] },
      { text: '', border: [true, false, true, false] },
      { text: '', border: [true, false, true, false] },
      { text: '', border: [true, false, true, false] },
      { text: '', border: [true, false, true, false] },
      { text: '', border: [true, false, true, false] },
    ]);

    // group items
    group.items.forEach((item, itemIndex) => {
      body.push([
        {
          text: String(itemIndex + 1),
          alignment: 'center',
          border: [true, false, true, false],
        },
        { text: item.sales_item_name, border: [true, false, false, false] },
        {
          text: '',
          border: [false, false, true, false],
        },
        {
          text: formatAmount(item.quantity),
          alignment: 'right',
          border: [true, false, true, false],
        },
        { text: '', alignment: 'center', border: [true, false, true, false] }, // uom tidak ada di JSON
        {
          text: formatAmount(0),
          alignment: 'right',
          border: [true, false, true, false],
        },
        { text: '', alignment: 'center', border: [true, false, true, false] }, // disc tidak ada di items
        {
          text: formatAmount(item.payer_amount),
          alignment: 'right',
          border: [true, false, true, false],
        },
        {
          text: formatAmount(item.patient_amount),
          alignment: 'right',
          border: [true, false, true, false],
        },
      ]);
    });
  });

  const summaryRows: TableCell[][] = [
    [
      {
        text: 'SUB TOTAL:',
        colSpan: 5,
        alignment: 'right',
        bold: true,
        border: [false, true, false, false],
      },
      { text: '', border: [false, true, false, false] },
      { text: '', border: [false, true, false, false] },
      { text: '', border: [false, true, false, false] },
      { text: '', border: [false, true, false, false] },
      {
        text: formatAmount(data.invoice_details.total_item_amount),
        alignment: 'right',
        border: [false, true, false, false],
      },
      {
        text: formatAmount(data.invoice_details.total_discount_amount),
        alignment: 'right',
        border: [false, true, false, false],
      },
      {
        text: formatAmount(data.invoice_details.total_payer_amount),
        alignment: 'right',
        border: [false, true, false, false],
      },
      {
        text: formatAmount(data.invoice_details.total_patient_amount),
        alignment: 'right',
        border: [false, true, false, false],
      },
    ],
    [
      {
        text: 'DISCOUNT:',
        colSpan: 5,
        alignment: 'right',
        bold: true,
        border: [false, false, false, false],
      },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', alignment: 'right', border: [false, false, false, false] },
      { text: '', alignment: 'right', border: [false, false, false, false] },
      {
        text: formatAmount(0),
        alignment: 'right',
        border: [false, false, false, false],
      },
      {
        text: formatAmount(0),
        alignment: 'right',
        border: [false, false, false, false],
      },
    ],
    [
      {
        text: 'ADMIN CHARGE:',
        colSpan: 5,
        alignment: 'right',
        bold: true,
        border: [false, false, false, false],
      },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', alignment: 'right', border: [false, false, false, false] },
      {
        text: formatAmount(data.invoice_details.payer_admin_fee),
        alignment: 'right',
        border: [false, false, false, false],
      },
      {
        text: formatAmount(data.invoice_details.patient_admin_fee),
        alignment: 'right',
        border: [false, false, false, false],
      },
    ],
    [
      {
        text: 'ROUNDING:',
        colSpan: 5,
        alignment: 'right',
        bold: true,
        border: [false, false, false, false],
      },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', alignment: 'right', border: [false, false, false, false] },
      {
        text: formatAmount(data.invoice_details.payer_round_amount),
        alignment: 'right',
        border: [false, false, false, false],
      },
      {
        text: formatAmount(data.invoice_details.patient_round_amount),
        alignment: 'right',
        border: [false, false, false, false],
      },
    ],
    [
      {
        text: 'TOTAL:',
        colSpan: 5,
        alignment: 'right',
        bold: true,
        border: [false, false, false, false],
      },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', alignment: 'right', border: [false, false, false, false] },
      {
        text: formatAmount(data.invoice_details.payer_net_amount),
        alignment: 'right',
        border: [false, false, false, false],
      },
      {
        text: formatAmount(data.invoice_details.patient_net_amount),
        alignment: 'right',
        border: [false, false, false, false],
      },
    ],
    [
      {
        text: 'PAYMENT:',
        colSpan: 5,
        alignment: 'right',
        bold: true,
        border: [false, false, false, false],
      },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', alignment: 'right', border: [false, false, false, false] },
      {
        text: formatAmount(data.invoice_details.paid_amount),
        alignment: 'right',
        border: [false, false, false, false],
      },
      {
        text: formatAmount(data.invoice_details.paid_amount),
        alignment: 'right',
        border: [false, false, false, false],
      },
    ],
    [
      {
        text: 'BALANCE:',
        colSpan: 5,
        alignment: 'right',
        bold: true,
        border: [false, false, false, false],
      },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', border: [false, false, false, false] },
      { text: '', alignment: 'right', border: [false, false, false, false] },
      {
        text: formatAmount(data.invoice_details.payer_balance_amount),
        alignment: 'right',
        border: [false, false, false, false],
      },
      {
        text: formatAmount(data.invoice_details.patient_balance_amount),
        alignment: 'right',
        border: [false, false, false, false],
      },
    ],
  ];

  body.push(...summaryRows);

  return {
    style: 'tableRow',
    table: {
      headerRows: 1,
      widths: [
        'auto',
        '*',
        '*',
        'auto',
        'auto',
        'auto',
        'auto',
        'auto',
        'auto',
      ],
      body,
    },
  };
};
