import { buildInvoice } from '@templates/template-invoice.js';
import { renderPdf } from '@utils/render-pdf.util.js';
import { Hono } from 'hono';

const pdf = new Hono();

const TEMPLATE_MAP = {
  invo: buildInvoice,
};

type TemplateKey = keyof typeof TEMPLATE_MAP;

pdf.get('/templates', (c) => c.json({ templates: Object.keys(TEMPLATE_MAP) }));

pdf.get('/invo', async (c) => {
  try {
    const docDef = buildInvoice();
    return await renderPdf(c, 'inv', docDef);
  } catch (err) {
    console.error('PDF generation error:', err);
    return c.json({ error: 'PDF generation failed', details: String(err) }, 500);
  }
});

pdf.post('/generate', async (c) => {
  let body: { template: TemplateKey; data: any };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Body harus JSON' }, 400);
  }

  const { template } = body;
  if (!template || !(template in TEMPLATE_MAP)) {
    return c.json({ error: 'Template tidak ditemukan' }, 400);
  }

  try {
    const buildDocDef = TEMPLATE_MAP[template];
    const docDef = buildDocDef();
    return await renderPdf(c, template, docDef);
  } catch (err) {
    console.error('PDF generation error:', err);
    return c.json({ error: 'PDF generation failed', details: String(err) }, 500);
  }
});

export default pdf;
