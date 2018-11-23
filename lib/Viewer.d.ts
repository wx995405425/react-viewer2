import * as React from 'react';
import ViewerProps from './ViewerProps';
export default class Viewer extends React.Component<ViewerProps, any> {
    private defaultContainer;
    private container;
    private component;
    constructor();
    renderViewer(): void;
    removeViewer(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(nextProps: ViewerProps): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    render(): any;
}
