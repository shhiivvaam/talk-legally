import { RedisModuleOptions } from '@nestjs-modules/ioredis';

export const getRedisConfig = (): RedisModuleOptions => ({
  type: 'single',
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  options: {
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  },
});
