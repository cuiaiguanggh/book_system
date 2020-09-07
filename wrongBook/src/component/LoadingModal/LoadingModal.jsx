import React from 'react';
import ReactDOM from 'react-dom';
import {
    Layout, Menu,Spin , Button, message,DatePicker, Select, Popover, Icon, Checkbox,Empty,Modal
  } from 'antd';

import style from './LoadingModal.less';
class LoadingModal extends React.Component {

    constructor(props) {
        super(props);
        this.node = document.createElement('div');
        document.body.appendChild(this.node);


        this.state={
            showModal:false
        }
        this.show=function(){
            this.setState({
                showModal:true
            })
        }
        this.hide=function(){
            this.setState({
                showModal:false
            })
        }
    }
    render() {
        let _modal=<div className={style.LoadingModal}
                        >
                        <Spin tip="Loading...">
                        </Spin>
                    </div>
        return ReactDOM.createPortal(
            _modal,
            this.node,
        );
    }
    componentDidMount() {
        
    }
}


export default LoadingModal
