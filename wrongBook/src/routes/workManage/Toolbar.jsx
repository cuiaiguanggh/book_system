import React, { useState, useEffect } from 'react';
import style from './workCorrection.less';
import { message, Modal, Popover } from 'antd';
import observer from '../../utils/observer'



export default function Toolbar(props) {
    const [wrongNumber, setWrongNumber] = useState(0);
    const [load, setLoad] = useState(0);

    // 图片是加载状态
    observer.addSubscribe('setLoad', (state) => {
        setLoad(state)
    })
    useEffect(() => {
        //计算错误数
        let number = 0;
        if (props.nowTopic && props.nowTopic.markList) {
            for (let obj of props.nowTopic.markList) {
                if (obj.type === 1 || obj.type === 2) {
                    number++;
                }
            }
        }
        setWrongNumber(number)
    })


    //点击旋转
    function clickRotate(nowTopic) {
        if (props.isAmend) {
            message.warning('当前已全部批改完成状态，点击【修改】按钮，才能改判作业')
            return false
        }
        if (load === 0) {
            //图片正在加载中，不能操作
            return false
        }
        if ((nowTopic.markList && nowTopic.markList.length > 0) || (nowTopic.supMarkList && nowTopic.supMarkList.length > 0) || (nowTopic.contentMarkList && nowTopic.contentMarkList.length > 0)) {
            Modal.confirm({
                title: '已有批改痕迹，旋转将清空当前批改痕迹',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    if (nowTopic.angle < 360) {
                        nowTopic.angle += 90
                    } else if (nowTopic.angle === 360) {
                        nowTopic.angle = 90
                    }
                    nowTopic.markList = [];
                    nowTopic.supMarkList = [];
                    nowTopic.contentMarkList = [];
                    props.gxphList();
                }
            });
        } else {
            if (nowTopic.angle < 360) {
                nowTopic.angle += 90
            } else if (nowTopic.angle === 360) {
                nowTopic.angle = 90
            }
            nowTopic.markList = [];
            props.gxphList();
        }
    }

    return (
        <div className={style.imgtop}>
            <div style={{ float: 'left', marginLeft: 20 }}>
                <span style={{ marginRight: 20 }}>{props.pitchStuName}</span>
                {wrongNumber > 0 && <span style={{ color: '#F56C6C' }}> 错误：{wrongNumber}题</span>}
                {props.nowTopic && props.nowTopic.markList && props.nowTopic.markList.length > 0 && props.nowTopic.markList[0].type === 3 &&
                    <span style={{ color: '#13CE66' }}> 全部正确</span>}

                {/* {props.nowTopic.markList && props.nowTopic.markList.length > 0 ?
            <div className={style.allTrue} >✔全对</div> :
            <div className={style.allTrue} style={{ background: '#13ce66', cursor: 'pointer' }}
                onClick={(e) => {
                    if (load === 0) {
                        //图片正在加载中，不能操作
                        return false
                    }
                    props.nowTopic.markList = [{ type: 3 }];
                    props.gxphList()

                    e.stopPropagation();
                }}>✔全对</div>
        } */}
            </div>

            {/* <div className={style.changesize}>
        <span className={style.suobox}>
            <div className={style.suo}> 缩小  </div>
            <Icon type="minus-circle" theme="filled" onClick={shrink} />
        </span>
        <span className={style.numberx}>{multiple}X</span>
        <span className={style.fangbox}>
            <div className={style.fang}> 放大  </div>
            <Icon type="plus-circle" theme="filled" onClick={magnify} />
        </span>
    </div> */}

            <span className={style.quandui} onClick={(e) => {
                if (props.isAmend) {
                    message.warning('当前已全部批改完成状态，点击【修改】按钮，才能改判作业')
                    return false
                }
                //图片正在加载中，不能操作
                if (load === 0) { return false }
                props.nowTopic.markList = [{ type: 3 }];
                props.quandui()
                e.stopPropagation();
            }}>   全对  </span>
            <span className={style.xuanzhuang} onClick={(e) => { clickRotate(props.nowTopic) }}>
                <span className={style.hintText}>旋转</span>
            </span>

            <span className={`${style.trash} ${props.mouseType === 'trash' && style.nowSelect}`} onClick={(e) => {
                if (props.isAmend) {
                    message.warning('当前已全部批改完成状态，点击【修改】按钮，才能改判作业')
                    return false
                }
                //图片正在加载中，不能操作
                if (load === 0) { return false }
                props.changeMouseType('trash')
            }}>
                <span className={style.hintText}>清除</span>
            </span>
            <Popover content={(<div className={style.drawTypeA} onClick={(e) => {
                if (props.isAmend) {
                    message.warning('当前已全部批改完成状态，点击【修改】按钮，才能改判作业')
                    return false
                }
                //图片正在加载中，不能操作
                if (load === 0) { return false }
                let dataType = e.target.getAttribute('data-type');
                if (dataType) {
                    props.changeTextSize(Number(dataType))
                    props.changeMouseType('text');
                }
            }}>
                <span className={`${props.sizeMultiple === 0.7 && style.nowSelect}`} data-type='0.7' >小</span>
                <span className={`${props.sizeMultiple === 1 && style.nowSelect}`} data-type='1' style={{ margin: '0 17px' }}>中</span>
                <span className={`${props.sizeMultiple === 1.3 && style.nowSelect}`} data-type='1.3' >大</span>
            </div>)} trigger="hover" placement="bottom" mouseLeaveDelay={0.5}>

                <div className={style.AtextBox}>
                    <div className={`${style.Atext} ${props.mouseType === 'text' && style.nowSelect}`} onClick={(e) => {
                        if (props.isAmend) {
                            message.warning('当前已全部批改完成状态，点击【修改】按钮，才能改判作业')
                            return false
                        }
                        //图片正在加载中，不能操作
                        if (load === 0) { return false }
                        props.changeMouseType('text')
                    }}>
                        {/* <div className={style.triangle}></div>
                        <div className={style.drawType}>
                            <span className={`${props.sizeMultiple === 0.7 && style.nowSelect}`} onClick={() => { props.changeTextSize(0.7) }}>小</span>
                            <span className={`${props.sizeMultiple === 1 && style.nowSelect}`} onClick={() => { props.changeTextSize(1) }} style={{ margin: '0 15px' }}>中</span>
                            <span className={`${props.sizeMultiple === 1.3 && style.nowSelect}`} onClick={() => { props.changeTextSize(1.3) }}>大</span>
                        </div> */}
                    </div>
                </div>
            </Popover>
            <Popover content={(<div className={style.drawTypeC}
                onClick={(e) => {
                    if (props.isAmend) {
                        message.warning('当前已全部批改完成状态，点击【修改】按钮，才能改判作业')
                        return false
                    }
                    //图片正在加载中，不能操作
                    if (load === 0) { return false }
                    let dataType = e.target.getAttribute('data-type');
                    if (dataType) {
                        props.changeMouseType(dataType)
                    }
                }}>
                <div className={`${style.littleBox} ${props.mouseType === 'circleBox' && style.nowSelect}`} data-type='circleBox'></div>
                <div className={`${style.line} ${props.mouseType === 'circleLine' && style.nowSelect}`} data-type='circleLine'></div>
                <div className={`${style.tilde} ${props.mouseType === 'circleTilde' && style.nowSelect}`} data-type='circleTilde'></div>
            </div>)} trigger="hover" placement="bottom" mouseLeaveDelay={0.5}>

                <div className={style.circleBox}>
                    <div className={`${style.circle}  ${props.mouseType && props.mouseType.includes('Line') && style.line} ${props.mouseType && props.mouseType.includes('Tilde') && style.tilde}   ${props.mouseType && props.mouseType.includes('circle') && style.nowSelect}`} onClick={(e) => {
                        if (props.isAmend) {
                            message.warning('当前已全部批改完成状态，点击【修改】按钮，才能改判作业')
                            return false
                        }
                        //图片正在加载中，不能操作
                        if (load === 0) { return false }
                        props.changeMouseType('circleBox')
                    }}>
                        {/* <div className={style.triangle}></div>
                    <div className={style.drawType}>
                        <div className={`${style.littleBox} ${props.mouseType === 'circleBox' && style.nowSelect}`} data-type='circleBox'></div>
                        <div className={`${style.line} ${props.mouseType === 'circleLine' && style.nowSelect}`} data-type='circleLine'></div>
                        <div className={`${style.tilde} ${props.mouseType === 'circleTilde' && style.nowSelect}`} data-type='circleTilde'></div>
                    </div> */}

                    </div>
                </div>
            </Popover>

            <span className={`${style.defaultIcon} ${!props.mouseType && style.nowSelect}`} onClick={(e) => {
                if (props.isAmend) {
                    message.warning('当前已全部批改完成状态，点击【修改】按钮，才能改判作业')
                    return false
                }
                //图片正在加载中，不能操作
                if (load === 0) { return false }
                props.changeMouseType(false)

            }}>
                <span className={style.hintText}>批改</span>
            </span>
        </div >
    )
}
