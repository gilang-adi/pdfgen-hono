import type { Context } from 'hono';
import PdfPrinter from 'pdfmake';
import os from 'os';
import { EventEmitter } from 'events';

const fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
};

interface PdfJob {
  id: string;
  docDefinition: any;
  resolve: (buffer: Buffer) => void;
  reject: (err: Error) => void;
  priority: number;
  createdAt: number;
  timeout?: NodeJS.Timeout;
}

interface QueueStats {
  queueLength: number;
  processing: number;
  completed: number;
  failed: number;
  maxConcurrent: number;
  avgProcessingTime: number;
}

class HighVolumePdfQueue extends EventEmitter {
  private queue: PdfJob[] = [];
  private processing: number = 0;
  private maxConcurrent: number;
  private printer: PdfPrinter;
  private stats = {
    completed: 0,
    failed: 0,
    totalProcessingTime: 0,
  };
  private jobTimeout: number = 60000; // 60 seconds default timeout
  private maxQueueSize: number = 10000; // Prevent memory overflow

  constructor(
    maxConcurrent: number = Math.max(4, os.cpus().length),
    jobTimeout: number = 60000,
    maxQueueSize: number = 10000
  ) {
    super();
    this.maxConcurrent = maxConcurrent;
    this.jobTimeout = jobTimeout;
    this.maxQueueSize = maxQueueSize;
    this.printer = new PdfPrinter(fonts);

    console.log(`High Volume PDF Queue initialized:`);
    console.log(`- Max Concurrent: ${maxConcurrent}`);
    console.log(`- Job Timeout: ${jobTimeout}ms`);
    console.log(`- Max Queue Size: ${maxQueueSize}`);

    // Cleanup completed jobs periodically
    setInterval(() => this.cleanup(), 30000);
  }

  async render(
    docDefinition: any,
    priority: number = 0,
    timeout?: number
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      // Check queue size limit
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

      // Set individual job timeout
      const jobTimeout = timeout || this.jobTimeout;
      job.timeout = setTimeout(() => {
        this.removeJobFromQueue(jobId);
        reject(new Error(`PDF generation timeout after ${jobTimeout}ms`));
      }, jobTimeout);

      // Insert job based on priority (higher priority first)
      this.insertJobByPriority(job);

      this.emit('jobQueued', { jobId, queueLength: this.queue.length });
      this.processQueue();
    });
  }

  private insertJobByPriority(job: PdfJob) {
    let inserted = false;
    for (let i = 0; i < this.queue.length; i++) {
      if (job.priority > this.queue[i].priority) {
        this.queue.splice(i, 0, job);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      this.queue.push(job);
    }
  }

  private removeJobFromQueue(jobId: string): boolean {
    const index = this.queue.findIndex((job) => job.id === jobId);
    if (index > -1) {
      const job = this.queue[index];
      if (job.timeout) {
        clearTimeout(job.timeout);
      }
      this.queue.splice(index, 1);
      return true;
    }
    return false;
  }

  private async processQueue() {
    if (this.processing >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const job = this.queue.shift();
    if (!job) return;

    this.processing++;
    const startTime = Date.now();

    this.emit('jobStarted', {
      jobId: job.id,
      processing: this.processing,
      queueLength: this.queue.length,
    });

    try {
      // Use setImmediate to prevent blocking the event loop
      setImmediate(async () => {
        try {
          const buffer = await this.generatePdf(job.docDefinition);

          // Clear job timeout
          if (job.timeout) {
            clearTimeout(job.timeout);
          }

          const processingTime = Date.now() - startTime;
          this.stats.completed++;
          this.stats.totalProcessingTime += processingTime;

          job.resolve(buffer);

          this.emit('jobCompleted', {
            jobId: job.id,
            processingTime,
            completed: this.stats.completed,
          });
        } catch (err) {
          this.handleJobError(job, err as Error, startTime);
        } finally {
          this.processing--;
          // Continue processing queue
          if (this.queue.length > 0) {
            setImmediate(() => this.processQueue());
          }
        }
      });
    } catch (err) {
      this.handleJobError(job, err as Error, startTime);
      this.processing--;
    }
  }

  private handleJobError(job: PdfJob, error: Error, startTime: number) {
    if (job.timeout) {
      clearTimeout(job.timeout);
    }

    this.stats.failed++;
    const processingTime = Date.now() - startTime;

    job.reject(error);

    this.emit('jobFailed', {
      jobId: job.id,
      error: error.message,
      processingTime,
      failed: this.stats.failed,
    });
  }

  private generatePdf(docDefinition: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
        const chunks: Buffer[] = [];

        pdfDoc.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        pdfDoc.on('end', () => {
          try {
            const buffer = Buffer.concat(chunks);
            resolve(buffer);
          } catch (err) {
            reject(err);
          }
        });

        pdfDoc.on('error', (err: Error) => {
          reject(err);
        });

        pdfDoc.end();
      } catch (err) {
        reject(err as Error);
      }
    });
  }

  private generateJobId(): string {
    return `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private cleanup() {
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    this.emit('cleanup', {
      completed: this.stats.completed,
      failed: this.stats.failed,
      memoryUsage: process.memoryUsage(),
    });
  }

  getStats(): QueueStats {
    const avgProcessingTime =
      this.stats.completed > 0
        ? this.stats.totalProcessingTime / this.stats.completed
        : 0;

    return {
      queueLength: this.queue.length,
      processing: this.processing,
      completed: this.stats.completed,
      failed: this.stats.failed,
      maxConcurrent: this.maxConcurrent,
      avgProcessingTime: Math.round(avgProcessingTime),
    };
  }

  // Health check for ECS/ALB
  getHealth() {
    const stats = this.getStats();
    const memoryUsage = process.memoryUsage();
    const containerLimits = getContainerLimits();

    // Calculate health status based on container resources
    const memoryUsagePercent =
      memoryUsage.heapUsed / 1024 / 1024 / containerLimits.memoryLimit;
    const queueUsagePercent = stats.queueLength / this.maxQueueSize;

    let status = 'healthy';
    if (memoryUsagePercent > 0.85 || queueUsagePercent > 0.9) {
      status = 'unhealthy';
    } else if (memoryUsagePercent > 0.7 || queueUsagePercent > 0.7) {
      status = 'warning';
    }

    return {
      status,
      container: {
        cpuLimit: containerLimits.cpuLimit,
        memoryLimit: containerLimits.memoryLimit,
        maxConcurrent: containerLimits.maxConcurrent,
        maxQueueSize: containerLimits.maxQueueSize,
      },
      stats,
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024),
        usagePercent: Math.round(memoryUsagePercent * 100),
      },
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    console.log('Shutting down PDF queue...');

    // Clear all pending jobs
    while (this.queue.length > 0) {
      const job = this.queue.shift();
      if (job) {
        if (job.timeout) clearTimeout(job.timeout);
        job.reject(new Error('Server shutting down'));
      }
    }

    // Wait for current jobs to finish (with timeout)
    const shutdownTimeout = 30000; // 30 seconds
    const startTime = Date.now();

    while (this.processing > 0 && Date.now() - startTime < shutdownTimeout) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log('PDF queue shutdown complete');
  }
}

// Get container resource limits from environment or ECS metadata
const getContainerLimits = () => {
  // Try to get from ECS task metadata endpoint v4
  const ecsContainerMetadataUri = process.env.ECS_CONTAINER_METADATA_URI_V4;

  // Fallback to environment variables or defaults
  const cpuLimit =
    parseInt(process.env.ECS_CPU_LIMIT || '0') || os.cpus().length;
  const memoryLimit = parseInt(process.env.ECS_MEMORY_LIMIT || '0') || 512; // MB

  // Conservative settings for containers
  const maxConcurrent = Math.min(
    Math.max(2, Math.floor(cpuLimit * 0.8)), // 80% of available CPU
    Math.floor(memoryLimit / 64) // ~64MB per concurrent job
  );

  const maxQueueSize = Math.min(
    Math.floor(memoryLimit / 8), // Conservative memory usage
    10000
  );

  return {
    maxConcurrent,
    maxQueueSize,
    cpuLimit,
    memoryLimit,
  };
};

const containerLimits = getContainerLimits();

// Global instance with container-aware settings
const highVolumePdfQueue = new HighVolumePdfQueue(
  containerLimits.maxConcurrent,
  parseInt(process.env.PDF_JOB_TIMEOUT || '60000'), // 60 second default
  containerLimits.maxQueueSize
);

// Event listeners for monitoring/logging
highVolumePdfQueue.on('jobCompleted', (data) => {
  if (data.completed % 100 === 0) {
    // Log every 100 completions
    console.log(
      `PDF Queue: ${data.completed} jobs completed, avg time: ${
        highVolumePdfQueue.getStats().avgProcessingTime
      }ms`
    );
  }
});

highVolumePdfQueue.on('jobFailed', (data) => {
  console.error(`PDF Job ${data.jobId} failed: ${data.error}`);
});

export async function renderPdfWorker(
  c: Context,
  filename: string,
  docDefinition: any,
  priority: number = 0,
  timeout?: number
) {
  try {
    const buffer = await highVolumePdfQueue.render(
      docDefinition,
      priority,
      timeout
    );

    c.header('Content-Type', 'application/pdf');
    c.header('Content-Disposition', `inline; filename=${filename}.pdf`);
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

// Health check endpoint helper
export function getPdfQueueHealth() {
  return highVolumePdfQueue.getHealth();
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await highVolumePdfQueue.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await highVolumePdfQueue.shutdown();
  process.exit(0);
});

export { highVolumePdfQueue };
