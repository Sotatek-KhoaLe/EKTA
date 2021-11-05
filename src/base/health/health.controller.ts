import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck, //
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
// import { ApiOperation } from '@/base/docs';
// import { SkipAuth } from '@/auth';

// @SkipAuth()
@Controller('')
export class HealthController {
  constructor(
    private health: HealthCheckService, //
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  // @ApiOperation({ summary: 'Api Kiểm tra tình trạng kết nối của server' })
  async check() {
    let health;
    try {
      health = await this.health.check([
        () => this.http.pingCheck('google.com', 'https://google.com'), //
      ]);
    } catch (e) {
      health = e.response;
    }
    return {
      health: {
        status: health.status,
        error: health.error,
        pingCheck: health.details,
      },
    };
  }
}
