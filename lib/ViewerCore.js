'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var React = _interopRequireWildcard(_react);

require('./style/index.less');

var _ViewerCanvas = require('./ViewerCanvas');

var _ViewerCanvas2 = _interopRequireDefault(_ViewerCanvas);

var _ViewerNav = require('./ViewerNav');

var _ViewerNav2 = _interopRequireDefault(_ViewerNav);

var _ViewerToolbar = require('./ViewerToolbar');

var _ViewerToolbar2 = _interopRequireDefault(_ViewerToolbar);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _constants = require('./constants');

var constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function noop() {}
var transitionDuration = 300;

var ViewerCore = function (_React$Component) {
    (0, _inherits3.default)(ViewerCore, _React$Component);

    function ViewerCore(props) {
        (0, _classCallCheck3.default)(this, ViewerCore);

        var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props));

        _this.handleClose = function (e) {
            _this.props.onClose();
        };
        _this.loadImgSuccess = function (activeImage, imgWidth, imgHeight) {
            var realImgWidth = imgWidth;
            var realImgHeight = imgHeight;
            if (_this.props.defaultSize) {
                realImgWidth = _this.props.defaultSize.width;
                realImgHeight = _this.props.defaultSize.height;
            }
            if (activeImage.defaultSize) {
                realImgWidth = activeImage.defaultSize.width;
                realImgHeight = activeImage.defaultSize.height;
            }

            var _this$getImgWidthHeig = _this.getImgWidthHeight(realImgWidth, realImgHeight),
                _this$getImgWidthHeig2 = (0, _slicedToArray3.default)(_this$getImgWidthHeig, 2),
                width = _this$getImgWidthHeig2[0],
                height = _this$getImgWidthHeig2[1];

            var left = (_this.containerWidth - width) / 2;
            var top = (_this.containerHeight - height - _this.footerHeight) / 2;
            _this.setState({
                width: width,
                height: height,
                left: left,
                top: top,
                imageWidth: imgWidth,
                imageHeight: imgHeight,
                loading: false,
                rotate: 0,
                scaleX: 1,
                scaleY: 1
            });
        };
        _this.handleChangeImg = function (newIndex) {
            if (newIndex >= _this.props.images.length) {
                newIndex = 0;
            }
            if (newIndex < 0) {
                newIndex = _this.props.images.length - 1;
            }
            if (newIndex === _this.state.activeIndex) {
                return;
            }
            _this.loadImg(newIndex);
        };
        _this.handleChangeImgState = function (width, height, top, left) {
            _this.setState({
                width: width,
                height: height,
                top: top,
                left: left
            });
        };
        _this.handleDefaultAction = function (type) {
            switch (type) {
                case _Icon.ActionType.prev:
                    _this.handleChangeImg(_this.state.activeIndex - 1);
                    break;
                case _Icon.ActionType.next:
                    _this.handleChangeImg(_this.state.activeIndex + 1);
                    break;
                case _Icon.ActionType.zoomIn:
                    var imgCenterXY = _this.getImageCenterXY();
                    _this.handleZoom(imgCenterXY.x, imgCenterXY.y, 1, _this.props.zoomSpeed);
                    break;
                case _Icon.ActionType.zoomOut:
                    var imgCenterXY2 = _this.getImageCenterXY();
                    _this.handleZoom(imgCenterXY2.x, imgCenterXY2.y, -1, _this.props.zoomSpeed);
                    break;
                case _Icon.ActionType.rotateLeft:
                    _this.handleRotate();
                    break;
                case _Icon.ActionType.rotateRight:
                    _this.handleRotate(true);
                    break;
                case _Icon.ActionType.reset:
                    _this.loadImg(_this.state.activeIndex);
                    break;
                case _Icon.ActionType.scaleX:
                    _this.handleScaleX(-1);
                    break;
                case _Icon.ActionType.scaleY:
                    _this.handleScaleY(-1);
                    break;
                case _Icon.ActionType.download:
                    _this.handleDownload();
                    break;
                default:
                    break;
            }
        };
        _this.handleAction = function (config) {
            _this.handleDefaultAction(config.actionType);
            if (config.onClick) {
                var activeImage = _this.getActiveImage();
                config.onClick(activeImage);
            }
        };
        _this.handleDownload = function () {
            var activeImage = _this.getActiveImage();
            if (activeImage.downloadUrl) {
                location.href = activeImage.downloadUrl;
            }
        };
        _this.handleScaleX = function (newScale) {
            _this.setState({
                scaleX: _this.state.scaleX * newScale
            });
        };
        _this.handleScaleY = function (newScale) {
            _this.setState({
                scaleY: _this.state.scaleY * newScale
            });
        };
        _this.handleScrollZoom = function (targetX, targetY, direct) {
            _this.handleZoom(targetX, targetY, direct, _this.props.zoomSpeed);
        };
        _this.handleZoom = function (targetX, targetY, direct, scale) {
            var imgCenterXY = _this.getImageCenterXY();
            var diffX = targetX - imgCenterXY.x;
            var diffY = targetY - imgCenterXY.y;
            // when image width is 0, set original width
            var reset = false;
            var top = 0;
            var left = 0;
            var width = 0;
            var height = 0;
            var scaleX = 0;
            var scaleY = 0;
            if (_this.state.width === 0) {
                var _this$getImgWidthHeig3 = _this.getImgWidthHeight(_this.state.imageWidth, _this.state.imageHeight),
                    _this$getImgWidthHeig4 = (0, _slicedToArray3.default)(_this$getImgWidthHeig3, 2),
                    imgWidth = _this$getImgWidthHeig4[0],
                    imgHeight = _this$getImgWidthHeig4[1];

                reset = true;
                left = (_this.containerWidth - imgWidth) / 2;
                top = (_this.containerHeight - _this.footerHeight - imgHeight) / 2;
                width = _this.state.width + imgWidth;
                height = _this.state.height + imgHeight;
                scaleX = scaleY = 1;
            } else {
                var directX = _this.state.scaleX > 0 ? 1 : -1;
                var directY = _this.state.scaleY > 0 ? 1 : -1;
                scaleX = _this.state.scaleX + scale * direct * directX;
                scaleY = _this.state.scaleY + scale * direct * directY;
                if (Math.abs(scaleX) < 0.1 || Math.abs(scaleY) < 0.1) {
                    return;
                }
                top = _this.state.top + -direct * diffY / _this.state.scaleX * scale * directX;
                left = _this.state.left + -direct * diffX / _this.state.scaleY * scale * directY;
                width = _this.state.width;
                height = _this.state.height;
            }
            _this.setState({
                width: width,
                scaleX: scaleX,
                scaleY: scaleY,
                height: height,
                top: top,
                left: left,
                loading: false
            });
        };
        _this.getImageCenterXY = function () {
            return {
                x: _this.state.left + _this.state.width / 2,
                y: _this.state.top + _this.state.height / 2
            };
        };
        _this.handleRotate = function () {
            var isRight = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            _this.setState({
                rotate: _this.state.rotate + 90 * (isRight ? 1 : -1)
            });
        };
        _this.handleResize = function () {
            _this.setContainerWidthHeight();
            if (_this.props.visible) {
                var _this$getImgWidthHeig5 = _this.getImgWidthHeight(_this.state.imageWidth, _this.state.imageHeight),
                    _this$getImgWidthHeig6 = (0, _slicedToArray3.default)(_this$getImgWidthHeig5, 2),
                    width = _this$getImgWidthHeig6[0],
                    height = _this$getImgWidthHeig6[1];

                var left = (_this.containerWidth - width) / 2;
                var top = (_this.containerHeight - height - _this.footerHeight) / 2;
                _this.setState({
                    width: width,
                    height: height,
                    left: left,
                    top: top,
                    rotate: 0,
                    scaleX: 1,
                    scaleY: 1
                });
            }
        };
        _this.handleKeydown = function (e) {
            var keyCode = e.keyCode || e.which || e.charCode;
            var isFeatrue = false;
            switch (keyCode) {
                // key: esc
                case 27:
                    _this.props.onClose();
                    isFeatrue = true;
                    break;
                // key: ←
                case 37:
                    if (e.ctrlKey) {
                        _this.handleDefaultAction(_Icon.ActionType.rotateLeft);
                    } else {
                        _this.handleDefaultAction(_Icon.ActionType.prev);
                    }
                    isFeatrue = true;
                    break;
                // key: →
                case 39:
                    if (e.ctrlKey) {
                        _this.handleDefaultAction(_Icon.ActionType.rotateRight);
                    } else {
                        _this.handleDefaultAction(_Icon.ActionType.next);
                    }
                    isFeatrue = true;
                    break;
                // key: ↑
                case 38:
                    _this.handleDefaultAction(_Icon.ActionType.zoomIn);
                    isFeatrue = true;
                    break;
                // key: ↓
                case 40:
                    _this.handleDefaultAction(_Icon.ActionType.zoomOut);
                    isFeatrue = true;
                    break;
                // key: Ctrl + 1
                case 49:
                    if (e.ctrlKey) {
                        _this.loadImg(_this.state.activeIndex);
                        isFeatrue = true;
                    }
                    break;
                default:
                    break;
            }
            if (isFeatrue) {
                e.preventDefault();
            }
        };
        _this.handleTransitionEnd = function (e) {
            if (!_this.state.transitionEnd || _this.state.visibleStart) {
                _this.setState({
                    visibleStart: false,
                    transitionEnd: true
                });
            }
        };
        _this.handleCanvasMouseDown = function (e) {
            _this.props.onMaskClick(e);
        };
        _this.getActiveImage = function () {
            var activeImg = {
                src: '',
                alt: '',
                downloadUrl: ''
            };
            var images = _this.props.images || [];
            if (images.length > 0 && _this.state.activeIndex >= 0) {
                activeImg = images[_this.state.activeIndex];
            }
            return activeImg;
        };
        _this.handleMouseScroll = function (e) {
            e.preventDefault();
            var direct = 0;
            if (e.deltaY === 0) {
                direct = 0;
            } else {
                direct = e.deltaY > 0 ? -1 : 1;
            }
            if (direct !== 0) {
                var x = e.clientX;
                var y = e.clientY;
                if (_this.props.container) {
                    var containerRect = _this.props.container.getBoundingClientRect();
                    x -= containerRect.left;
                    y -= containerRect.top;
                }
                _this.handleScrollZoom(x, y, direct);
            }
        };
        _this.prefixCls = 'react-viewer';
        _this.state = {
            visible: false,
            visibleStart: false,
            transitionEnd: false,
            activeIndex: _this.props.activeIndex,
            width: 0,
            height: 0,
            top: 15,
            left: null,
            rotate: 0,
            imageWidth: 0,
            imageHeight: 0,
            scaleX: 1,
            scaleY: 1,
            loading: false,
            loadFailed: false
        };
        _this.setContainerWidthHeight();
        _this.footerHeight = constants.FOOTER_HEIGHT;
        return _this;
    }

    ViewerCore.prototype.setContainerWidthHeight = function setContainerWidthHeight() {
        this.containerWidth = window.innerWidth;
        this.containerHeight = window.innerHeight;
        if (this.props.container) {
            this.containerWidth = this.props.container.offsetWidth;
            this.containerHeight = this.props.container.offsetHeight;
        }
    };

    ViewerCore.prototype.startVisible = function startVisible(activeIndex) {
        var _this2 = this;

        if (!this.props.container) {
            document.body.style.overflow = 'hidden';
            if (document.body.scrollHeight > document.body.clientHeight) {
                document.body.style.paddingRight = '15px';
            }
        }
        this.setState({
            visibleStart: true
        });
        setTimeout(function () {
            _this2.setState({
                visible: true,
                activeIndex: activeIndex
            });
            setTimeout(function () {
                _this2.bindEvent();
                _this2.loadImg(activeIndex, true);
            }, 300);
        }, 10);
    };

    ViewerCore.prototype.componentDidMount = function componentDidMount() {
        this.refs['viewerCore'].addEventListener('transitionend', this.handleTransitionEnd, false);
        this.startVisible(this.state.activeIndex);
    };

    ViewerCore.prototype.getImgWidthHeight = function getImgWidthHeight(imgWidth, imgHeight) {
        var width = 0;
        var height = 0;
        var maxWidth = this.containerWidth * 0.8;
        var maxHeight = (this.containerHeight - this.footerHeight) * 0.8;
        width = Math.min(maxWidth, imgWidth);
        height = width / imgWidth * imgHeight;
        if (height > maxHeight) {
            height = maxHeight;
            width = height / imgHeight * imgWidth;
        }
        return [width, height];
    };

    ViewerCore.prototype.loadImg = function loadImg(activeIndex) {
        var _this3 = this;

        var firstLoad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var activeImage = null;
        var images = this.props.images || [];
        if (images.length > 0) {
            activeImage = images[activeIndex];
        }
        var loadComplete = false;
        var img = new Image();
        this.setState({
            activeIndex: activeIndex,
            loading: true,
            loadFailed: false
        });
        img.onload = function () {
            if (!loadComplete) {
                _this3.loadImgSuccess(activeImage, img.width, img.height);
            }
        };
        img.onerror = function () {
            if (_this3.props.defaultImg) {
                _this3.setState({
                    loadFailed: true
                });
                var deafultImgWidth = _this3.props.defaultImg.width || _this3.containerWidth * .5;
                var defaultImgHeight = _this3.props.defaultImg.height || _this3.containerHeight * .5;
                _this3.loadImgSuccess(activeImage, deafultImgWidth, defaultImgHeight);
            } else {
                _this3.setState({
                    activeIndex: activeIndex,
                    imageWidth: 0,
                    imageHeight: 0,
                    loading: false
                });
            }
        };
        img.src = activeImage.src;
        if (img.complete) {
            loadComplete = true;
            this.loadImgSuccess(activeImage, img.width, img.height);
        }
    };

    ViewerCore.prototype.bindEvent = function bindEvent() {
        var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var funcName = 'addEventListener';
        if (remove) {
            funcName = 'removeEventListener';
        }
        document[funcName]('keydown', this.handleKeydown, false);
    };

    ViewerCore.prototype.componentWillUnmount = function componentWillUnmount() {
        this.bindEvent(true);
        this.refs['viewerCore'].removeEventListener('transitionend', this.handleTransitionEnd, false);
    };

    ViewerCore.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        var _this4 = this;

        if (!this.props.visible && nextProps.visible) {
            this.startVisible(nextProps.activeIndex);
            return;
        }
        if (this.props.visible && !nextProps.visible) {
            this.bindEvent(true);
            this.handleZoom(this.containerWidth / 2, (this.containerHeight - this.footerHeight) / 2, -1, (this.state.scaleX > 0 ? 1 : -1) * this.state.scaleX - 0.11);
            setTimeout(function () {
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                _this4.setState({
                    visible: false,
                    transitionEnd: false,
                    width: 0,
                    height: 0,
                    scaleX: 1,
                    scaleY: 1,
                    rotate: 1,
                    imageWidth: 0,
                    imageHeight: 0,
                    loadFailed: false
                });
            }, transitionDuration);
            return;
        }
        if (this.props.activeIndex !== nextProps.activeIndex) {
            this.handleChangeImg(nextProps.activeIndex);
            return;
        }
    };

    ViewerCore.prototype.render = function render() {
        var activeImg = {
            src: '',
            alt: ''
        };
        var zIndex = 1000;
        if (this.props.zIndex) {
            zIndex = this.props.zIndex;
        }
        var viewerStryle = {
            opacity: this.state.visible ? 1 : 0
        };
        if (!this.state.visible && this.state.transitionEnd) {
            viewerStryle.display = 'none';
        }
        if (!this.state.visible && this.state.visibleStart) {
            viewerStryle.display = 'block';
        }
        if (this.state.visible && this.state.transitionEnd) {
            activeImg = this.getActiveImage();
        }
        var className = this.prefixCls + ' ' + this.prefixCls + '-transition';
        if (this.props.container) {
            className += ' ' + this.prefixCls + '-inline';
        }
        return React.createElement(
            'div',
            { ref: 'viewerCore', className: className, style: viewerStryle, onWheel: this.handleMouseScroll },
            React.createElement('div', { className: this.prefixCls + '-mask', style: { zIndex: zIndex } }),
            this.props.noClose || React.createElement(
                'div',
                { className: this.prefixCls + '-close ' + this.prefixCls + '-btn', onClick: this.handleClose, style: { zIndex: zIndex + 10 } },
                React.createElement(_Icon2.default, { type: _Icon.ActionType.close })
            ),
            React.createElement(_ViewerCanvas2.default, { prefixCls: this.prefixCls, imgSrc: this.state.loadFailed ? this.props.defaultImg.src || activeImg.src : activeImg.src, visible: this.props.visible, width: this.state.width, height: this.state.height, top: this.state.top, left: this.state.left, rotate: this.state.rotate, onChangeImgState: this.handleChangeImgState, onResize: this.handleResize, zIndex: zIndex + 5, scaleX: this.state.scaleX, scaleY: this.state.scaleY, loading: this.state.loading, drag: this.props.drag, container: this.props.container, onCanvasMouseDown: this.handleCanvasMouseDown }),
            this.props.noFooter || React.createElement(
                'div',
                { className: this.prefixCls + '-footer', style: { zIndex: zIndex + 5 } },
                this.props.noToolbar || React.createElement(_ViewerToolbar2.default, { prefixCls: this.prefixCls, onAction: this.handleAction, alt: activeImg.alt, width: this.state.imageWidth, height: this.state.imageHeight, attribute: this.props.attribute, zoomable: this.props.zoomable, rotatable: this.props.rotatable, scalable: this.props.scalable, changeable: this.props.changeable, downloadable: this.props.downloadable, noImgDetails: this.props.noImgDetails, toolbars: this.props.customToolbar(_ViewerToolbar.defaultToolbars) }),
                this.props.noNavbar || React.createElement(_ViewerNav2.default, { prefixCls: this.prefixCls, images: this.props.images, activeIndex: this.state.activeIndex, onChangeImg: this.handleChangeImg })
            ),
            !!this.props.imageCaption && React.createElement(
                'div',
                { className: 'react-viewer-caption' },
                React.createElement(
                    'div',
                    { className: 'react-viewer-captionContent' },
                    this.props.imageCaption
                )
            )
        );
    };

    return ViewerCore;
}(React.Component);

exports.default = ViewerCore;

ViewerCore.defaultProps = {
    visible: false,
    onClose: noop,
    images: [],
    activeIndex: 0,
    zIndex: 1000,
    drag: true,
    attribute: true,
    zoomable: true,
    rotatable: true,
    scalable: true,
    onMaskClick: noop,
    changeable: true,
    customToolbar: function customToolbar(toolbars) {
        return toolbars;
    },
    zoomSpeed: .05
};
module.exports = exports['default'];