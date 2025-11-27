import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { Logger } from "winston";

@Injectable()
export class LoggingInterceptor implements NestInterceptor{
    constructor(
        @Inject('winston') private readonly logger: Logger
    ){}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const { method, originalUrl } = req;
        const startTime = Date.now()

        return next.handle().pipe(
            tap(()=>{
                const responseTime = Date.now() - startTime;
                this.logger.info(`${method} ${originalUrl} - ${responseTime}ms`);
            }),
        );
    }
}