import type { Content } from "pdfmake/interfaces.js";

export const buildNotes = (data: any): Content => {
  return {
    columns: [
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

      // CASHIER
      {
        width: '40%',
        margin: [50, 60, 0, 0],
        stack: [
          { text: 'CASHIER', bold: true, fontSize: 8 },
          { text: 'Yiyin Eka Wijayanti', fontSize: 8 },
        ],
      },
    ],
  };
}