import * as React from 'react';
import './style/index.less';
import ViewerCanvas from './ViewerCanvas';
import ViewerNav from './ViewerNav';
import ViewerToolbar, { defaultToolbars } from './ViewerToolbar';
import ViewerProps, { ImageDecorator, ToolbarConfig } from './ViewerProps';
import Icon, { ActionType } from './Icon';
import * as constants from './constants';

function noop() {}

const transitionDuration = 300;

export interface ViewerCoreState {
  visible?: boolean;
  visibleStart?: boolean;
  transitionEnd?: boolean;
  activeIndex?: number;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  rotate?: number;
  imageWidth?: number;
  imageHeight?: number;
  scaleX?: number;
  scaleY?: number;
  loading?: boolean;
  loadFailed?: boolean;
}

export default class ViewerCore extends React.Component<ViewerProps, ViewerCoreState> {
  static defaultProps = {
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
    customToolbar: (toolbars) => toolbars,
    zoomSpeed: .05,
  };

  private prefixCls: string;
  private containerWidth: number;
  private containerHeight: number;
  private footerHeight: number;

  constructor(props) {
    super(props);

    this.prefixCls = 'react-viewer';

    this.state = {
      visible: false,
      visibleStart: false,
      transitionEnd: false,
      activeIndex: this.props.activeIndex,
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
      loadFailed: false,
    };

    this.setContainerWidthHeight();
    this.footerHeight = constants.FOOTER_HEIGHT;
  }

  setContainerWidthHeight() {
    this.containerWidth = window.innerWidth;
    this.containerHeight = window.innerHeight;
    if (this.props.container) {
      this.containerWidth = this.props.container.offsetWidth;
      this.containerHeight = this.props.container.offsetHeight;
    }
  }

  handleClose = (e) => {
    this.props.onClose();
  }

  startVisible(activeIndex: number) {
    if (!this.props.container) {
      document.body.style.overflow = 'hidden';
      if (document.body.scrollHeight > document.body.clientHeight) {
        document.body.style.paddingRight = '15px';
      }
    }
    this.setState({
      visibleStart: true,
    });
    setTimeout(() => {
      this.setState({
        visible: true,
        activeIndex,
      });
      setTimeout(() => {
        this.bindEvent();
        this.loadImg(activeIndex, true);
      }, 300);
    }, 10);
  }

  componentDidMount() {
    (this.refs['viewerCore'] as HTMLDivElement).addEventListener(
      'transitionend',
      this.handleTransitionEnd,
      false
    );
    this.startVisible(this.state.activeIndex);
  }

  getImgWidthHeight(imgWidth, imgHeight) {
    let width = 0;
    let height = 0;
    let maxWidth = this.containerWidth * 0.8;
    let maxHeight = (this.containerHeight - this.footerHeight) * 0.8;
    width = Math.min(maxWidth, imgWidth);
    height = width / imgWidth * imgHeight;
    if (height > maxHeight) {
      height = maxHeight;
      width = height / imgHeight * imgWidth;
    }
    return [width, height];
  }

  loadImgSuccess = (activeImage: ImageDecorator, imgWidth, imgHeight) => {
    let realImgWidth = imgWidth;
    let realImgHeight = imgHeight;
    if (this.props.defaultSize) {
      realImgWidth = this.props.defaultSize.width;
      realImgHeight = this.props.defaultSize.height;
    }
    if (activeImage.defaultSize) {
      realImgWidth = activeImage.defaultSize.width;
      realImgHeight = activeImage.defaultSize.height;
    }
    const [width, height] = this.getImgWidthHeight(realImgWidth, realImgHeight);
    let left = (this.containerWidth - width) / 2;
    let top = (this.containerHeight - height - this.footerHeight) / 2;
    this.setState({
      width: width,
      height: height,
      left: left,
      top: top,
      imageWidth: imgWidth,
      imageHeight: imgHeight,
      loading: false,
      rotate: 0,
      scaleX: 1,
      scaleY: 1,
    });
  }

  loadImg(activeIndex, firstLoad: boolean = false) {
    let activeImage: ImageDecorator = null;
    let images = this.props.images || [];
    if (images.length > 0) {
      activeImage = images[activeIndex];
    }
    let loadComplete = false;
    let img = new Image();
    this.setState({
      activeIndex: activeIndex,
      loading: true,
      loadFailed: false,
    });
    img.onload = () => {
      if (!loadComplete) {
        this.loadImgSuccess(activeImage, img.width, img.height);
      }
    };
    img.onerror = () => {
      if (this.props.defaultImg) {
        this.setState({
          loadFailed: true,
        });
        const deafultImgWidth = this.props.defaultImg.width || this.containerWidth * .5;
        const defaultImgHeight = this.props.defaultImg.height || this.containerHeight * .5;
        this.loadImgSuccess(activeImage, deafultImgWidth, defaultImgHeight);
      } else {
        this.setState({
          activeIndex: activeIndex,
          imageWidth: 0,
          imageHeight: 0,
          loading: false,
        });
      }
    };
    img.src = activeImage.src;
    if (img.complete) {
      loadComplete = true;
      this.loadImgSuccess(activeImage, img.width, img.height);
    }
  }

  handleChangeImg = (newIndex: number) => {
    if (newIndex >= this.props.images.length) {
      newIndex = 0;
    }
    if (newIndex < 0) {
      newIndex = this.props.images.length - 1;
    }
    if (newIndex === this.state.activeIndex) {
      return;
    }
    this.loadImg(newIndex);
  }

  handleChangeImgState = (width, height, top, left) => {
    this.setState({
      width: width,
      height: height,
      top: top,
      left: left,
    });
  }

  handleDefaultAction = (type: ActionType) => {
    switch (type) {
      case ActionType.prev:
        this.handleChangeImg(this.state.activeIndex - 1);
        break;
      case ActionType.next:
        this.handleChangeImg(this.state.activeIndex + 1);
        break;
      case ActionType.zoomIn:
        let imgCenterXY = this.getImageCenterXY();
        this.handleZoom(imgCenterXY.x, imgCenterXY.y, 1, this.props.zoomSpeed);
        break;
      case ActionType.zoomOut:
        let imgCenterXY2 = this.getImageCenterXY();
        this.handleZoom(imgCenterXY2.x, imgCenterXY2.y, -1, this.props.zoomSpeed);
        break;
      case ActionType.rotateLeft:
        this.handleRotate();
        break;
      case ActionType.rotateRight:
        this.handleRotate(true);
        break;
      case ActionType.reset:
        this.loadImg(this.state.activeIndex);
        break;
      case ActionType.scaleX:
        this.handleScaleX(-1);
        break;
      case ActionType.scaleY:
        this.handleScaleY(-1);
        break;
      case ActionType.download:
        this.handleDownload();
        break;
      default:
        break;
    }
  }

  handleAction = (config: ToolbarConfig) => {
    this.handleDefaultAction(config.actionType);

    if (config.onClick) {
      const activeImage = this.getActiveImage();
      config.onClick(activeImage);
    }
  }

  handleDownload = () => {
    const activeImage = this.getActiveImage();
    if (activeImage.downloadUrl) {
      location.href = activeImage.downloadUrl;
    }
  };

  handleScaleX = (newScale: 1 | -1) => {
    this.setState({
      scaleX: this.state.scaleX * newScale,
    });
  }

  handleScaleY = (newScale: 1 | -1) => {
    this.setState({
      scaleY: this.state.scaleY * newScale,
    });
  }

  handleScrollZoom = (targetX, targetY, direct) => {
    this.handleZoom(targetX, targetY, direct, this.props.zoomSpeed);
  }

  handleZoom = (targetX, targetY, direct, scale) => {
    let imgCenterXY = this.getImageCenterXY();
    let diffX = targetX - imgCenterXY.x;
    let diffY = targetY - imgCenterXY.y;
    // when image width is 0, set original width
    let reset = false;
    let top = 0;
    let left = 0;
    let width = 0;
    let height = 0;
    let scaleX = 0;
    let scaleY = 0;
    if (this.state.width === 0) {
      const [imgWidth, imgHeight] = this.getImgWidthHeight(
        this.state.imageWidth,
        this.state.imageHeight
      );
      reset = true;
      left = (this.containerWidth - imgWidth) / 2;
      top = (this.containerHeight - this.footerHeight - imgHeight) / 2;
      width = this.state.width + imgWidth;
      height = this.state.height + imgHeight;
      scaleX = scaleY = 1;
    } else {
      let directX = this.state.scaleX > 0 ? 1 : -1;
      let directY = this.state.scaleY > 0 ? 1 : -1;
      scaleX = this.state.scaleX + scale * direct * directX;
      scaleY = this.state.scaleY + scale * direct * directY;
      if (Math.abs(scaleX) < 0.1 || Math.abs(scaleY) < 0.1) {
        return;
      }
      top = this.state.top + -direct * diffY / this.state.scaleX * scale * directX;
      left = this.state.left + -direct * diffX / this.state.scaleY * scale * directY;
      width = this.state.width;
      height = this.state.height;
    }
    this.setState({
      width: width,
      scaleX: scaleX,
      scaleY: scaleY,
      height: height,
      top: top,
      left: left,
      loading: false,
    });
  }

  getImageCenterXY = () => {
    return {
      x: this.state.left + this.state.width / 2,
      y: this.state.top + this.state.height / 2,
    };
  }

  handleRotate = (isRight: boolean = false) => {
    this.setState({
      rotate: this.state.rotate + 90 * (isRight ? 1 : -1),
    });
  }

  handleResize = () => {
    this.setContainerWidthHeight();
    if (this.props.visible) {
      const [width, height] = this.getImgWidthHeight(this.state.imageWidth, this.state.imageHeight);
      let left = (this.containerWidth - width) / 2;
      let top = (this.containerHeight - height - this.footerHeight) / 2;
      this.setState({
        width: width,
        height: height,
        left: left,
        top: top,
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
      });
    }
  }

  handleKeydown = (e) => {
    let keyCode = e.keyCode || e.which || e.charCode;
    let isFeatrue = false;
    switch (keyCode) {
      // key: esc
      case 27:
        this.props.onClose();
        isFeatrue = true;
        break;
      // key: ←
      case 37:
        if (e.ctrlKey) {
          this.handleDefaultAction(ActionType.rotateLeft);
        } else {
          this.handleDefaultAction(ActionType.prev);
        }
        isFeatrue = true;
        break;
      // key: →
      case 39:
        if (e.ctrlKey) {
          this.handleDefaultAction(ActionType.rotateRight);
        } else {
          this.handleDefaultAction(ActionType.next);
        }
        isFeatrue = true;
        break;
      // key: ↑
      case 38:
        this.handleDefaultAction(ActionType.zoomIn);
        isFeatrue = true;
        break;
      // key: ↓
      case 40:
        this.handleDefaultAction(ActionType.zoomOut);
        isFeatrue = true;
        break;
      // key: Ctrl + 1
      case 49:
        if (e.ctrlKey) {
          this.loadImg(this.state.activeIndex);
          isFeatrue = true;
        }
        break;
      default:
        break;
    }
    if (isFeatrue) {
      e.preventDefault();
    }
  }

  handleTransitionEnd = e => {
    if (!this.state.transitionEnd || this.state.visibleStart) {
      this.setState({
        visibleStart: false,
        transitionEnd: true,
      });
    }
  };

  bindEvent(remove: boolean = false) {
    let funcName = 'addEventListener';
    if (remove) {
      funcName = 'removeEventListener';
    }
    document[funcName]('keydown', this.handleKeydown, false);
  }

  componentWillUnmount() {
    this.bindEvent(true);
    (this.refs['viewerCore'] as HTMLDivElement).removeEventListener(
      'transitionend',
      this.handleTransitionEnd,
      false
    );
  }

  componentWillReceiveProps(nextProps: ViewerProps) {
    if (!this.props.visible && nextProps.visible) {
      this.startVisible(nextProps.activeIndex);
      return;
    }
    if (this.props.visible && !nextProps.visible) {
      this.bindEvent(true);
      this.handleZoom(
        this.containerWidth / 2,
        (this.containerHeight - this.footerHeight) / 2,
        -1,
        (this.state.scaleX > 0 ? 1 : -1) * this.state.scaleX - 0.11
      );
      setTimeout(() => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        this.setState({
          visible: false,
          transitionEnd: false,
          width: 0,
          height: 0,
          scaleX: 1,
          scaleY: 1,
          rotate: 1,
          imageWidth: 0,
          imageHeight: 0,
          loadFailed: false,
        });
      }, transitionDuration);
      return;
    }
    if (this.props.activeIndex !== nextProps.activeIndex) {
      this.handleChangeImg(nextProps.activeIndex);
      return;
    }
  }

  handleCanvasMouseDown = e => {
    this.props.onMaskClick(e);
  };

  getActiveImage = () => {
    let activeImg: ImageDecorator = {
      src: '',
      alt: '',
      downloadUrl: '',
    };

    let images = this.props.images || [];
    if (images.length > 0 && this.state.activeIndex >= 0) {
      activeImg = images[this.state.activeIndex];
    }

    return activeImg;
  };

  handleMouseScroll = (e) => {
    e.preventDefault();
    let direct: 0 | 1 | -1 = 0;
    if (e.deltaY === 0) {
      direct = 0;
    } else {
      direct = e.deltaY > 0 ? -1 : 1;
    }
    if (direct !== 0) {
      let x = e.clientX;
      let y = e.clientY;
      if (this.props.container) {
        const containerRect = this.props.container.getBoundingClientRect();
        x -= containerRect.left;
        y -= containerRect.top;
      }
      this.handleScrollZoom(x, y, direct);
    }
  }

  render() {
    let activeImg: ImageDecorator = {
      src: '',
      alt: '',
    };

    let zIndex = 1000;

    if (this.props.zIndex) {
      zIndex = this.props.zIndex;
    }

    let viewerStryle: React.CSSProperties = {
      opacity: this.state.visible ? 1 : 0,
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

    let className = `${this.prefixCls} ${this.prefixCls}-transition`;
    if (this.props.container) {
      className += ` ${this.prefixCls}-inline`;
    }

    return (
      <div
        ref="viewerCore"
        className={className}
        style={viewerStryle}
        onWheel={this.handleMouseScroll}
      >
        <div className={`${this.prefixCls}-mask`} style={{ zIndex: zIndex }} />
        {this.props.noClose || (
          <div
            className={`${this.prefixCls}-close ${this.prefixCls}-btn`}
            onClick={this.handleClose}
            style={{ zIndex: zIndex + 10 }}
          >
            <Icon type={ActionType.close} />
          </div>
        )}
        <ViewerCanvas
          prefixCls={this.prefixCls}
          imgSrc={this.state.loadFailed ? this.props.defaultImg.src || activeImg.src : activeImg.src}
          visible={this.props.visible}
          width={this.state.width}
          height={this.state.height}
          top={this.state.top}
          left={this.state.left}
          rotate={this.state.rotate}
          onChangeImgState={this.handleChangeImgState}
          onResize={this.handleResize}
          zIndex={zIndex + 5}
          scaleX={this.state.scaleX}
          scaleY={this.state.scaleY}
          loading={this.state.loading}
          drag={this.props.drag}
          container={this.props.container}
          onCanvasMouseDown={this.handleCanvasMouseDown}
        />
        {this.props.noFooter || (
          <div className={`${this.prefixCls}-footer`} style={{ zIndex: zIndex + 5 }}>
            {this.props.noToolbar || (
              <ViewerToolbar
                prefixCls={this.prefixCls}
                onAction={this.handleAction}
                alt={activeImg.alt}
                width={this.state.imageWidth}
                height={this.state.imageHeight}
                attribute={this.props.attribute}
                zoomable={this.props.zoomable}
                rotatable={this.props.rotatable}
                scalable={this.props.scalable}
                changeable={this.props.changeable}
                downloadable={this.props.downloadable}
                noImgDetails={this.props.noImgDetails}
                toolbars={this.props.customToolbar(defaultToolbars)}
              />
            )}
            {this.props.noNavbar || (
              <ViewerNav
                prefixCls={this.prefixCls}
                images={this.props.images}
                activeIndex={this.state.activeIndex}
                onChangeImg={this.handleChangeImg}
              />
            )}
          </div>
        )}
        {!!this.props.imageCaption && (
            <div className="react-viewer-caption">
              <div className="react-viewer-captionContent">
                {this.props.imageCaption}
              </div>
            </div>
        )}
      </div>
    );
  }
}
