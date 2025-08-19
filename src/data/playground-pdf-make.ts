var dd = {
  pageSize: 'A4',
  pageMargins: [30, 190, 30, 140],
  header:  () => {
    return {
      stack: [
        // main info
        {
          columns: [
            {
              stack: [
                {
                  image:
                    'data:image/png;base64,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',
                  width: 120,
                  height: 30,
                  margin: [0, 10, 0, 5],
                },
                {
                  text: 'SILOAM HOSPITALS LIPPO VILLAGE',
                  style: 'headerSubtitle',
                },
                {
                  text: 'JALAN SILOAM NO.6 TANGERANG TELP: 021-5460055 FAX: 021-54210090',
                  style: 'headerAddress',
                },
                {
                  text: 'Telp. +6221-80646900; ext. 29500, 29501, 29503, 29505',
                  style: 'headerAddress',
                },
              ],
              width: '*',
              alignment: 'center',
            },
          ],
        },
        // main type and qr
        {
          margin: [30, 8, 30, 8],
          columns: [
            {
              width: '50%',
              alignment: 'right',
              stack: [{ text: 'INVOICE', bold: true, fontSize: 10 }],
            },
            {
              width: '50%',
              alignment: 'right',
              stack: [{ qr: 'OIV2508150003', fit: 30, bold: true }],
            },
          ],
        },
        // admission
        {
          columns: [
            {
              alignment: 'left',
              width: '50%',
              fontSize: 7,
              layout: 'noBorders',
              table: {
                widths: ['auto', 'auto'],
                body: [
                  [
                    {
                      text: 'Admission No / MR',
                      style: 'label',
                    },
                    ': noSep',
                  ],
                  [
                    {
                      text: 'Name',
                      style: 'label',
                    },
                    ': tglSep',
                  ],
                  [
                    {
                      text: 'Address',
                      style: 'label',
                    },
                    ': noKartu',
                  ],
                  [
                    {
                      text: 'Patient Type',
                      style: 'label',
                    },
                    ': nama',
                  ],
                  [
                    {
                      text: 'Payer',
                      style: 'label',
                    },
                    ': tglLahir',
                  ],
                  [
                    {
                      text: 'Primary Doctor',
                      style: 'label',
                    },
                    ': Perempuan',
                  ],
                ],
              },
            },
            {
              width: '50%',
              fontSize: 7,
              alignment: 'left',
              layout: 'noBorders',
              table: {
                widths: ['auto', 'auto'],
                body: [
                  [
                    {
                      text: 'Invoice No.',
                      style: 'label',
                    },
                    ': jnsPeserta',
                  ],
                  [
                    {
                      text: 'Invoice Date',
                      style: 'label',
                    },
                    ': jnsPelayanan',
                  ],
                  [
                    {
                      text: 'Admission Date',
                      style: 'label',
                    },
                    ': - namaKunjungan',
                  ],
                  [
                    {
                      text: 'Email',
                      style: 'label',
                    },
                    ': poli',
                  ],
                ],
              },
            },
          ],
          margin: [30, 0, 30, 10],
        },
      ],
    };
  },
  content: [
    // datatable
    {
      style: 'tableRow',
      headerRows: 1,
      table: {
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
        body: [
          [
            { text: 'No', border: [true, true, true, true] },
            { text: 'Name', border: [false, true, false, true] },
            {
              text: 'Description',
              alignment: 'left',
              border: [false, true, true, true],
            },
            { text: 'Qty' },
            { text: 'Uom', border: [true, true, true, true] },
            { text: 'Amount', border: [true, true, true, true] },
            { text: 'Disc', border: [true, true, true, true] },
            { text: 'Payer', border: [true, true, true, true] },
            { text: 'Patient', border: [true, true, true, true] },
          ],
          [
            { text: '', border: [true, false, true, false] },

            {
              text: 'PROCEDURE ROOM RENTAL',
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
          ],
          [
            {
              text: '1',
              alignment: 'center',
              border: [true, false, true, false],
            },

            { text: 'RECOVERY ROOM', border: [true, false, false, false] },
            { text: '', border: [false, false, true, false] },

            {
              text: '1',
              alignment: 'right',
              border: [true, false, true, false],
            },

            {
              text: '',
              alignment: 'left',
              border: [true, false, true, false],
            },
            {
              text: '541,000',
              alignment: 'right',
              border: [true, false, true, false],
            },

            {
              text: '0',
              alignment: 'right',
              border: [true, false, true, false],
            },
            {
              text: '541,000',
              alignment: 'right',
              border: [true, false, true, false],
            },

            {
              text: '0',
              alignment: 'right',
              border: [true, false, true, false],
            },
          ],
          [
            {
              text: '2',
              alignment: 'center',
              border: [true, false, true, false],
            },
            {
              text: 'CATH LAB ROOM-PROCEDUR I',
              border: [true, false, false, false],
            },
            {
              text: '',
              alignment: 'right',
              border: [false, false, true, false],
            },
            {
              text: '1',
              alignment: 'right',
              border: [true, false, true, false],
            },
            {
              text: '',
              alignment: 'right',
              border: [true, false, true, false],
            },
            {
              text: '682,000',
              alignment: 'right',
              border: [true, false, true, false],
            },
            {
              text: '0',
              alignment: 'right',
              border: [true, false, true, false],
            },
            {
              text: '682,000',
              alignment: 'right',
              border: [true, false, true, false],
            },
            {
              text: '0',
              alignment: 'right',
              border: [true, false, true, false],
            },
          ],
          [
            { text: '', border: [true, false, true, true] },

            {
              text: 'PROCEDURE ROOM RENTAL Sub Total',
              colSpan: 2,
              alignment: 'right',
              bold: true,
              border: [true, false, true, true],
            },
            { text: '', border: [true, false, true, true] },
            { text: '', alignment: 'right', border: [true, false, true, true] },
            { text: '', border: [true, false, true, true] },
            {
              text: '1,223,000',
              alignment: 'right',
              border: [true, false, true, true],
            },
            {
              text: '0',
              alignment: 'right',
              border: [true, false, true, true],
            },
            {
              text: '1,223,000',
              alignment: 'right',
              border: [true, false, true, true],
            },
            {
              text: '0',
              alignment: 'right',
              border: [true, false, true, true],
            },
          ],
          // summary
          [
            {
              text: 'SUB TOTAL:',
              colSpan: 5,
              alignment: 'right',
              bold: true,
              border: [false, true, false, false],
            },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            {
              text: '1,223,000',
              alignment: 'right',
              border: [false, false, false, false],
            },
            {
              text: '0',
              alignment: 'right',
              border: [false, false, false, false],
            },
            {
              text: '1,223,000',
              alignment: 'right',
              border: [false, false, false, false],
            },
            {
              text: '0',
              alignment: 'right',
              border: [false, false, false, false],
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
            {
              text: '',
              alignment: 'right',
              border: [false, false, false, false],
            },
            {
              text: '',
              alignment: 'right',
              border: [false, false, false, false],
            },
            {
              text: '0',
              alignment: 'right',
              border: [false, false, false, false],
            },
            {
              text: '0',
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
            {
              text: '',
              alignment: 'right',
              border: [false, false, false, false],
            },
            {
              text: '0',
              alignment: 'right',
              border: [false, false, false, false],
            },
            {
              text: '0',
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
            {
              text: '',
              alignment: 'right',
              border: [false, false, false, false],
            },
            {
              text: '0',
              alignment: 'right',
              border: [false, false, false, false],
            },
            {
              text: '0',
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

            {
              text: '',
              alignment: 'right',
              border: [false, false, false, false],
            },
            {
              text: '1,223,000',
              alignment: 'right',
              border: [false, false, false, false],
            },
            {
              text: '0',
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
            {
              text: '',
              alignment: 'right',
              border: [false, false, false, false],
            },
            {
              text: '0',
              alignment: 'right',
              border: [false, false, false, false],
            },
            {
              text: '0',
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
            {
              text: '',
              alignment: 'right',
              border: [false, false, false, false],
            },
            {
              text: '1,223,000',
              alignment: 'right',
              border: [false, false, false, false],
            },
            {
              text: '0',
              alignment: 'right',
              border: [false, false, false, false],
            },
          ],
        ],
      },
    },
    // tax
    {
      margin: [0, 10, 0, 0],
      stack: [
        {
          text: [
            { text: 'Tax Base :\u00A0', style: 'tax' },
            {
              text: '1,121,084' + '\u00A0\u00A0\u00A0\u00A0\u00A0',
              style: 'taxValue',
            },
            { text: 'VAT : ', style: 'tax' },
            { text: '0' + '\u00A0\u00A0\u00A0\u00A0\u00A0', style: 'taxValue' },
            { text: '*) VAT Exempted : ', style: 'tax' },
            { text: '134,530', style: 'taxValue' },
          ],
        },
        {
          text: [
            {
              text: 'IN WORDS PATIENT :\u00A0',
              style: 'tax',
            },
            {
              text: 'Nol Rupiah',
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
              text: 'Satu Juta Dua Ratus Dua Puluh Tiga Ribu Rupiah',
              style: 'taxValue',
            },
          ],
        },
      ],
    },
    // notes
    {
      columns: [
        // Kolom kiri: NOTES
        {
          width: '60%',
          stack: [
            { text: 'NOTES:', style: 'sectionTitle' },
            {
              layout: {
                hLineWidth: function () {
                  return 1;
                },
                vLineWidth: function () {
                  return 1;
                },
                hLineColor: function () {
                  return 'black';
                },
                vLineColor: function () {
                  return 'black';
                },
              },
              table: {
                widths: ['*'],
                body: [
                  [
                    {
                      stack: [
                        {
                          text: '- PT Siloam International Hospitals Tbk NPWP : 01.788.139.2-054.000',
                          style: 'note',
                        },
                        {
                          text: '- PPN Dibebaskan (VAT Exempted) sesuai dengan Undang-Undang PPN No. 42 Tahun 2009 s.t.d.t.d UU HPP Nomor 7 Tahun 2021; DPP (Tax Based) menggunakan perhitungan DPP Nilai lain sesuai dengan PMK 131 tahun 2024',
                          style: 'note',
                        },
                        {
                          text: '- Harga sudah termasuk Pajak Pertambahan Nilai (Bila Ada)',
                          style: 'note',
                        },
                        {
                          text: '- No Rekening NOBU : 12030002525 a/n PT Siloam International Hospitals',
                          style: 'note',
                        },
                        {
                          text: '- Obat dan alat kesehatan yang telah dibeli tidak dapat ditukar / dikembalikan, mohon dapat diperiksa kembali sebelum meninggalkan area Farmasi dan Kasir',
                          style: 'note',
                        },
                      ],
                      margin: [5, 5, 5, 5],
                    },
                  ],
                ],
              },
            },
          ],
        },

        // Kolom kanan: CASHIER
        {
          width: '40%',
          margin: [50, 60, 0, 0], // spacing dari kiri & atas
          stack: [
            { text: 'CASHIER', bold: true },
            { text: 'Yiyin Eka Wijayanti', bold: true, fontSize: 10 },
          ],
        },
      ],
    },
  ],
  styles: {
    siloamTitle: {
      fontSize: 14,
      bold: true,
      alignment: 'center',
      margin: [0, 0, 0, -4],
    },
    hospitalsTitle: {
      fontSize: 12,
      bold: true,
      alignment: 'center',
    },
    headerSubtitle: {
      fontSize: 10,
      bold: true,
      alignment: 'center',
    },
    headerAddress: {
      fontSize: 8,
      alignment: 'center',
    },
    invoiceTitle: {
      fontSize: 18,
      bold: true,
      alignment: 'center',
      margin: [0, 10, 0, 10],
    },
    label: {
      fontSize: 7,
      bold: true,
    },
    value: {
      fontSize: 8,
    },
    tableRow: {
      fontSize: 8,
    },
    sectionTitle: {
      fontSize: 10,
      bold: true,
      margin: [0, 10, 0, 5],
    },
    tax: {
      fontSize: 8,
      lineHeight: 1.7,
      bold: true,
    },
    taxValue: {
      fontSize: 8,
      lineHeight: 1.7,
    },
    note: {
      fontSize: 8,
      lineHeight: 1.2,
    },
    subTotalLabel: {
      fontSize: 10,
      bold: true,
      margin: [0, 0, 10, 0],
    },
    subTotalValue: {
      fontSize: 10,
      alignment: 'right',
    },
    totalLabel: {
      fontSize: 12,
      bold: true,
      margin: [0, 0, 10, 0],
    },
    totalValue: {
      fontSize: 12,
      bold: true,
      alignment: 'right',
    },
    signatureLabel: {
      fontSize: 8,
      bold: true,
    },
    signatureName: {
      fontSize: 8,
    },
    footerTitle: {
      fontSize: 10,
      bold: true,
      margin: [0, 10, 0, 5],
    },
    footerNote: {
      fontSize: 8,
      lineHeight: 1.7,
    },
    pageNumber: {
      fontSize: 8,
    },
  },
  footer: function (currentPage: string, pageCount: string) {
    return {
      stack: [
        {
          columns: [
            {
              width: 110,
              stack: [
                {
                  text: 'Your Verified Billing',
                  fontSize: 11,
                  bold: true,
                  margin: [0, 0, 0, 6],
                },
                {
                  qr: 'VerifiedBilling',
                  fit: 90,
                  margin: [5, 0, 0, 6],
                },
              ],
            },
            {
              width: '*',
              style: 'footerNote',
              alignment: 'left',
              text: [
                {
                  text: 'Invoice ini telah diverifikasi secara elektronik, tanda tangan sudah tidak diperlukan\n',
                },
                {
                  text: 'Invoice ini merupakan bukti pembayaran yang sah\n',
                },
                {
                  text: 'Printed on 15-Aug-2025 02:43 by DMS',
                },
              ],
              margin: [0, 20, 0, 0],
            },
            {
              width: 50,
              text: currentPage + '/' + pageCount,
              fontSize: 9,
              bold: true,
              alignment: 'right',
              margin: [0, 45, 0, 0],
            },
          ],
        },
      ],
      margin: [26, 12, 26, 12],
      layout: 'noBorders',
    };
  },
};
