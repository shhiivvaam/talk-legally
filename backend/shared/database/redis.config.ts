import { RedisModuleOptions } from '@nestjs-modules/ioredis';

export const getRedisConfig = (): RedisModuleOptions => ({
  config: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
});
