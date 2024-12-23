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
