import * as React from 'react';
import { ImageDecorator } from './ViewerProps';
export interface ViewerNavProps {
    prefixCls: string;
    images: ImageDecorator[];
    activeIndex: number;
    onChangeImg: (index: number) => void;
}
export default class ViewerNav extends React.Component<ViewerNavProps, any> {
    static defaultProps: {
        activeIndex: number;
    };
    handleChangeImg: (newIndex: any) => void;
    render(): JSX.Element;
}
