import React from 'react';
import {
    Layout, Icon,
} from 'antd';

export default class PhotoLayer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nownum: 0
        }
    }

    render() {

        if (this.props.masters.length > 0) {
            return <div style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 1000,
                height: '100%',
                width: '100%',
                backgroundColor: ' rgba(0, 0, 0, 0.65)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
                onClick={() => {
                    this.props.clearMasters()
                }}>
                {this.props.masters.length > 1 ?
                    <Icon type="left-circle" theme="twoTone" style={{ fontSize: 80, width: '10%', cursor: 'pointer' }}
                        onClick={(e) => {
                            if (this.state.nownum > 0) {
                                this.setState({
                                    nownum: --this.state.nownum
                                })
                            }
                            e.stopPropagation()
                        }} />
                    : ''
                }


                <img src={this.props.masters[this.state.nownum].imageUrl.indexOf('?') > 0 ? `${this.props.masters[this.state.nownum].imageUrl}/thumbnail/1000x` : `${this.props.masters[this.state.nownum].imageUrl}?imageMogr2/thumbnail/1000x`} style={{ height: '80vh' }} onClick={(e) => {
                    e.stopPropagation()
                }} />
                {this.props.masters.length > 1 ?
                    <Icon type="right-circle" theme="twoTone" style={{ fontSize: 80, width: '10%', cursor: 'pointer' }} onClick={(e) => {
                        if (this.state.nownum < this.props.masters.length - 1) {
                            this.setState({
                                nownum: ++this.state.nownum
                            })
                        }
                        e.stopPropagation()
                    }} /> : ''}

            </div>
        } else {
            return <div> </div>
        }

    }

}

