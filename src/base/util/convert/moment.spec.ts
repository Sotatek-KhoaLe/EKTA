import { convertFormat } from './moment.convert';
import * as moment from 'moment';
import { AssertionError } from 'assert';

describe('function Chuyển đổi thời gian', () => {
  it('should: -dmy > /dmy', () => {
    const input = '20-11-2021';
    const output = '20/11/2021';
    expect(convertFormat(input, '-dmy', '/dmy')).toEqual(output);
  });
  it('should: -dmy > /ymd', () => {
    const input = '20-11-2021';
    const output = '2021/11/20';
    expect(convertFormat(input, '-dmy', '/ymd')).toEqual(output);
  });
  it('should: -dmy hms > /dmy hms', () => {
    const input = '20-11-2021 01:02:03';
    const output = '20/11/2021 01:02:03';
    expect(convertFormat(input, '-dmy hms', '/dmy hms')).toEqual(output);
  });
  it('should: mm > /dmy', () => {
    const input = moment('20-11-2021', 'DD-MM-YYYY');
    const output = '20/11/2021';
    expect(input).toBeInstanceOf(moment);
    expect(input.format('DD/MM/YYYY')).toEqual(output);
    expect(convertFormat(input, 'mm', '/dmy')).toEqual(output);
  });
  it('should: mm > /dmy hms', () => {
    const input = moment('20-11-2021 01:02:03', 'DD-MM-YYYY HH:mm:ss');
    const output = '20/11/2021 01:02:03';
    expect(convertFormat(input, 'mm', '/dmy hms')).toEqual(output);
  });
  it('should: mm > tz', () => {
    const input = moment('20-11-2021 01:02:03', 'DD-MM-YYYY HH:mm:ss');
    const output = '2021-11-20T01:02:03';
    expect(convertFormat(input, 'mm', 'tz')).toEqual(output);
  });
  it('should: str > mm', () => {
    const input1 = 'abc123';
    const input = '2021-11-20T01:02:03';
    const format = 'DD-MM-YYYY HH:mm:ss';
    expect(moment(input, format).isValid()).toBeTruthy();
    expect(moment(input1, format).isValid()).toBeTruthy();
    expect(moment(input1, format, true).isValid()).toBeFalsy();
  });
});
