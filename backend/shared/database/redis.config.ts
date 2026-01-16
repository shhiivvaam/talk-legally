import { RedisModuleOptions } from '@nestjs-modules/ioredis';

export const getRedisConfig = (): RedisModuleOptions => ({
  config: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',

    connectTimeout: 10_000,
    commandTimeout: 5_000,
    keepAlive: 30_000,

    maxRetriesPerRequest: 3,
    maxLoadingRetryTime: 5_000,
    lazyConnect: true,

    retryStrategy: (times) => {
      if (times > 10) return null;
      return Math.min(times * 100, 2000);
    },

    enableReadyCheck: true,
    enableOfflineQueue: false,

    reconnectOnError: (err) =>
      ['READONLY', 'ECONNRESET'].some(e => err.message.includes(e)),
  },
});
