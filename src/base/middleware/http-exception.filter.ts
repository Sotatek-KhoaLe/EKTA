import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

import { LoggingService } from '@/base/logging';
import * as exc from '@/base/api/exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  private logger = this.loggingService.getLogger('http-exception');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    let excResponse = exception.getResponse();
    if (typeof excResponse !== 'object' || !excResponse.hasOwnProperty('success')) {
      let newDataResponse: Record<string, any> =
        typeof excResponse === 'object' ? excResponse : { message: excResponse };
      newDataResponse = newDataResponse?.message;
      excResponse = new exc.BadRequest({
        errorCode: exc.STATUS_CODE_MAP[status] ?? exc.UNKNOWN,
        data: newDataResponse,
      }).getResponse();
    }
    response.status(status).json(excResponse);
    this.logger.debug(exception.getStatus(), excResponse);
  }
}
