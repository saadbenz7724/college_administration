import { Inject, Injectable, Logger } from "@nestjs/common";
import Redis from "ioredis";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class CronService{
    private readonly logger = new Logger(CronService.name);

    constructor(
        @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    ){}

    @Cron(CronExpression.EVERY_30_SECONDS)
    async clearCacheJob(){
        try{
            this.logger.log('Clear Cache');

            const keys = await this.redisClient.keys('students:page:*');
            if(keys.length){
                await this.redisClient.del(...keys);
                this.logger.log(`Cleared ${keys.length} student cache key`);
            }
        } catch(err){
            this.logger.log(err as any);
        }
    }
}