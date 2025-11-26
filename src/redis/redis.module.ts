import { Global, Module } from "@nestjs/common";
import Redis from "ioredis";

@Global()
@Module({
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: async () =>{
                const client = new Redis({
                    host: 'localhost',
                    port: 6379,
                });
                client.on('connect', ()=>console.log('connected to redis'));
                client.on('error', (err) => console.error('redis error', err));

                return client;
            },
        },
    ],
    exports: ['REDIS_CLIENT'],
})
export class RedisModule {}