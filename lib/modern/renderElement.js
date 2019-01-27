'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = renderElement;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _getQueryName = require('./getQueryName');

var _getQueryName2 = _interopRequireDefault(_getQueryName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderElement(_ref) {
  var match = _ref.match,
      Component = _ref.Component,
      isComponentResolved = _ref.isComponentResolved,
      hasComponent = _ref.hasComponent,
      readyState = _ref.readyState,
      resolving = _ref.resolving;
  var route = match.route,
      router = match.router;
  var error = readyState.error,
      props = readyState.props;


  if (!route.render) {
    if (!isComponentResolved || !error && !props) {
      return undefined;
    }

    if (!props || !hasComponent) {
      process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(hasComponent, 'Route with query `%s` has no render method or component.', (0, _getQueryName2.default)(route)) : void 0;

      return null;
    }

    return _react2.default.createElement(Component, (0, _extends3.default)({ match: match, router: router }, props));
  }

  return route.render((0, _extends3.default)({}, readyState, {
    match: match,
    Component: isComponentResolved ? Component : null,
    props: props && (0, _extends3.default)({ match: match, router: router }, props),
    resolving: resolving
  }));
}
module.exports = exports['default'];