import * as _ from 'lodash/fp';

export const addKeyPrefix = (prefix: string) =>
  _.flow(
    _.toPairs,
    _.map(([key, value]) => [prefix + key, value]),
    _.fromPairs,
  );

export function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const randomChar = () => String.fromCharCode(random(33, 126));

export const randomString = (stringLength: number) => {
  let randomString = '';
  while (stringLength--) randomString += randomChar();
  return randomString;
};
