import { buildInvoice } from '@templates/template-invoice.js';
import { renderPdf } from '@utils/render-pdf.util.js';
import type { Context } from 'hono';
import os from 'os';

class DummyContext implements Partial<Context> {
  headers: Record<string, string> = {};
  bodyData: any;

  header(name: string, value?: string) {
    if (typeof value === 'string') this.headers[name] = value;
    else delete this.headers[name];
  }

  body(data: any) {
    this.bodyData = data;
    return {
      _data: data,
      _status: 200,
      _format: 'body',
      headers: this.headers,
    } as any;
  }
}

async function stressTestRenderPdf({
  totalJobs = 200,
  concurrent = 20,
  monitorInterval = 2000,
}: {
  totalJobs?: number;
  concurrent?: number;
  monitorInterval?: number;
}) {
  console.log(`🚀 Starting stress test (renderPdf direct)`);
  console.log(`- Total jobs: ${totalJobs}`);
  console.log(`- Concurrent: ${concurrent}\n`);

  let submitted = 0;
  let processing = 0;
  let completed = 0;
  let failed = 0;
  const start = Date.now();

  const docDefinition = buildInvoice();

  const submitJob = async (i: number) => {
    submitted++;
    processing++;

    await new Promise<void>((resolve, reject) => {
      setImmediate(async () => {
        try {
          const c = new DummyContext() as unknown as Context;
          await renderPdf(c, `job-${i}`, docDefinition);
          completed++;
          if (i % 50 === 0) console.log(`✅ Job ${i} done`);
          resolve();
        } catch (err: any) {
          failed++;
          console.error(`❌ Job ${i} failed: ${err.message}`);
          reject(err);
        } finally {
          processing--;
        }
      });
    });
  };

  const monitor = setInterval(() => {
    const mem = process.memoryUsage();
    const cpu = process.cpuUsage();
    const load = os.loadavg();

    const queueLength = Math.max(
      0,
      submitted - completed - failed - processing
    );

    console.log(
      `📊 Stats | Queue: ${queueLength} | Processing: ${processing} | Completed: ${completed} | Failed: ${failed}`
    );
    console.log(
      `🖥️  Memory: ${(mem.rss / 1024 / 1024).toFixed(2)} MB RSS | ${(
        mem.heapUsed /
        1024 /
        1024
      ).toFixed(2)} MB Heap`
    );
    console.log(
      `⚡ CPU: ${(cpu.user / 1000).toFixed(0)} ms user, ${(
        cpu.system / 1000
      ).toFixed(0)} ms sys | LoadAvg: ${load
        .map((n) => n.toFixed(2))
        .join(', ')}`
    );
    console.log('-----------------\n');
  }, monitorInterval);

  // Kick off batch dengan batas concurrency
  const tasks: Promise<void>[] = [];
  for (let i = 1; i <= totalJobs; i++) {
    tasks.push(submitJob(i));
    if (tasks.length >= concurrent) {
      await Promise.all(tasks);
      tasks.length = 0;
    }
  }
  await Promise.all(tasks);

  clearInterval(monitor);

  const duration = (Date.now() - start) / 1000;
  console.log('--- Stress Test Result (Direct) ---');
  console.log(`⏱ Duration: ${duration.toFixed(2)}s`);
  console.log(`✅ Completed: ${completed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(
    `📊 Final Memory: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(
      2
    )} MB`
  );
}

// Run standalone
if (import.meta.url === `file://${process.argv[1]}`) {
  stressTestRenderPdf({
    totalJobs: 1000,
    concurrent: 20,
    monitorInterval: 2000,
  }).then(() => {
    console.log('Stress test finished.');
    process.exit(0);
  });
}
