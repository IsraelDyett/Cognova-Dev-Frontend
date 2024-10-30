import { createClient, RedisClientType } from 'redis';

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const redisClientSingleton = () => {
    if(process.env.USE_REDIS == "1"){
        const client = createClient({
            url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
        });
    
        client.on('error', (err) => console.error('Redis Client Error', err));
        client.connect()
            .then(() => {
                console.info('[REDIS] Redis client connected..');
            })
            .catch((error) => {
                console.error(`[ERROR] Couldn't connect to Redis client: ${error}`);
            });
    
        return client;
    }
    return {} as RedisClientType;
};

declare global {
    var redis: undefined | ReturnType<typeof redisClientSingleton>;
}

export const redis = globalThis.redis ?? redisClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.redis = redis;
