import React from 'react';
import { Button } from 'antd';
import style from './guidance.less';

export default class Guidance extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: true
    }
  }

  render() {
    let wz1 = {}, wz2 = {}, keyname;
    if (this.props.title === '搜索题目') {
      wz1 = { top: 92, left: 10 };
      wz2 = { left: 150 };
      keyname = 'sstm';
      if (localStorage.getItem(keyname, true)) {
        return (<div></div>)
      }
    } else if (this.props.title === '录视频') {
      wz1 = { top: 38, right: 0 };
      wz2 = {
        left: 350,
        top: '-198px',
        borderTopColor: 'transparent',
        borderBottomColor: '#409eff'
      };
      keyname = 'lsp';
      if (localStorage.getItem(keyname, true)) {
        return (<div></div>)
      }
    } else if (this.props.title === '下载错题') {
      wz1 = { right: 50, top: 50 };
      wz2 = {
        left: 350,
        top: '-208px',
        borderTopColor: 'transparent',
        borderBottomColor: '#409eff'
      };
      keyname = 'xzct';
      if (localStorage.getItem(keyname, true)) {
        return (<div></div>)
      }
    } else if (this.props.title === '单题题号') {
      wz1 = { right: '-285px', top: 30 };
      wz2 = {
        left: 52,
        top: '-190px',
        borderTopColor: 'transparent',
        borderBottomColor: '#409eff'
      };
      keyname = 'ypg';
      if (localStorage.getItem(keyname, true)) {
        return (<div></div>)
      }
    } else if (this.props.title === '预批改') {
      wz1 = { right: '-135px', top: 45 };
      wz2 = {
        left: 185,
        top: '-190px',
        borderTopColor: 'transparent',
        borderBottomColor: '#409eff'
      };
      keyname = 'dtth';
      if (localStorage.getItem(keyname, true)) {
        return (<div></div>)
      }
    } else if (this.props.title === '未交作业一键提醒') {
      wz1 = { right: '15px', top: 50 };
      wz2 = {
        left: 330,
        top: '-190px',
        borderTopColor: 'transparent',
        borderBottomColor: '#409eff'
      };
      keyname = 'yjtx';
      if (localStorage.getItem(keyname, true)) {
        return (<div></div>)
      }
    }


    return (
      <div style={this.state.visible ? { display: 'block', ...wz1 } : { display: 'none' }}
        className={style.ydaotu} >
        <div className={style.bubble} style={this.props.titel === '下载错题' ? { zIndex: 1033 } : {}}
          onClick={(e) => { e.stopPropagation() }}>
          <p className={style.biaoti}>{this.props.title}</p>
          <p className={style.neirong}> {this.props.content}</p>
          <p style={{ textAlign: 'right', margin: 0 }}>
            <Button className={style.anniu} onClick={() => {
              localStorage.setItem(keyname, true)
              this.setState({ visible: false })
            }} type="primary">知道了</Button>
          </p>
        </div>
        <div style={wz2} className={style.jiantou}> </div>
      </div>

    )
  }

}
/*
@titel 标题
@content 内容
*/

Guidance.defaultProps = {
  title: '',
  content: <div> </div>,
};
