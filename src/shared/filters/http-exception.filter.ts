import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errors = exception.getResponse();
    console.log({ errors: errors, status: status, path: request.url, timestamp: new Date().toISOString() });
    response.status(status).json({
      errorInfo: errors,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
