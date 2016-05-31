'use strict';

exports.__esModule = true;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _tango = require('@eagle/tango');

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DataComponent = function (_Component) {
  (0, _inherits3.default)(DataComponent, _Component);

  function DataComponent() {
    (0, _classCallCheck3.default)(this, DataComponent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args)));

    if (!_this.constructor.storeProps) {
      throw new Error('DataComponent requires storeProps to be defined! Did you forget to use the connect decorator?');
    }
    return _this;
  }

  DataComponent.prototype.componentWillMount = function componentWillMount() {
    this.tryResolveData();
  };

  DataComponent.prototype.componentDidUpdate = function componentDidUpdate() {
    if (!this.handleResolved) return;
    if (this._resolved) return;
    var loading = this.getResolvingFields();
    if (loading.size !== 0) return;

    this._resolved = true;
    this.handleResolved(this.getResolvedData());
  };

  DataComponent.prototype.getResolvingFields = function getResolvingFields() {
    var _this2 = this;

    // has keys that are either undefined/null or have a pending = true key
    return (0, _immutable.fromJS)(this.constructor.storeProps).reduce(function (prev, cursor, prop) {
      return _this2.isPropResolving(prop) ? prev.push(prop) : prev;
    }, (0, _immutable.List)());
  };

  DataComponent.prototype.getErrors = function getErrors() {
    var _this3 = this;

    // has keys that have an error = data key
    return (0, _immutable.fromJS)(this.constructor.storeProps).reduce(function (prev, cursor, prop) {
      return _this3.isPropErrored(prop) ? prev.set(prop, _this3.props[prop].get('error')) : prev;
    }, (0, _immutable.Map)());
  };

  DataComponent.prototype.getResolvedData = function getResolvedData() {
    var _this4 = this;

    return (0, _keys2.default)(this.constructor.storeProps).reduce(function (prev, prop) {
      var val = _this4.props[prop];
      if (!_this4.isPropResolving(prop)) {
        prev[prop] = _immutable.Iterable.isIterable(val) ? val.get('data') || val : val;
      }
      return prev;
    }, {});
  };

  DataComponent.prototype.tryResolveData = function tryResolveData() {
    if (!this.resolveData) return;
    var loading = this.getResolvingFields();
    if (loading.size === 0) return;
    this.resolveData();
  };

  DataComponent.prototype.isPropResolving = function isPropResolving(prop) {
    return this.props[prop] == null || _immutable.Iterable.isIterable(this.props[prop]) && this.props[prop].get('pending') === true;
  };

  DataComponent.prototype.isPropErrored = function isPropErrored(prop) {
    return _immutable.Iterable.isIterable(this.props[prop]) && this.props[prop].get('error') != null;
  };

  DataComponent.prototype.isResolving = function isResolving() {
    return !this.isErrored() && !this.getResolvingFields().isEmpty();
  };

  DataComponent.prototype.isErrored = function isErrored() {
    return !this.getErrors().isEmpty();
  };

  DataComponent.prototype.renderLoader = function renderLoader() {
    return null;
  };

  DataComponent.prototype.renderErrors = function renderErrors() {
    return null;
  };

  DataComponent.prototype.renderData = function renderData() {
    return null;
  };

  DataComponent.prototype.render = function render() {
    var node = null;

    if (this.isResolving()) {
      node = this.renderLoader(this.getResolvingFields());
    } else if (this.isErrored()) {
      node = this.renderErrors(this.getErrors());
    } else {
      node = this.renderData(this.getResolvedData());
    }

    return node;
  };

  return DataComponent;
}(_tango.Component);

exports.default = DataComponent;
module.exports = exports['default'];