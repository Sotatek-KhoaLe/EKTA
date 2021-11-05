import * as assert from 'assert';
import * as moment from 'moment';
import { Moment } from 'moment';

/*
  Format
 */
export const DateTimeFormat = {
  '-dmy': 'D-M-YYYY',
  '-ymd': 'YYYY-M-D',
  '/dmy': 'D/M/YYYY',
  '/mdy': 'M/D/YYYY',
  '/ymd': 'YYYY/M/D',

  '/mdyy': 'M/D/YY',
  '/dmyy': 'D/M/YY',
  '/yymd': 'YY/M/D',

  '-dmy hms': 'D-M-YYYY H:m:s',
  '-ymd hms': 'YYYY-M-D H:m:s',
  '/dmy hms': 'D/M/YYYY H:m:s',
  '/ymd hms': 'YYYY/M/D H:m:s',
};

function replace(s: string): string {
  s = s.replace(/D/, 'DD');
  s = s.replace(/M/, 'MM');
  s = s.replace(/H/, 'HH');
  s = s.replace(/m/, 'mm');
  s = s.replace(/s/, 'ss');
  return s;
}

const DateTimeOutFormat = Object.fromEntries(
  Object.entries(DateTimeFormat).map(([key, value]) => [key, replace(value)]),
);
const BaseFormat = {
  mm: 'moment',
  dt: 'datetime',
  tz: 'YYYY-MM-DDTHH:mm:ss',
};
const StrOutFormat = {
  ...BaseFormat,
  ...DateTimeOutFormat,
};
const StrFormat = {
  ...BaseFormat,
  ...DateTimeFormat,
};

function isValidFormat(inValue: Moment | string, inFormat: string): boolean {
  return (
    (inFormat === 'mm' && inValue instanceof moment) ||
    (typeof inValue === 'string' && inValue.length > 0 && Object.keys(StrFormat).includes(inFormat))
  );
}

export function convertFormat(inValue: Moment | string, inFormat: string, outFormat: string): string {
  assert(
    isValidFormat(inValue, inFormat) && Object.keys(StrOutFormat).includes(outFormat) && outFormat !== 'mm',
    'Invalid input data',
  );

  const inDatetime: Moment =
    inValue instanceof moment
      ? moment(inValue) //
      : moment(inValue, StrFormat[inFormat], true);
  try {
    assert(inDatetime.isValid(), 'Invalid date');
  } catch (e) {
    console.log(e);
  }

  return inDatetime.format(StrOutFormat[outFormat]);
}

/*
  Exchange
 */

/*
  Compute
 */
