'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QuerySubscription = function () {
  function QuerySubscription(environment, operation, cacheConfig, dataFrom) {
    var _this = this;

    (0, _classCallCheck3.default)(this, QuerySubscription);

    this.onChange = function (snapshot) {
      _this.updateReadyState({
        error: null,
        props: snapshot.data,
        retry: _this.retry
      });
    };

    this.retry = function () {
      _this.retrying = true;
      _this.retryingAfterError = !!_this.readyState.error;

      _this.dispose();
      _this.execute(function () {});
    };

    this.environment = environment;
    this.operation = operation;
    this.cacheConfig = cacheConfig;
    this.dataFrom = dataFrom;

    this.fetchPromise = null;
    this.selectionReference = null;
    this.pendingRequest = null;
    this.rootSubscription = null;

    this.retrying = false;
    this.retryingAfterError = false;

    this.readyState = {
      error: null,
      props: null,
      retry: null
    };

    this.listeners = [];

    this.relayContext = {
      environment: this.environment,
      variables: this.operation.variables
    };
  }

  QuerySubscription.prototype.fetch = function fetch() {
    var _this2 = this;

    if (!this.fetchPromise) {
      this.fetchPromise = new _promise2.default(function (resolve) {
        _this2.execute(resolve);
      });
    }

    return this.fetchPromise;
  };

  QuerySubscription.prototype.execute = function execute(resolve) {
    var _this3 = this;

    var snapshot = void 0;

    this.selectionReference = this.retain();

    var onSnapshot = function onSnapshot() {
      if (snapshot) {
        return;
      }

      snapshot = _this3.environment.lookup(_this3.operation.fragment);

      _this3.onChange(snapshot);

      _this3.rootSubscription = _this3.environment.subscribe(snapshot, _this3.onChange);

      resolve();
    };

    var onError = function onError(error) {
      _this3.updateReadyState({
        error: error,
        props: null,
        retry: _this3.retry
      });

      resolve();
    };

    var useStoreSnapshot = !this.retrying && (this.dataFrom === 'STORE_THEN_NETWORK' || this.dataFrom === 'STORE_OR_NETWORK') && this.environment.check(this.operation.root);

    if (!(this.dataFrom === 'STORE_OR_NETWORK' && useStoreSnapshot)) {
      try {
        this.pendingRequest = this.environment.execute({
          operation: this.operation,
          cacheConfig: this.cacheConfig
        }).finally(function () {
          _this3.pendingRequest = null;
        }).subscribe({
          next: onSnapshot,
          error: onError
        });
      } catch (error) {
        onError(error);
        return;
      }
    }

    // Only use the store snapshot if the network layer doesn't synchronously
    // resolve a snapshot, to match <QueryRenderer>.
    if (!snapshot && useStoreSnapshot) {
      onSnapshot();
    }

    if (!snapshot && this.retryingAfterError) {
      this.updateReadyState({
        error: null,
        props: null,
        retry: null
      });
    }
  };

  QuerySubscription.prototype.updateReadyState = function updateReadyState(readyState) {
    this.readyState = readyState;

    this.listeners.forEach(function (listener) {
      listener(readyState);
    });
  };

  QuerySubscription.prototype.subscribe = function subscribe(listener) {
    this.listeners.push(listener);
  };

  QuerySubscription.prototype.unsubscribe = function unsubscribe(listener) {
    this.listeners = this.listeners.filter(function (item) {
      return item !== listener;
    });
  };

  QuerySubscription.prototype.retain = function retain() {
    return this.environment.retain(this.operation.root);
  };

  QuerySubscription.prototype.dispose = function dispose() {
    this.fetchPromise = null;

    if (this.selectionReference) {
      this.selectionReference.dispose();
    }

    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }

    if (this.rootSubscription) {
      this.rootSubscription.dispose();
    }
  };

  return QuerySubscription;
}();

exports.default = QuerySubscription;
module.exports = exports['default'];