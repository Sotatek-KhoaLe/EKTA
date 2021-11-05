import fs = require('fs');
import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError as NestValidationError } from '@nestjs/common';

import { Payload, defaultPayload } from '../api.schemas';

/**
 * MODULE_ACTION_ERROR: xyyzzt
 * @param x {string}: module
 * @param y {number}: function
 * @param z {number}: error code in function
 * @param t {char}: first char of filename
 **/

// 00 GLOBAL
export const SUCCESS = '000000';
export const UNKNOWN = '999999';
export const SYSTEM_ERROR = '000001';
export const REQUIRE_LOGIN = '000002';
export const UNKNOWN_METHOD = '000003';
export const SEARCH_CHECK_KEYWORD = '000006';
export const NOT_ENOUGH_PARAM = '000007';
export const NOT_FOUND = '000008';
export const VALIDATION = '000009';
export const DUPLICATE = '000010';

export const STATUS_CODE_MAP: Record<string, any> = {
  [HttpStatus.NOT_FOUND]: NOT_FOUND,
};

const ALL_MESSAGES: Record<string, any> = {
  [SUCCESS]: 'Thành công',
  [UNKNOWN]: 'Lỗi không xác định',
  [SYSTEM_ERROR]: 'Hệ thống đang bận, vui lòng thử lại sau.',
  [REQUIRE_LOGIN]: 'Yêu cầu đăng nhập',
  [UNKNOWN_METHOD]: 'Phương thức không xác định',
  [SEARCH_CHECK_KEYWORD]: 'Kiểm tra lại các trường tìm kiếm',
  [NOT_ENOUGH_PARAM]: 'Không đủ các param cần thiết',
  [NOT_FOUND]: 'Không tìm thấy dữ liệu',
  [VALIDATION]: 'Lỗi định dạng dữ liệu gửi lên',
  [DUPLICATE]: 'Trùng lặp dữ liệu',
};
export const SUCCESS_MESSAGE = ALL_MESSAGES[SUCCESS];
const ALL_ERROR_CODE = Object.keys(ALL_MESSAGES);

const getMessageFromCode = (errorCode: string, defaultMessage: string): string => {
  let message = ALL_MESSAGES[errorCode] || '';
  if (!message) {
    const errorCodeWoutPrefix = ALL_ERROR_CODE.filter(item => errorCode.endsWith(item));
    message = errorCodeWoutPrefix[0] ? ALL_MESSAGES[errorCodeWoutPrefix[0]] : message;
  }
  message = message || defaultMessage;
  if (!message) fs.writeFile('error-codes-missing-message.log', errorCode + '\n', { flag: 'a' }, () => {});
  return message;
};

export abstract class BaseException<TData> extends HttpException {
  protected constructor(partial: Payload<TData>, statusCode: number, defaultMessage = '') {
    const payload = {
      ...defaultPayload,
      ...partial,
    };
    payload.success = payload.errorCode == SUCCESS;
    payload.message = payload.message || getMessageFromCode(payload.errorCode, defaultMessage);
    super(payload, statusCode);
  }
}

/**
 * response to client an error
 * @example
 * throw new exc.BusinessException<number>({
    errorCode: 'USER011C',
    message: 'exc msg',
    data: 1
  });
 */
export class BusinessException<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>, statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(payload, statusCode);
  }
}

export class BadRequest<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(payload, HttpStatus.BAD_REQUEST);
  }
}

export class Unauthorized<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(payload, HttpStatus.UNAUTHORIZED);
  }
}

export class Forbidden<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(payload, HttpStatus.FORBIDDEN);
  }
}

export class NotFound<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(payload, HttpStatus.NOT_FOUND, ALL_MESSAGES[NOT_FOUND]);
  }
}

export class MethodNotAllowed<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(payload, HttpStatus.METHOD_NOT_ALLOWED);
  }
}

export class NotAcceptable<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(payload, HttpStatus.NOT_ACCEPTABLE);
  }
}

export class Conflict<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(payload, HttpStatus.CONFLICT);
  }
}

export class UnsupportedMediaType<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(payload, HttpStatus.UNSUPPORTED_MEDIA_TYPE, 'Định dạng không được hỗ trợ');
  }
}

export class TemporaryRedirect<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(payload, HttpStatus.TEMPORARY_REDIRECT);
  }
}

export class PayloadTooLarge<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(payload, HttpStatus.PAYLOAD_TOO_LARGE, 'Dữ liệu vượt quá kích thước cho phép');
  }
}

export class ValidationPartialError<TData> extends BadRequest<TData> {
  constructor(payload: Payload<TData>) {
    super({
      errorCode: VALIDATION,
      ...payload,
    });
  }
}

export class ValidationError extends BadRequest<any[]> {
  constructor(validationErrors: NestValidationError[]) {
    const payload: Payload<any[]> = {
      errorCode: VALIDATION,
      data: validationErrors.reduce((acc, cur) => {
        if (acc.length === 0) {
          const item = { target: cur.target };
          delete cur.target;
          item['error'] = [cur];
          acc.push(item);
          return acc;
        }
        delete cur.target;
        acc[0]['error'].push(cur);
        return acc;
      }, []),
    };
    super(payload);
  }
}

export class QueryDbError extends BadRequest<any> {
  constructor(payload: Payload<any>) {
    super(payload);
  }
}
