import { Injectable } from '@nestjs/common';
import { Logger, QueryRunner } from 'typeorm';
import {
  configure, //
  getLogger,
  addLayout,
  Logger as FourLogger,
  Appender,
  Layout,
} from 'log4js';

import { config } from '@/config';
import { QueryDbError } from '@/base/db/db.constant';

const layouts: Record<string, Layout> = {
  console: {
    type: 'pattern',
    pattern: '%-6p %d %25.25f{2}:%-4.-4l| %[%.6000m (%c)%]',
  },
  dateFile: {
    type: 'pattern',
    pattern: '%-6p %d %25.25f{2}:%-4.-4l| %m (%c)',
  },
  access: {
    type: 'pattern',
    pattern: 'ACCESS %d %28.28x{remote_addr}  | %x{access} (%c)',
    tokens: {
      remote_addr: function (logEvent) {
        const [remote_addr, ...data] = logEvent.data.toString().split(' ');
        return remote_addr;
      },
      access: function (logEvent) {
        const [remote_addr, ...data] = logEvent.data.toString().split(' ');
        data.pop();
        return data.join(' ');
      },
    },
  },
};

const appenders: Record<string, Appender> = {
  console: {
    type: 'console',
    layout: layouts.console,
  },
  dateFile: {
    type: 'dateFile',
    filename: 'logs/out.log',
    pattern: '-yyyy-MM-dd',
    layout: layouts.dateFile,
  },
  access: {
    type: 'console',
    layout: layouts.access,
  },
  dateFileAccess: {
    type: 'dateFile',
    filename: 'logs/out.log',
    pattern: '-yyyy-MM-dd',
    layout: layouts.access,
  },
};

class DbLogger implements Logger {
  constructor(private logger: FourLogger) {}

  /**
   * Logs query and parameters used in it.
   */
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    this.logger.debug(`query=${query}` + (parameters ? ` parameters=${JSON.stringify(parameters)}` : ``));
  }

  /**
   * Logs query that is failed.
   */
  logQueryError(error: any, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    this.logger.debug(error);
    const errorMessage = error.message ? error.message : error;
    if (Object.values(QueryDbError).includes(error.code)) return this.logger.warn(errorMessage);

    this.logger.error(errorMessage);
    this.logger.error(`query=${query} parameters=${JSON.stringify(parameters)}`);
  }

  /**
   * Logs query that is slow.
   */
  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    this.logger.warn(`time=${time} query=${query} parameters=${JSON.stringify(parameters)}`);
  }

  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {}

  /**
   * Logs events from the migrations run process.
   */
  logMigration(message: string, queryRunner?: QueryRunner): any {}

  /**
   * Perform logging using given logger, or by default to the console.
   * Log has its own level and message.
   */
  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
    this.logger[level](message);
  }
}

@Injectable()
export class LoggingService {
  /**
   * config logging
   * ________________________________________
   * | NODE_ENV | DEBUG true  | DEBUG false |
   * ---------------------------------------=
   * | dev      | debug       | info        |
   * | test     | debug       | off         |
   * | product  | info        | info        |
   * ----------------------------------------
   * @function getLogger: đăng ký logger + category
   * @function getDbLogger: đăng ký logger database + category
   * @function logger: sử dụng logger đã được đăng ký mặc định
   */
  constructor() {
    const isTesting = config.NODE_ENV === config.TEST;
    const isDev = config.NODE_ENV === config.DEV;
    const level = config.DEBUG ? 'debug' : 'info';

    configure({
      appenders: appenders,
      categories: {
        default: {
          appenders: ['console', 'dateFile'],
          level: level,
          enableCallStack: true,
        },
        access: {
          appenders: ['access', 'dateFileAccess'],
          level: 'info',
          enableCallStack: true,
        },
      },
    });
  }

  getLogger = getLogger;

  private _access = () => {
    const logger = this.getLogger('access');
    return {
      write: logger.info.bind(logger),
    };
  };

  logger = {
    default: getLogger('default'),
    access: this._access(),
    thirdParty: getLogger('thirdParty'),
  };

  getDbLogger(category: string) {
    return new DbLogger(this.getLogger(category));
  }
}
