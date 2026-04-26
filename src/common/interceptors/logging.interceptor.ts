import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const requestId = req.headers['x-request-id'] || uuidv4();
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-ID', requestId);

    const { method, url, ip } = req;
    const userAgent = req.headers['user-agent'] || '';
    const userId = req.user?.id || 'anonymous';

    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        const statusCode = res.statusCode;

        this.logger.log(
          `[${requestId}] ${method} ${url} ${statusCode} ${duration}ms | user:${userId} | ip:${ip} | ${userAgent}`,
          'HTTP',
        );
      }),
      catchError((error) => {
        const duration = Date.now() - start;
        this.logger.error(
          `[${requestId}] ${method} ${url} ERROR ${duration}ms | user:${userId}`,
          error.stack,
          'HTTP',
        );
        throw error;
      }),
    );
  }
}
