'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = exports.defaultToolbars = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultToolbars = exports.defaultToolbars = [{
    key: 'zoomIn',
    actionType: _Icon.ActionType.zoomIn
}, {
    key: 'zoomOut',
    actionType: _Icon.ActionType.zoomOut
}, {
    key: 'prev',
    actionType: _Icon.ActionType.prev
}, {
    key: 'reset',
    actionType: _Icon.ActionType.reset
}, {
    key: 'next',
    actionType: _Icon.ActionType.next
}, {
    key: 'rotateLeft',
    actionType: _Icon.ActionType.rotateLeft
}, {
    key: 'rotateRight',
    actionType: _Icon.ActionType.rotateRight
}, {
    key: 'scaleX',
    actionType: _Icon.ActionType.scaleX
}, {
    key: 'scaleY',
    actionType: _Icon.ActionType.scaleY
}, {
    key: 'download',
    actionType: _Icon.ActionType.download
}];
function deleteToolbarFromKey(toolbars, keys) {
    var targetToolbar = toolbars.filter(function (item) {
        return keys.indexOf(item.key) < 0;
    });
    return targetToolbar;
}

var ViewerToolbar = function (_React$Component) {
    (0, _inherits3.default)(ViewerToolbar, _React$Component);

    function ViewerToolbar() {
        (0, _classCallCheck3.default)(this, ViewerToolbar);

        var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this));

        _this.renderAction = function (config) {
            var content = null;
            // default toolbar
            if (typeof _Icon.ActionType[config.actionType] !== 'undefined') {
                content = React.createElement(_Icon2.default, { type: config.actionType });
            }
            // extra toolbar
            if (config.render) {
                content = config.render;
            }
            return React.createElement(
                'li',
                { key: config.key, className: _this.props.prefixCls + '-btn', onClick: function onClick() {
                        _this.handleAction(config);
                    }, 'data-key': config.key },
                content
            );
        };
        return _this;
    }

    ViewerToolbar.prototype.handleAction = function handleAction(config) {
        this.props.onAction(config);
    };

    ViewerToolbar.prototype.render = function render() {
        var _this2 = this;

        var attributeNode = this.props.attribute ? React.createElement(
            'p',
            { className: this.props.prefixCls + '-attribute' },
            this.props.alt && '' + this.props.alt,
            this.props.noImgDetails || React.createElement(
                'span',
                { className: this.props.prefixCls + '-img-details' },
                '(' + this.props.width + ' x ' + this.props.height + ')'
            )
        ) : null;
        var toolbars = this.props.toolbars;
        if (!this.props.zoomable) {
            toolbars = deleteToolbarFromKey(toolbars, ['zoomIn', 'zoomOut']);
        }
        if (!this.props.changeable) {
            toolbars = deleteToolbarFromKey(toolbars, ['prev', 'next']);
        }
        if (!this.props.rotatable) {
            toolbars = deleteToolbarFromKey(toolbars, ['rotateLeft', 'rotateRight']);
        }
        if (!this.props.scalable) {
            toolbars = deleteToolbarFromKey(toolbars, ['scaleX', 'scaleY']);
        }
        if (!this.props.downloadable) {
            toolbars = deleteToolbarFromKey(toolbars, ['download']);
        }
        return React.createElement(
            'div',
            null,
            attributeNode,
            React.createElement(
                'ul',
                { className: this.props.prefixCls + '-toolbar' },
                toolbars.map(function (item) {
                    return _this2.renderAction(item);
                })
            )
        );
    };

    return ViewerToolbar;
}(React.Component);

exports.default = ViewerToolbar;