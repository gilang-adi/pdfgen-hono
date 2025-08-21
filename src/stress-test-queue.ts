import { buildInvoice } from '@templates/template-invoice.js';
import { highVolumePdfQueue } from '@utils/render-pdf-worker.util.js';
import os from 'os';

async function stressTestPdfQueue({
  totalJobs = 500,
  concurrent = 20,
  priority = 0,
  monitorInterval = 2000,
}: {
  totalJobs?: number;
  concurrent?: number;
  priority?: number;
  monitorInterval?: number;
}) {
  console.log(`🚀 Starting stress test (PDF Queue)`);
  console.log(`- Total jobs: ${totalJobs}`);
  console.log(`- Concurrent submit: ${concurrent}`);
  console.log(`- Monitor interval: ${monitorInterval}ms\n`);

  let completed = 0;
  let failed = 0;
  const start = Date.now();

  const monitor = setInterval(() => {
    const stats = highVolumePdfQueue.getStats();
    const mem = process.memoryUsage();
    const cpu = process.cpuUsage();
    const load = os.loadavg();

    console.log(
      `📊 Stats | Queue: ${stats.queueLength} | Processing: ${stats.processing} | Completed: ${stats.completed} | Failed: ${stats.failed}\n` +
        `🖥️  Memory: ${(mem.rss / 1024 / 1024).toFixed(2)} MB RSS | ${(
          mem.heapUsed /
          1024 /
          1024
        ).toFixed(2)} MB Heap\n` +
        `⚡ CPU: ${Math.round(cpu.user / 1000)} ms user, ${Math.round(
          cpu.system / 1000
        )} ms sys | LoadAvg: ${load.map((n) => n.toFixed(2)).join(', ')}`
    );
    console.log('-----------------\n');
  }, monitorInterval);

  const docDefinition = buildInvoice();

  const submitJob = async (i: number) => {
    try {
      await highVolumePdfQueue.render(
        docDefinition,
        `inv-${1}`,
        priority,
        30000
      );
      completed++;
      if (i % 50 === 0) console.log(`✅ Job ${i} done`);
    } catch (err: any) {
      failed++;
      console.error(`❌ Job ${i} failed: ${err.message}`);
    }
  };

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
  console.log('--- Stress Test Result (Queue) ---');
  console.log(`⏱ Duration: ${duration.toFixed(2)}s`);
  console.log(`✅ Completed: ${completed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(
    `📊 Final Memory: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(
      2
    )} MB`
  );
  console.log(`📊 Stats:`, highVolumePdfQueue.getStats());
}

// Run standalone
if (import.meta.url === `file://${process.argv[1]}`) {
  stressTestPdfQueue({
    totalJobs: 1000,
    concurrent: 20,
    priority: 0,
    monitorInterval: 2000,
  }).then(() => {
    console.log('Stress test finished.');
    process.exit(0);
  });
}
