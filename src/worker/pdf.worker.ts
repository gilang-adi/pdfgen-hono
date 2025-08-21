import { getContainerLimits } from '@utils/container.util.js';
import type { Context } from 'hono';
import { PdfRenderQueue } from 'pdf/pdf-queue.js';

const queue = new PdfRenderQueue(
  getContainerLimits().maxConcurrent,
  parseInt(process.env.PDF_JOB_TIMEOUT || '60000'),
  getContainerLimits().maxQueueSize
);

queue.on('jobCompleted', (data) => {
  if (data.completed % 100 === 0) {
    console.log(`Completed: ${data.completed}, avg: ${queue.getStats().avgProcessingTime}ms`);
  }
});

queue.on('jobFailed', (data) => {
  console.error(`Failed job ${data.jobId}: ${data.error}`);
});

export async function renderPdfWorkerV3(
  c: Context,
  filename: string,
  docDefinition: any,
  priority = 0,
  timeout?: number
) {
  try {
    const buffer = await queue.render(docDefinition, priority, timeout);
    c.header('Content-Type', 'application/pdf');
    c.header('Content-Disposition', `inline; filename="${filename}.pdf"`);
    return c.body(buffer);
  } catch (err: any) {
    console.error('PDF render error', err);

    if (err.message.includes('Queue is full')) {
      return c.json(
        {
          error: 'Server overloaded. Too many PDF generation requests.',
        },
        503
      );
    }

    if (err.message.includes('timeout')) {
      return c.json(
        {
          error: 'PDF generation timeout. Document too complex.',
        },
        408
      );
    }

    return c.json({ error: 'Failed to generate PDF' }, 500);
  }
}
