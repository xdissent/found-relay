'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncGenerator2 = require('babel-runtime/helpers/asyncGenerator');

var _asyncGenerator3 = _interopRequireDefault(_asyncGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _ResolverUtils = require('found/lib/ResolverUtils');

var _isPromise = require('is-promise');

var _isPromise2 = _interopRequireDefault(_isPromise);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _QuerySubscription = require('./QuerySubscription');

var _QuerySubscription2 = _interopRequireDefault(_QuerySubscription);

var _ReadyStateRenderer = require('./ReadyStateRenderer');

var _ReadyStateRenderer2 = _interopRequireDefault(_ReadyStateRenderer);

var _renderElement = require('./renderElement');

var _renderElement2 = _interopRequireDefault(_renderElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Resolver = function () {
  function Resolver(environment) {
    (0, _classCallCheck3.default)(this, Resolver);

    this.environment = environment;

    this.lastQueries = [];
    this.lastRouteVariables = [];
    this.lastQuerySubscriptions = [];
  }

  Resolver.prototype.resolveElements = function () {
    var _ref = _asyncGenerator3.default.wrap( /*#__PURE__*/_regenerator2.default.mark(function _callee(match) {
      var routeMatches, Components, queries, cacheConfigs, dataFroms, routeVariables, querySubscriptions, fetches, earlyComponents, earlyData, fetchedComponents, pendingElements;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              routeMatches = (0, _ResolverUtils.getRouteMatches)(match);
              Components = (0, _ResolverUtils.getComponents)(routeMatches);
              queries = (0, _ResolverUtils.getRouteValues)(routeMatches, function (route) {
                return route.getQuery;
              }, function (route) {
                return route.query;
              });
              cacheConfigs = (0, _ResolverUtils.getRouteValues)(routeMatches, function (route) {
                return route.getCacheConfig;
              }, function (route) {
                return route.cacheConfig;
              });
              dataFroms = (0, _ResolverUtils.getRouteValues)(routeMatches, function (route) {
                return route.getDataFrom;
              }, function (route) {
                return route.dataFrom;
              });
              routeVariables = this.getRouteVariables(match, routeMatches);
              querySubscriptions = this.updateQuerySubscriptions(queries, routeVariables, cacheConfigs, dataFroms);
              fetches = querySubscriptions.map(function (querySubscription) {
                return querySubscription && querySubscription.fetch();
              });

              if (!Components.some(_isPromise2.default)) {
                _context.next = 14;
                break;
              }

              _context.next = 11;
              return _asyncGenerator3.default.await(_promise2.default.all(Components.map(_ResolverUtils.checkResolved)));

            case 11:
              _context.t0 = _context.sent;
              _context.next = 15;
              break;

            case 14:
              _context.t0 = Components;

            case 15:
              earlyComponents = _context.t0;
              _context.next = 18;
              return _asyncGenerator3.default.await(_promise2.default.all(fetches.map(_ResolverUtils.checkResolved)));

            case 18:
              earlyData = _context.sent;
              fetchedComponents = void 0;

              if (!(!earlyComponents.every(_ResolverUtils.isResolved) || !earlyData.every(_ResolverUtils.isResolved))) {
                _context.next = 31;
                break;
              }

              pendingElements = this.createElements(routeMatches, earlyComponents, querySubscriptions, false);
              _context.next = 24;
              return pendingElements.every(function (element) {
                return element !== undefined;
              }) ? pendingElements : undefined;

            case 24:
              _context.next = 26;
              return _asyncGenerator3.default.await(_promise2.default.all(Components));

            case 26:
              fetchedComponents = _context.sent;
              _context.next = 29;
              return _asyncGenerator3.default.await(_promise2.default.all(fetches));

            case 29:
              _context.next = 32;
              break;

            case 31:
              fetchedComponents = earlyComponents;

            case 32:
              _context.next = 34;
              return this.createElements(routeMatches, fetchedComponents, querySubscriptions, true);

            case 34:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function resolveElements(_x) {
      return _ref.apply(this, arguments);
    }

    return resolveElements;
  }();

  Resolver.prototype.getRouteVariables = function getRouteVariables(match, routeMatches) {
    return (0, _ResolverUtils.accumulateRouteValues)(routeMatches, match.routeIndices, function (variables, routeMatch) {
      var route = routeMatch.route,
          routeParams = routeMatch.routeParams;

      // We need to always run this to make sure we don't miss route params.

      var nextVariables = (0, _extends3.default)({}, variables, routeParams);
      if (route.prepareVariables) {
        nextVariables = route.prepareVariables(nextVariables, routeMatch);
      }

      return nextVariables;
    }, null);
  };

  Resolver.prototype.updateQuerySubscriptions = function updateQuerySubscriptions(queries, routeVariables, cacheConfigs, dataFroms) {
    var _this = this;

    var _environment$unstable = this.environment.unstable_internal,
        createOperationDescriptor = _environment$unstable.createOperationDescriptor,
        getRequest = _environment$unstable.getRequest,
        getOperation = _environment$unstable.getOperation;

    // FIXME: Use getRequest directly when only supporting relay >=1.5.0.

    var getRequestOrOperation = getRequest || getOperation;

    var querySubscriptions = queries.map(function (query, i) {
      if (!query) {
        return null;
      }

      var variables = routeVariables[i];

      if (_this.lastQueries[i] === query && (0, _isEqual2.default)(_this.lastRouteVariables[i], variables)) {
        // Match the logic in <QueryRenderer> for not refetching.
        var lastQuerySubscription = _this.lastQuerySubscriptions[i];
        _this.lastQuerySubscriptions[i] = null;
        return lastQuerySubscription;
      }

      return new _QuerySubscription2.default(_this.environment, createOperationDescriptor(getRequestOrOperation(query), variables), cacheConfigs[i], dataFroms[i]);
    });

    this.lastQuerySubscriptions.forEach(function (querySubscription) {
      if (querySubscription) {
        querySubscription.dispose();
      }
    });

    this.lastQueries = queries;
    this.lastRouteVariables = routeVariables;
    this.lastQuerySubscriptions = querySubscriptions;

    return querySubscriptions;
  };

  Resolver.prototype.createElements = function createElements(routeMatches, Components, querySubscriptions, fetched) {
    return routeMatches.map(function (match, i) {
      var route = match.route,
          router = match.router;


      var Component = Components[i];
      var querySubscription = querySubscriptions[i];

      var isComponentResolved = (0, _ResolverUtils.isResolved)(Component);

      // Handle non-Relay routes.
      if (!querySubscription) {
        if (route.render) {
          return route.render({
            match: match,
            Component: isComponentResolved ? Component : null,
            props: match
          });
        }

        if (!isComponentResolved) {
          return undefined;
        }

        return Component ? _react2.default.createElement(Component, { match: match, router: router }) : null;
      }

      var resolvedComponent = isComponentResolved ? Component : null;
      var hasComponent = Component != null;

      var element = (0, _renderElement2.default)({
        match: match,
        Component: resolvedComponent,
        isComponentResolved: isComponentResolved,
        hasComponent: hasComponent,
        readyState: querySubscription.readyState,
        resolving: true
      });

      if (element === undefined) {
        return element;
      }

      return _react2.default.createElement(_ReadyStateRenderer2.default, {
        match: match,
        Component: resolvedComponent,
        isComponentResolved: isComponentResolved,
        hasComponent: hasComponent,
        element: element,
        querySubscription: querySubscription,
        fetched: fetched
      });
    });
  };

  return Resolver;
}();

exports.default = Resolver;
module.exports = exports['default'];