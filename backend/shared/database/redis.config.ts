import { RedisModuleOptions } from '@nestjs-modules/ioredis';

export const getRedisConfig = (): RedisModuleOptions => ({
  config: {
    // Connection
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    lazyConnect: true,

    // Timeouts & socket health
    connectTimeout: 10_000,
    commandTimeout: 5_000,
    keepAlive: 30_000,
    maxLoadingRetryTime: 5_000,

    // Retry strategy
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 10) return null;
      return Math.min(times * 100, 2000);
    },

    // Stability & memory safety
    enableReadyCheck: true,
    enableOfflineQueue: false,

    // Safety in multi-service environments
    keyPrefix: process.env.REDIS_PREFIX || `${process.env.SERVICE_NAME || 'app'}:`,

    // Reconnect only on safe errors
    reconnectOnError: (err) =>
      ['READONLY', 'ECONNRESET'].some(e => err.message.includes(e)),

    // Better debugging outside prod
    showFriendlyErrorStack: process.env.NODE_ENV !== 'production',
  },
});
