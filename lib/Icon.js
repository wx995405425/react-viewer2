"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = exports.ActionType = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require("react");

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ActionType = exports.ActionType = undefined;
(function (ActionType) {
    ActionType[ActionType["zoomIn"] = 1] = "zoomIn";
    ActionType[ActionType["zoomOut"] = 2] = "zoomOut";
    ActionType[ActionType["prev"] = 3] = "prev";
    ActionType[ActionType["next"] = 4] = "next";
    ActionType[ActionType["rotateLeft"] = 5] = "rotateLeft";
    ActionType[ActionType["rotateRight"] = 6] = "rotateRight";
    ActionType[ActionType["reset"] = 7] = "reset";
    ActionType[ActionType["close"] = 8] = "close";
    ActionType[ActionType["scaleX"] = 9] = "scaleX";
    ActionType[ActionType["scaleY"] = 10] = "scaleY";
    ActionType[ActionType["download"] = 11] = "download";
})(ActionType || (exports.ActionType = ActionType = {}));

var Icon = function (_React$Component) {
    (0, _inherits3.default)(Icon, _React$Component);

    function Icon() {
        (0, _classCallCheck3.default)(this, Icon);
        return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
    }

    Icon.prototype.render = function render() {
        var prefixCls = 'react-viewer-icon';
        return React.createElement("i", { className: prefixCls + " " + prefixCls + "-" + ActionType[this.props.type] });
    };

    return Icon;
}(React.Component);

exports.default = Icon;