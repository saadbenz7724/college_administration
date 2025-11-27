import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { Request, Response } from 'express';
import { Logger } from "winston";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter{
    constructor(
        @Inject('winston') private readonly logger: Logger,
    ){}
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';

        if(exception instanceof HttpException){
            status = exception.getStatus();
            const res: any = exception.getResponse();
            message = res?.message || res || exception.message;
        }
        this.logger.error({
            message: message,
            method: request.method,
            url: request.url,
            statusCode: status,
            timestamp: new Date().toISOString(),
            stack: exception instanceof Error ? exception.stack: null,
        });
        return response.status(status).json({
            success: false,
            statusCode: status,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}