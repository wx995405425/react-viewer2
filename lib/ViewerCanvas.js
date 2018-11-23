'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _Loading = require('./Loading');

var _Loading2 = _interopRequireDefault(_Loading);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ViewerCanvas = function (_React$Component) {
    (0, _inherits3.default)(ViewerCanvas, _React$Component);

    function ViewerCanvas() {
        (0, _classCallCheck3.default)(this, ViewerCanvas);

        var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this));

        _this.handleResize = function (e) {
            _this.props.onResize();
        };
        _this.handleCanvasMouseDown = function (e) {
            _this.props.onCanvasMouseDown(e);
            _this.handleMouseDown(e);
        };
        _this.handleMouseDown = function (e) {
            if (!_this.props.visible || !_this.props.drag) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            _this.setState({
                isMouseDown: true,
                mouseX: e.nativeEvent.clientX,
                mouseY: e.nativeEvent.clientY
            });
        };
        _this.handleMouseMove = function (e) {
            if (_this.state.isMouseDown) {
                var diffX = e.clientX - _this.state.mouseX;
                var diffY = e.clientY - _this.state.mouseY;
                _this.setState({
                    mouseX: e.clientX,
                    mouseY: e.clientY
                });
                _this.props.onChangeImgState(_this.props.width, _this.props.height, _this.props.top + diffY, _this.props.left + diffX);
            }
        };
        _this.handleMouseUp = function (e) {
            _this.setState({
                isMouseDown: false
            });
        };
        _this.bindEvent = function (remove) {
            var funcName = 'addEventListener';
            if (remove) {
                funcName = 'removeEventListener';
            }
            document[funcName]('click', _this.handleMouseUp, false);
            document[funcName]('mousemove', _this.handleMouseMove, false);
            window[funcName]('resize', _this.handleResize, false);
        };
        _this.state = {
            isMouseDown: false,
            mouseX: 0,
            mouseY: 0
        };
        return _this;
    }

    ViewerCanvas.prototype.componentDidMount = function componentDidMount() {
        if (this.props.drag) {
            this.bindEvent();
        }
    };

    ViewerCanvas.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            if (nextProps.drag) {
                return this.bindEvent();
            }
        }
        if (this.props.visible && !nextProps.visible) {
            this.handleMouseUp({});
            if (nextProps.drag) {
                return this.bindEvent(true);
            }
        }
        if (this.props.drag && !nextProps.drag) {
            return this.bindEvent(true);
        }
        if (!this.props.drag && nextProps.drag) {
            if (nextProps.visible) {
                return this.bindEvent(true);
            }
        }
    };

    ViewerCanvas.prototype.componentWillUnmount = function componentWillUnmount() {
        this.bindEvent(true);
    };

    ViewerCanvas.prototype.render = function render() {
        var imgStyle = {
            width: this.props.width + 'px',
            height: this.props.height + 'px',
            transform: 'translateX(' + (this.props.left ? this.props.left + 'px' : 'aoto') + ') translateY(' + this.props.top + 'px)\n      rotate(' + this.props.rotate + 'deg) scaleX(' + this.props.scaleX + ') scaleY(' + this.props.scaleY + ')'
        };
        var imgClass = (0, _classnames3.default)(this.props.prefixCls + '-image', (0, _defineProperty3.default)({
            drag: this.props.drag
        }, this.props.prefixCls + '-image-transition', !this.state.isMouseDown));
        var style = {
            zIndex: this.props.zIndex
        };
        var imgNode = null;
        if (this.props.imgSrc !== '') {
            imgNode = React.createElement('img', { className: imgClass, src: this.props.imgSrc, style: imgStyle, onMouseDown: this.handleMouseDown });
        }
        if (this.props.loading) {
            imgNode = React.createElement(
                'div',
                { style: {
                        display: 'flex',
                        height: window.innerHeight - 84 + 'px',
                        justifyContent: 'center',
                        alignItems: 'center'
                    } },
                React.createElement(_Loading2.default, null)
            );
        }
        return React.createElement(
            'div',
            { className: this.props.prefixCls + '-canvas', onMouseDown: this.handleCanvasMouseDown, style: style },
            imgNode
        );
    };

    return ViewerCanvas;
}(React.Component);

exports.default = ViewerCanvas;
module.exports = exports['default'];