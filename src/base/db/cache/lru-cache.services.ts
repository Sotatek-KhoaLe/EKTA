import * as DataLoader from 'dataloader';
import * as LRU from 'lru-cache';

export const lruCacheMap = <K, V>(lru: LRU<K, V>): DataLoader.CacheMap<K, Promise<V>> => {
  return {
    get: key => {
      const value = lru.get(key);
      if (value !== undefined) return Promise.resolve(value);
    },
    set: async (key, value) => {
      const resolved = await value;
      lru.set(key, resolved);
    },
    delete: key => lru.del(key),
    clear: () => lru.reset(),
  };
};
