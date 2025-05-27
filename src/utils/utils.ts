import _ from 'lodash';

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
 * @returns Parsed Date object or null if the format is invalid
 */
export const parseDateToISODate = (dateStr: string): Date | null => {
  const match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2}) ([+-]\d{2}:\d{2})/);

  if (!match) {
    return null;
  }

  const [, month, day, year, time, offset] = match;
  const iso = `${year}-${month}-${day}T${time}${offset}`;
  return new Date(iso);
};
