import { getContainerLimits } from '@utils/container.util.js';
import { generatePdf } from '@utils/pdf-generator.util.js';
import { EventEmitter } from 'events';
import type { PdfJob, QueueStats } from 'types/pdf-job.js';

export class PdfRenderQueue extends EventEmitter {
  private queue: PdfJob[] = [];
  private processing = 0;
  private maxConcurrent: number;
  private jobTimeout: number;
  private maxQueueSize: number;

  private stats = {
    completed: 0,
    failed: 0,
    totalProcessingTime: 0,
  };

  constructor(maxConcurrent: number, jobTimeout: number, maxQueueSize: number) {
    super();
    this.maxConcurrent = maxConcurrent;
    this.jobTimeout = jobTimeout;
    this.maxQueueSize = maxQueueSize;

    setInterval(() => this.cleanup(), 30000);
  }

  async render(
    docDefinition: any,
    priority = 0,
    timeout?: number
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      if (this.queue.length >= this.maxQueueSize) {
        reject(new Error('Queue is full. Too many pending requests.'));
        return;
      }

      const jobId = this.generateJobId();
      const job: PdfJob = {
        id: jobId,
        docDefinition,
        resolve,
        reject,
        priority,
        createdAt: Date.now(),
      };

      const jobTimeout = timeout || this.jobTimeout;
      job.timeout = setTimeout(() => {
        this.removeJobFromQueue(jobId);
        reject(new Error(`PDF generation timeout after ${jobTimeout}ms`));
      }, jobTimeout);

      this.insertJobByPriority(job);
      this.emit('jobQueued', { jobId, queueLength: this.queue.length });
      this.processQueue();
    });
  }

  private insertJobByPriority(job: PdfJob) {
    const index = this.queue.findIndex((q) => job.priority > q.priority);
    if (index !== -1) {
      this.queue.splice(index, 0, job);
    } else {
      this.queue.push(job);
    }
  }

  private removeJobFromQueue(jobId: string): boolean {
    const index = this.queue.findIndex((j) => j.id === jobId);
    if (index > -1) {
      const job = this.queue.splice(index, 1)[0];
      if (job.timeout) clearTimeout(job.timeout);
      return true;
    }
    return false;
  }

  private async processQueue() {
    if (this.processing >= this.maxConcurrent || this.queue.length === 0)
      return;

    const job = this.queue.shift();
    if (!job) return;

    this.processing++;
    const startTime = Date.now();

    this.emit('jobStarted', { jobId: job.id, processing: this.processing });

    setImmediate(async () => {
      try {
        const buffer = await generatePdf(job.docDefinition);
        if (job.timeout) clearTimeout(job.timeout);

        const duration = Date.now() - startTime;
        this.stats.completed++;
        this.stats.totalProcessingTime += duration;

        job.resolve(buffer);
        this.emit('jobCompleted', { jobId: job.id, duration });
      } catch (error) {
        this.handleJobError(job, error as Error, startTime);
      } finally {
        this.processing--;
        setImmediate(() => this.processQueue());
      }
    });
  }

  private handleJobError(job: PdfJob, error: Error, startTime: number) {
    if (job.timeout) clearTimeout(job.timeout);

    this.stats.failed++;
    job.reject(error);

    this.emit('jobFailed', {
      jobId: job.id,
      error: error.message,
      duration: Date.now() - startTime,
    });
  }

  private cleanup() {
    if (global.gc) global.gc();
    this.emit('cleanup', {
      completed: this.stats.completed,
      failed: this.stats.failed,
      memoryUsage: process.memoryUsage(),
    });
  }

  private generateJobId(): string {
    return `pdf_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  getStats(): QueueStats {
    const avg =
      this.stats.completed > 0
        ? this.stats.totalProcessingTime / this.stats.completed
        : 0;

    return {
      queueLength: this.queue.length,
      processing: this.processing,
      completed: this.stats.completed,
      failed: this.stats.failed,
      maxConcurrent: this.maxConcurrent,
      avgProcessingTime: Math.round(avg),
    };
  }

  getHealth() {
    const stats = this.getStats();
    const memory = process.memoryUsage();
    const limits = getContainerLimits();

    const memoryUsage = memory.heapUsed / 1024 / 1024;
    const memoryPercent = memoryUsage / limits.memoryLimit;
    const queuePercent = stats.queueLength / this.maxQueueSize;

    let status: 'healthy' | 'warning' | 'unhealthy' = 'healthy';
    if (memoryPercent > 0.85 || queuePercent > 0.9) status = 'unhealthy';
    else if (memoryPercent > 0.7 || queuePercent > 0.7) status = 'warning';

    return {
      status,
      stats,
      memory: {
        used: Math.round(memoryUsage),
        total: Math.round(memory.heapTotal / 1024 / 1024),
        usagePercent: Math.round(memoryPercent * 100),
      },
      container: limits,
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }

  async shutdown(): Promise<void> {
    console.log('Shutting down PDF queue...');
    while (this.queue.length) {
      const job = this.queue.shift();
      if (job?.timeout) clearTimeout(job.timeout);
      job?.reject(new Error('Server shutting down'));
    }

    const deadline = Date.now() + 30_000;
    while (this.processing > 0 && Date.now() < deadline) {
      await new Promise((res) => setTimeout(res, 100));
    }
    console.log('PDF queue shutdown complete.');
  }
}
