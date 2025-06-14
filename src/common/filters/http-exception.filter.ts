import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message || null,
      error: exception.name,
    };

    // Add validation errors if available
    const exceptionResponse = exception.getResponse();
    if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      const message = (exceptionResponse as any)['message'];
      errorResponse.message = Array.isArray(message) ? message.join(', ') : String(message);
    }

    response
      .status(status)
      .json(errorResponse);
  }
}