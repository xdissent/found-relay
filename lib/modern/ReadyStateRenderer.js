'use strict';

exports.__esModule = true;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _elementType = require('prop-types-extra/lib/elementType');

var _elementType2 = _interopRequireDefault(_elementType);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactRelayContext = require('react-relay/lib/ReactRelayContext');

var _ReactRelayContext2 = _interopRequireDefault(_ReactRelayContext);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _getQueryName = require('./getQueryName');

var _getQueryName2 = _interopRequireDefault(_getQueryName);

var _QuerySubscription = require('./QuerySubscription');

var _QuerySubscription2 = _interopRequireDefault(_QuerySubscription);

var _renderElement = require('./renderElement');

var _renderElement2 = _interopRequireDefault(_renderElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hasOwnProperty = Object.prototype.hasOwnProperty;


var propTypes = {
  match: _propTypes2.default.shape({
    route: _propTypes2.default.object.isRequired
  }).isRequired,
  Component: _elementType2.default,
  isComponentResolved: _propTypes2.default.bool.isRequired,
  hasComponent: _propTypes2.default.bool.isRequired,
  element: _propTypes2.default.element,
  querySubscription: _propTypes2.default.instanceOf(_QuerySubscription2.default).isRequired,
  fetched: _propTypes2.default.bool.isRequired
};

var ReadyStateRenderer = function (_React$Component) {
  (0, _inherits3.default)(ReadyStateRenderer, _React$Component);

  function ReadyStateRenderer(props) {
    (0, _classCallCheck3.default)(this, ReadyStateRenderer);

    var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props));

    _initialiseProps.call(_this);

    var element = props.element,
        querySubscription = props.querySubscription;


    _this.state = {
      element: element
    };

    _this.selectionReference = querySubscription.retain();

    _this.relayContext = {};
    _this.updateRelayContext(querySubscription);
    return _this;
  }

  ReadyStateRenderer.prototype.componentDidMount = function componentDidMount() {
    this.props.querySubscription.subscribe(this.onUpdate);
  };

  ReadyStateRenderer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var element = nextProps.element,
        querySubscription = nextProps.querySubscription;


    if (element !== this.props.element) {
      this.setState({ element: element });
    }

    if (querySubscription !== this.props.querySubscription) {
      this.selectionReference.dispose();
      this.selectionReference = querySubscription.retain();

      this.props.querySubscription.unsubscribe(this.onUpdate);
      querySubscription.subscribe(this.onUpdate);

      this.updateRelayContext(querySubscription);
    }
  };

  ReadyStateRenderer.prototype.componentWillUnmount = function componentWillUnmount() {
    this.selectionReference.dispose();
    this.props.querySubscription.unsubscribe(this.onUpdate);
  };

  ReadyStateRenderer.prototype.updateRelayContext = function updateRelayContext(querySubscription) {
    // XXX: Relay v1.6.0 adds an assumption that context.relay is mutated
    // in-place, so we need to do that here.
    (0, _assign2.default)(this.relayContext, querySubscription.relayContext);
  };

  ReadyStateRenderer.prototype.render = function render() {
    var _this2 = this;

    var element = this.state.element;

    if (!element) {
      return element;
    }

    var _props = this.props,
        querySubscription = _props.querySubscription,
        ownProps = (0, _objectWithoutProperties3.default)(_props, ['querySubscription']);


    delete ownProps.match;
    delete ownProps.Component;
    delete ownProps.isComponentResolved;
    delete ownProps.hasComponent;
    delete ownProps.element;
    delete ownProps.fetched;

    var relayProps = querySubscription.readyState.props;


    if (relayProps) {
      (0, _keys2.default)(relayProps).forEach(function (relayPropName) {
        // At least on Node v8.x, it's slightly faster to guard the delete here
        // with this hasOwnProperty check.
        if (hasOwnProperty.call(ownProps, relayPropName)) {
          process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, 'Ignoring <ReadyStateRenderer> prop `%s` that shadows a Relay ' + 'prop from its query `%s`. This is most likely due to its ' + 'parent cloning it and adding extraneous Relay props.', relayPropName, (0, _getQueryName2.default)(_this2.props.match.route)) : void 0;

          delete ownProps[relayPropName];
        }
      });
    }

    return _react2.default.createElement(
      _ReactRelayContext2.default.Provider,
      { value: this.relayContext },
      _react2.default.cloneElement(element, ownProps)
    );
  };

  return ReadyStateRenderer;
}(_react2.default.Component);

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.onUpdate = function (readyState) {
    if (!_this3.props.fetched) {
      // Ignore subscription updates if our data aren't yet fetched. We'll
      // rerender anyway once fetching finishes.
      return;
    }

    var _props2 = _this3.props,
        match = _props2.match,
        Component = _props2.Component,
        isComponentResolved = _props2.isComponentResolved,
        hasComponent = _props2.hasComponent;


    var element = (0, _renderElement2.default)({
      match: match,
      Component: Component,
      isComponentResolved: isComponentResolved,
      hasComponent: hasComponent,
      readyState: readyState,
      resolving: false
    });

    _this3.setState({ element: element || null });
  };
};

ReadyStateRenderer.propTypes = propTypes;

exports.default = ReadyStateRenderer;
module.exports = exports['default'];