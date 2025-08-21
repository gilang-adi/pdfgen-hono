import os from 'os';

export function getContainerLimits() {
  const cpuLimit =
    parseInt(process.env.ECS_CPU_LIMIT || '0') || os.cpus().length;
  const memoryLimit = parseInt(process.env.ECS_MEMORY_LIMIT || '0') || 512;

  const maxConcurrent = Math.min(
    Math.max(2, Math.floor(cpuLimit * 0.8)),
    Math.floor(memoryLimit / 64)
  );

  const maxQueueSize = Math.min(Math.floor(memoryLimit / 8), 10000);

  return {
    cpuLimit,
    memoryLimit,
    maxConcurrent,
    maxQueueSize,
  };
}
