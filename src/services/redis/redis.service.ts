import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setValue(key: string, value: any, ttl: number = 10000): Promise<any> {
    const storedValue = typeof value === 'string' ? value : JSON.stringify(value);

    const storedKey = typeof key !== 'string' ? `${key}` : key;

    return await this.cacheManager.set(storedKey, storedValue, ttl)
  }

  async getValue(key: string): Promise<any> {
    const storedKey = typeof key !== 'string' ? `${key}` : key;

    const value = await this.cacheManager.get(storedKey);

    if (!value) return null;
    try {
      const parsed = JSON.parse(value as any)
      return parsed
    } catch {
      return value; // It was a plain string
    }
  }

  async deleteValue(key: string): Promise<any> {
    const storedKey = typeof key !== 'string' ? `${key}` : key;
    return await this.cacheManager.del(storedKey);
  }

  async clearCache(): Promise<any> {
    return await this.cacheManager.clear();
  }
}