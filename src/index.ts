import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import pdf from './routes/pdf.js';

const app = new Hono()

app.get('/', (c) => c.text('📄 PDF Generator API Ready'));

app.route('/', pdf);

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
