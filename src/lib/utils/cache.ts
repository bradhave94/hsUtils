type CacheEntry<T> = {
    data: T;
    timestamp: number;
};

export enum CacheType {
    BLOGS = 'blogs',
    PAGES = 'pages',
    BLOG_INFO = 'blog_info',
    PAGE_INFO = 'page_info'
}

class Cache {
    private static instance: Cache;
    private cache: Map<string, CacheEntry<any>> = new Map();
    private readonly TTL = 5 * 60 * 1000; // 5 minutes cache duration

    private constructor() {}

    static getInstance(): Cache {
        if (!Cache.instance) {
            Cache.instance = new Cache();
        }
        return Cache.instance;
    }

    private generateKey(type: CacheType, accessToken: string, params: Record<string, any> = {}): string {
        const paramString = Object.entries(params)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}_${value}`)
            .join('_');
        return `${type}_${paramString}_${accessToken}`;
    }

    set<T>(type: CacheType, accessToken: string, data: T, params: Record<string, any> = {}): void {
        const key = this.generateKey(type, accessToken, params);
        console.log(`🔵 Cache: Setting data for ${type}`, { params });
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }

    get<T>(type: CacheType, accessToken: string, params: Record<string, any> = {}): T | null {
        const key = this.generateKey(type, accessToken, params);
        const entry = this.cache.get(key);
        
        if (!entry) {
            console.log(`🔴 Cache Miss: No data found for ${type}`, { params });
            return null;
        }

        if (Date.now() - entry.timestamp > this.TTL) {
            console.log(`🟡 Cache Expired: Data for ${type} has expired`, { params });
            this.cache.delete(key);
            return null;
        }

        console.log(`🟢 Cache Hit: Retrieved data for ${type}`, { params });
        return entry.data as T;
    }

    invalidateType(type: CacheType, accessToken: string): void {
        let count = 0;
        for (const key of this.cache.keys()) {
            if (key.startsWith(`${type}_`) && key.endsWith(accessToken)) {
                this.cache.delete(key);
                count++;
            }
        }
        console.log(`🗑️ Cache: Invalidated ${count} entries for ${type}`);
    }

    invalidateAll(accessToken: string): void {
        let count = 0;
        for (const key of this.cache.keys()) {
            if (key.endsWith(accessToken)) {
                this.cache.delete(key);
                count++;
            }
        }
        console.log(`🗑️ Cache: Invalidated all ${count} entries`);
    }

    // New method to inspect cache contents
    debug(): void {
        console.log('\n🔍 Cache Debug Info:');
        console.log('Total entries:', this.cache.size);
        console.log('Approximate memory usage:', 
            Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB');
        for (const [key, entry] of this.cache.entries()) {
            const age = Math.round((Date.now() - entry.timestamp) / 1000);
            console.log(`- ${key}: ${age}s old`);
        }
        console.log('\n');
    }
}

export default Cache.getInstance(); 