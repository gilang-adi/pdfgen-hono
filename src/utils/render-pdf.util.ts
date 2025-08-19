import type { Context } from 'hono';
import PdfPrinter from 'pdfmake';

const fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
};
const printer = new PdfPrinter(fonts);

export async function renderPdf(
  c: Context,
  filename: string,
  docDefinition: any
): Promise<Response> {
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    pdfDoc.on('data', (chunk) => chunks.push(chunk));
    pdfDoc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      c.header('Content-Type', 'application/pdf');
      c.header('Content-Disposition', `attachment; filename=${filename}.pdf`);
      resolve(c.body(pdfBuffer));
    });
    pdfDoc.on('error', reject);
    pdfDoc.end();
  });
}
