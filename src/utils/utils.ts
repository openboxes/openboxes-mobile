import _ from 'lodash';
import { appConfig, DEFAULT_DATE_FORMAT_OPTIONS } from '../constants';

export function parseResponse(data) {
  if (_.isArray(data)) {
    return _.map(data, (value) => parseResponse(value));
  }

  if (_.isPlainObject(data)) {
    const obj = {};
    _.forEach(data, (value, key) => {
      _.set(obj, key, parseResponse(value));
    });
    return obj;
  }

  return data;
}

/**
 * @function parseDateToISODate
 * @description Parses the date string into a Date object.
 *
 * @param dateStr Expected date string in the format "MM/DD/YYYY HH:mm ±HH:mm"
 * @returns Parsed Date object or initial string if the format is invalid
 */
export const parseDateToISODate = (dateStr: string): Date | string => {
  if (!dateStr) {
    return dateStr;
  }

  const match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2}) ([+-]\d{2}:\d{2})/);

  if (!match) {
    return dateStr;
  }

  const [, month, day, year, time, offset] = match;
  const iso = `${year}-${month}-${day}T${time}${offset}`;
  const parsedDate = new Date(iso);

  // Check if the date constructed is valid, `parsedDate.getTime()` returns NaN for invalid dates
  if (isNaN(parsedDate.getTime())) {
    return dateStr;
  }

  return parsedDate;
};

/**
 * @function parseFromISODateToLocaleString
 * @description Parses the date string into a locale-specific date string.
 *
 * @param dateStr Expected date string in the ISO 8601 format.
 * @return Formatted date string in the locale's date format or the original string if parsing fails.
 *
 * @example
 */
export function parseFromISODateToLocaleString(dateStr: Date | string): string {
  return dateStr instanceof Date ? dateStr.toLocaleDateString(appConfig.LOCALE, DEFAULT_DATE_FORMAT_OPTIONS) : dateStr;
}
