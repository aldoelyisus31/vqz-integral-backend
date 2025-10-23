import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActionLogsService } from '../action-logs.service';
import { LOG_ACTION_KEY, LogActionMetadata } from '../decorators/log-action.decorator';

@Injectable()
export class ActionLogInterceptor implements NestInterceptor {
  constructor(
    private readonly actionLogsService: ActionLogsService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logMetadata = this.reflector.get<LogActionMetadata>(
      LOG_ACTION_KEY,
      context.getHandler(),
    );

    if (!logMetadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const { method, url, user } = request;

    // Debug logs para ver qué llega
    console.log('🔍 LogActionInterceptor - Debug Info:');
    console.log('- Has logMetadata:', !!logMetadata);
    console.log('- Method:', method);
    console.log('- URL:', url);
    console.log('- User object:', user);
    console.log('- User ID (userId):', user?.userId);
    console.log('- User ID (sub):', user?.sub);
    console.log('- User ID (id):', user?.id);

    return next.handle().pipe(
      tap({
        next: (result) => {
          // Buscar el userId en diferentes propiedades posibles del JWT
          const actualUserId = user?.userId || user?.sub || user?.id;
          
          let enhancedDescription = logMetadata.description;
          
          // Buscar recordId en la respuesta estándar
          if (result && (result.recordId || result.id)) {
            const recordId = result.recordId || result.id;
            enhancedDescription = `${logMetadata.description} - Record ID: ${recordId}`;
          }
          
          console.log('🔍 LogActionInterceptor - Record ID extraction:');
          console.log('- URL:', url);
          console.log('- Result recordId:', result?.recordId);
          console.log('- Result id:', result?.id);
          console.log('- Final description:', enhancedDescription);
          
          this.saveLog(
            { ...logMetadata, description: enhancedDescription },
            actualUserId,
            method,
            url
          );
        },
        error: (error) => {
          console.log(`❌ Error in ${method} ${url}:`, error.message);
        },
      }),
    );
  }

  private async saveLog(
    logMetadata: LogActionMetadata,
    userId: number | undefined,
    method: string,
    endpoint: string,
  ): Promise<void> {
    if (!userId) {
      console.log('⚠️ No se guarda log - Usuario no autenticado para:', {
        action: logMetadata.action,
        endpoint
      });
      return;
    }

    try {
      await this.actionLogsService.create({
        action: logMetadata.action,
        textDescription: logMetadata.description,
        userId: userId,
        endpoint: endpoint,
        method: method,
      });
      console.log('✅ Log guardado exitosamente:', {
        action: logMetadata.action,
        userId: userId,
        endpoint
      });
    } catch (error) {
      console.error('❌ Error saving action log:', error);
    }
  }
}
