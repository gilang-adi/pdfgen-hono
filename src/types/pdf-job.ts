export interface PdfJob {
  id: string;
  docDefinition: any;
  resolve: (buffer: Buffer) => void;
  reject: (err: Error) => void;
  priority: number;
  createdAt: number;
  timeout?: NodeJS.Timeout;
}

export interface QueueStats {
  queueLength: number;
  processing: number;
  completed: number;
  failed: number;
  maxConcurrent: number;
  avgProcessingTime: number;
}
