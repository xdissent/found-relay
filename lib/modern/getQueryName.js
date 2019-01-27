'use strict';

exports.__esModule = true;
exports.default = getQueryName;
function getQueryName(route) {
  if (process.env.NODE_ENV !== 'production') {
    var query = route.query;

    if (query && query.modern) {
      query = query.modern;
    }

    if (typeof query === 'function') {
      query = query();
      if (query.name) return query.name;
      if (query.params && query.params.name) return query.params.name;
    }
  }

  return 'UNKNOWN';
}
module.exports = exports['default'];