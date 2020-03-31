import React, { useState, useEffect } from 'react';
import style from './workCorrection.less';
import { Input, Icon, Modal, message } from 'antd';
import observer from '../../utils/observer'

export default function MarkedArea(props) {
    const [load, setLoad] = useState(0);
    const [newsrc, setNewsrc] = useState(props.src);
    const [multiple, setMultiple] = useState(1);
    const [mouseClickX, setMouseClickX] = useState(false);
    const [mouseMove, setMouseMove] = useState(false);

    const [mouseMoveType, setMouseMoveType] = useState(false);

    const [drawRectXY, setDrawRectXY] = useState(false);
    const [drawMove, setDrawMove] = useState(false);


    const [dragStartX, setDragStartX] = useState(false);
    const [dragStartY, setDragStartY] = useState(false);




    useEffect(() => {
        if (newsrc !== props.src) {
            setNewsrc(props.src)
            setLoad(0)
            observer.publish('setLoad', 0)
        }
    });


    //点击对图标消失
    function halfAlter(e, nowTopic, j) {
        if (props.isAmend) {
            message.warning('当前已全部批改完成状态，点击【修改】按钮，才能改判作业')
            return false
        }
        nowTopic.markList.splice(j, 1);
        props.gxphList()
        e.stopPropagation();
    }
    //点击错误图标变成半对
    function mistakeAlter(e, nowTopic, j) {
        if (props.isAmend) {
            message.warning('当前已全部批改完成状态，点击【修改】按钮，才能改判作业')
            return false
        }
        nowTopic.markList[j].type = 2;
        props.gxphList()
        e.stopPropagation();
    }
    //点击半对变成对
    function trueAlter(e, nowTopic, j) {
        if (props.isAmend) {
            message.warning('当前已全部批改完成状态，点击【修改】按钮，才能改判作业')
            return false
        }
        nowTopic.markList[j].type = 4;
        props.gxphList()
        e.stopPropagation();
    }
    //删除 
    function delectWho(e, nowTopic, j, who) {
        if (who === 1) {
            //删除图标
            nowTopic.markList.splice(j, 1)
            props.gxphList()
            e.stopPropagation();
        } else if (who === 2) {
            //删除文本
            nowTopic.contentMarkList.splice(j, 1)
            props.gxphList()
            e.stopPropagation();
        } else if (who === 3) {
            //删除矩形框
            nowTopic.supMarkList.splice(j, 1)
            props.gxphList()
            e.stopPropagation();
        }

    }

    //画矩形框
    function drawing(e, nowTopic) {
        if (load === 0) {
            //图片正在加载中，不能操作
            return false
        }
        if (drawMove) {
            drawRectXY.width = e.nativeEvent.screenX - drawRectXY.screenX;
            drawRectXY.height = e.nativeEvent.screenY - drawRectXY.screenY;
        } else {
            if (!props.nowTopic.supMarkList || props.nowTopic.supMarkList.length === 0) {
                //第一次生成矩形框
                nowTopic.supMarkList = [drawRectXY];
            } else {
                //已经有过矩形框
                nowTopic.supMarkList.push(drawRectXY);
            }
            console.log(nowTopic.supMarkList)
            setDrawMove(true)
        }

        props.gxphList()
    }

    //文字工具
    function textPostil(e, nowTopic) {
        if (props.isAmend) {
            message.warning('当前已全部批改完成状态，点击【修改】按钮，才能改判作业')
            return false
        }
        if (load === 0) {
            //图片正在加载中，不能操作
            return false
        }
        //生成输入框
        let nowdom = e.currentTarget;
        let x = e.nativeEvent.offsetX;
        let y = e.nativeEvent.offsetY;
        //防止在边缘点击
        if (x > (nowdom.offsetWidth - 50) * multiple) {
            x = (nowdom.offsetWidth - 50) * multiple
        }
        if (y > nowdom.offsetHeight - 35 * multiple) {
            y = nowdom.offsetHeight - 35 * multiple
        }
        if (!nowTopic.contentMarkList || nowTopic.contentMarkList.length === 0) {
            //第一次批注
            nowTopic.contentMarkList = [{
                x,
                y,
                content: '',
                type: 6,
            }];
        } else {
            //已批过
            nowTopic.contentMarkList.push({
                x,
                y,
                content: '',
                type: 6,
            });
        }
        props.gxphList()
        //光标定位

        setTimeout(() => {
            nowdom.children[nowTopic.contentMarkList.length - 1].children[0].focus()
        }, 100);
    }


    //生成批改图标的方法
    function generateResults(e, nowTopic) {
        if (props.isAmend) {
            message.warning('当前已全部批改完成状态，点击【修改】按钮，才能改判作业')
            return false
        }
        if (load === 0) {
            //图片正在加载中，不能操作
            return false
        }
        //生成错误图标
        let nowdom = e.currentTarget;

        let x = e.nativeEvent.offsetX;
        let y = e.nativeEvent.offsetY;

        //防止在边缘点击造成批改图标在外面
        if (x > (nowdom.offsetWidth - props.nowIcoWidth - 10 * props.nowIcoWidth / 40) * multiple) {
            x = (nowdom.offsetWidth - props.nowIcoWidth - 10 * props.nowIcoWidth / 40) * multiple
        } else if (x < (props.nowIcoWidth / 2 + 30 * props.nowIcoWidth / 40) * multiple) {
            x = (props.nowIcoWidth / 2 + 30 * props.nowIcoWidth / 40) * multiple
        }
        if (y > (nowdom.offsetHeight - 27 * props.nowIcoWidth / 40) * multiple) {
            y = (nowdom.offsetHeight - 27 * props.nowIcoWidth / 40) * multiple
        } else if (y < (27 * props.nowIcoWidth / 40) * multiple) {
            y = (27 * props.nowIcoWidth / 40) * multiple
        }


        if (!nowTopic.markList || nowTopic.markList.length === 0 || nowTopic.markList[0].type === 3) {
            //第一次批改或者从打勾开始重新批改
            nowTopic.markList = [{
                x,
                y,
                type: 1
            }];
        } else {
            //已批改过
            nowTopic.markList.push({
                x,
                y,
                type: 1
            });
        }
        props.gxphList()
    }

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
    //点击缩小
    function shrink() {
        if (multiple > 1) {
            //对错
            if (props.nowTopic.markList && props.nowTopic.markList.length > 0 && props.nowTopic.markList[0].type !== 3) {
                for (let obj of props.nowTopic.markList) {
                    obj.x = obj.x / 2
                    obj.y = obj.y / 2
                }
            }
            //文本
            if (props.nowTopic.contentMarkList && props.nowTopic.contentMarkList.length > 0) {
                for (let obj of props.nowTopic.contentMarkList) {
                    obj.x = obj.x / 2
                    obj.y = obj.y / 2
                }
            }

            setMultiple(multiple / 2)
            props.nowTopic.multiple = multiple / 2;
        }
    }
    //点击放大
    function magnify() {
        if (multiple < 4) {
            //对错
            if (props.nowTopic.markList && props.nowTopic.markList.length > 0 && props.nowTopic.markList[0].type !== 3) {
                for (let obj of props.nowTopic.markList) {
                    obj.x = obj.x * 2
                    obj.y = obj.y * 2
                }
            }
            //文本
            if (props.nowTopic.contentMarkList && props.nowTopic.contentMarkList.length > 0) {
                for (let obj of props.nowTopic.contentMarkList) {
                    obj.x = obj.x * 2
                    obj.y = obj.y * 2
                }
            }
            setMultiple(multiple * 2)
            props.nowTopic.multiple = multiple * 2;
        }
    }

    return (
        <div className={style.checkPicture} style={{ width: `${props.nowImgWidth}px` }}>

            <div className={`${style.nowImg} ${props.mouseType === 'trash' && style.clearImg}`}
                style={props.mouseType === 'text' ? { cursor: 'crosshair' } : {}}
                onMouseUp={() => {
                    if (props.mouseType === 'trash') {
                        setMouseMoveType(false)
                    }
                }}
                onMouseMove={e => {
                    //默认批改类型画矩形框
                    if (!props.mouseType && drawRectXY && e.nativeEvent.offsetX - drawRectXY.x > 5) {
                        //目前先限制只能往右下角方向
                        drawing(e, props.nowTopic)
                    }

                    //放大时移动图片
                    if (multiple > 1) {
                        if (!mouseMove && mouseClickX && Math.abs(e.nativeEvent.offsetX - mouseClickX) > 10) {
                            setMouseMove(true)
                            setMouseClickX(e.nativeEvent.clientX)
                        }
                        if (mouseMove) {
                            if (e.nativeEvent.clientX - mouseClickX < 0) {
                                e.currentTarget.scrollLeft += Math.abs(e.nativeEvent.clientX - mouseClickX)
                            } else if (e.nativeEvent.clientX - mouseClickX > 0) {
                                e.currentTarget.scrollLeft -= Math.abs(e.nativeEvent.clientX - mouseClickX)
                            }
                            setMouseClickX(e.nativeEvent.clientX)
                        }
                    }
                }}
                onMouseLeave={() => {
                    if (mouseMove) {
                        setMouseMove(false)
                        setMouseClickX(false)
                    }
                }}
                onClick={(e) => {
                    if (props.isAmend) {
                        message.warning('当前已全部批改完成状态，点击【修改】按钮，才能改判作业')
                        return false
                    }
                    if (props.mouseType === 'trash' && !mouseMove) {
                        //清除
                        return
                    }
                    if (props.mouseType === 'text' && !mouseMove) {
                        //文字
                        textPostil(e, props.nowTopic)
                        return
                    }
                    setDrawRectXY(false)
                    if (drawMove) {
                        //画矩形框中
                        setDrawMove(false)
                        return
                    }
                    if (!mouseMove) {
                        generateResults(e, props.nowTopic)
                    }
                    setMouseMove(false)
                    setMouseClickX(false)
                }}>
                {/* 文字工具 */}
                {load === 1 && props.nowTopic.contentMarkList && props.nowTopic.contentMarkList.length > 0 && props.nowTopic.contentMarkList.map((item, j) => {
                    return (
                        <div key={j} draggable
                            onDragStart={(e) => {
                                setDragStartX(e.clientX)
                                setDragStartY(e.clientY)
                            }}
                            onDragEnd={(e) => {
                                let node = e.currentTarget.parentNode.parentNode;

                                if (e.clientX - dragStartX + item.x > node.offsetWidth - 50) {
                                    item.x = node.offsetWidth - 50
                                } else if (e.clientX - dragStartX > 0) {
                                    item.x = e.clientX - dragStartX + item.x
                                } else if (dragStartX - e.clientX > item.x) {
                                    item.x = 0
                                } else if (dragStartX - e.clientX > 0) {
                                    item.x = item.x - dragStartX + e.clientX
                                }

                                if (e.clientY - dragStartY + item.y > node.offsetHeight - 35) {
                                    item.y = node.offsetHeight - 35
                                } else if (e.clientY - dragStartY > 0) {
                                    item.y = e.clientY - dragStartY + item.y
                                } else if (dragStartY - e.clientY > item.y) {
                                    item.y = 0
                                } else if (dragStartY - e.clientY > 0) {
                                    item.y = item.y - dragStartY + e.clientY
                                }
                                setDragStartX(false)
                                setDragStartY(false)

                            }}
                            className={style.textOutBox}
                            style={props.mouseType !== 'trash' ? {
                                top: item.y,
                                left: item.x,
                                maxWidth: `calc(100% - ${item.x}px)`,
                                maxHeight: `calc(100% - ${item.y}px)`,
                                border: `${props.mouseType ? '1px solid' : '0px'}`,
                                cursor: 'move',
                                width: item.width
                            } : {
                                    top: item.y,
                                    left: item.x,
                                    maxWidth: `calc(100% - ${item.x}px)`,
                                    maxHeight: `calc(100% - ${item.y}px)`,
                                    border: `${props.mouseType ? '1px solid' : '0px'}`,
                                    width: item.width
                                }}>
                            <div contentEditable={props.mouseType === 'text'}
                                className={style.textBox}
                                onInput={(e) => {
                                    if (e.currentTarget.textContent.length > 200) {
                                        e.currentTarget.textContent = item.content
                                        return;
                                    }
                                    item.content = e.currentTarget.textContent;
                                    item.width = e.currentTarget.clientWidth;
                                    item.height = e.currentTarget.clientHeight;
                                }}
                                onMouseOver={(e) => {
                                    if (mouseMoveType === 'trash') {
                                        //清除
                                        delectWho(e, props.nowTopic, j, 2)
                                    }
                                }}
                                onClick={(e) => {
                                    if (props.mouseType === 'trash') {
                                        //清除
                                        delectWho(e, props.nowTopic, j, 2)
                                    }
                                    e.stopPropagation()
                                    e.preventDefault()
                                }}
                                style={
                                    props.mouseType !== 'trash' ? {
                                        minWidth: 50 * multiple,
                                        minHeight: 35 * multiple,
                                        fontSize: 20 * multiple * props.nowImgWidth / 940,
                                        lineHeight: 1.2,
                                        cursor: props.mouseType ? 'default' : 'move',
                                    } : {
                                            minWidth: 50 * multiple,
                                            minHeight: 35 * multiple,
                                            fontSize: 20 * multiple * props.nowImgWidth / 940,
                                            lineHeight: 1.2,
                                        }}>
                                {item.content}
                            </div>
                        </div>

                    )
                })}

                {/* 矩形框 */}
                {load === 1 && props.nowTopic.supMarkList && props.nowTopic.supMarkList.length > 0 && props.nowTopic.supMarkList.map((item, j) => {
                    return (<div key={j} className={style.rectangle}
                        style={{ top: item.y, left: item.x, width: item.width, height: item.height }}
                        onMouseOver={(e) => {
                            if (mouseMoveType === 'trash') {
                                //清除
                                delectWho(e, props.nowTopic, j, 3)
                            }
                        }}
                        onMouseMove={(e) => {
                            if (drawMove) {
                                drawRectXY.width = e.nativeEvent.screenX - drawRectXY.screenX;
                                drawRectXY.height = e.nativeEvent.screenY - drawRectXY.screenY;
                                props.gxphList();
                            }
                        }}
                        onClick={(e) => {
                            if (props.mouseType === 'trash') {
                                //清除
                                delectWho(e, props.nowTopic, j, 3)
                            }
                            e.stopPropagation()
                            e.preventDefault()
                        }}>
                    </div>)
                })}

                {/* 对错图标 */}
                {load === 1 && props.nowTopic.markList && props.nowTopic.markList.length > 0 && props.nowTopic.markList[0].type !== 3 && props.nowTopic.markList.map((item, j) => {
                    return (<div key={j}>
                        {item.type === 1 &&
                            <img alt='' src={require('../images/cuowu.png')} className={`${style.checkCuo} ${props.mouseType === 'trash' && style.clearImg} `} style={{ top: item.y, left: item.x, width: props.nowIcoWidth * multiple, }}
                                onMouseOver={(e) => {
                                    if (mouseMoveType === 'trash') {
                                        //清除
                                        delectWho(e, props.nowTopic, j, 1)
                                    }
                                }}
                                onClick={(e) => {
                                    if (props.mouseType === 'trash') {
                                        delectWho(e, props.nowTopic, j, 1)
                                    } else {
                                        //点击错误图标时，更改为半对
                                        mistakeAlter(e, props.nowTopic, j)
                                    }

                                    e.stopPropagation()
                                    e.preventDefault()

                                }} />}
                        {item.type === 2 && <img alt='' src={require('../images/bandui.png')} className={`${style.checkDui} ${props.mouseType === 'trash' && style.clearImg} `} style={{ top: item.y, left: item.x, width: `${props.nowIcoWidth / 40 * 100 * multiple}px`, }}
                            onMouseOver={(e) => {
                                if (mouseMoveType === 'trash') {
                                    //清除
                                    delectWho(e, props.nowTopic, j, 1)
                                }
                            }}
                            onClick={(e) => {
                                if (props.mouseType === 'trash') {
                                    //清除
                                    delectWho(e, props.nowTopic, j, 1)
                                } else {
                                    //点击半对图标时，图标变对
                                    trueAlter(e, props.nowTopic, j)
                                }
                                e.stopPropagation()
                                e.preventDefault()

                            }} />}
                        {item.type === 4 && <img alt='' src={require('../images/reddui.png')} className={`${style.checkDui} ${props.mouseType === 'trash' && style.clearImg} `} style={{ top: item.y, left: item.x, width: `${props.nowIcoWidth / 40 * 100 * multiple}px`, }}
                            onMouseOver={(e) => {
                                if (mouseMoveType === 'trash') {
                                    //清除
                                    delectWho(e, props.nowTopic, j, 1)
                                }
                            }}
                            onClick={(e) => {
                                if (props.mouseType === 'trash') {
                                    //清除
                                    delectWho(e, props.nowTopic, j, 1)
                                } else {
                                    //点击对图标时，图标消失
                                    halfAlter(e, props.nowTopic, j)
                                }
                                e.stopPropagation()
                                e.preventDefault()

                            }} />}
                    </div>)
                })}

                <div style={load === 0 ? {
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '15%',
                } : { display: 'none' }}>
                    <img src={'https://homework.mizholdings.com/kacha/xcx/page/4785173221607424.4758128007628800.1581070647900.jpg'} style={{ width: 100 }} />
                </div>
                <img alt='' src={`${newsrc}/rotate/${props.nowTopic.angle}`} style={load === 0 ?
                    { visibility: 'hidden' } : {
                        width: `${multiple * props.nowImgWidth}px`,
                    }}
                    onMouseDown={e => {
                        if (props.isAmend) {
                            return false
                        }

                        if (props.mouseType === 'trash') {
                            setMouseMoveType('trash')
                        }
                        //记录此时点击的坐标位置
                        if (e.nativeEvent.target === e.currentTarget && multiple > 1) {
                            setMouseClickX(e.nativeEvent.offsetX)
                        }
                        if (!props.mouseType) {
                            setDrawRectXY({
                                x: e.nativeEvent.offsetX,
                                y: e.nativeEvent.offsetY,
                                screenX: e.nativeEvent.screenX,
                                screenY: e.nativeEvent.screenY,
                                type: 5,
                            })
                        }
                        e.preventDefault()
                    }}
                    onLoad={() => { setLoad(1); observer.publish('setLoad', 1) }} />
                {props.wtbHomeworkCorrect &&
                    <>
                        {props.wtbHomeworkCorrect.isExcellent === 1 && <img alt='' src={'http://homework.mizholdings.com/kacha/kcsj/6321c93c26e057a5/.png'} className={style.verygood} style={{ width: `${props.nowIcoWidth / 40 * 125 * multiple}px`, right: ` - ${(multiple - 1) * props.nowImgWidth}px` }} onClick={(e) => { e.stopPropagation() }} onMouseDown={(e) => { e.preventDefault() }} />}
                        {props.wtbHomeworkCorrect.level === "A+" && <img alt='' src={'http://homework.mizholdings.com/kacha/kcsj/cad27f38bc42a604/.png'} className={style.level} style={{ width: `${props.nowIcoWidth / 40 * 100 * multiple}px`, top: 65, right: `${props.nowIcoWidth / 40 * 125 * multiple - (multiple - 1) * props.nowImgWidth}px` }} onClick={(e) => { e.stopPropagation() }} onMouseDown={(e) => { e.preventDefault() }} />}
                        {props.wtbHomeworkCorrect.level === "A" && <img alt='' src={'http://homework.mizholdings.com/kacha/kcsj/32a1349fd07f48bc/.png'} className={style.level} style={{ width: `${props.nowIcoWidth / 40 * 100 * multiple}px`, top: 65, right: `${props.nowIcoWidth / 40 * 125 * multiple - (multiple - 1) * props.nowImgWidth}px` }} onClick={(e) => { e.stopPropagation() }} onMouseDown={(e) => { e.preventDefault() }} />}
                        {props.wtbHomeworkCorrect.level === "B" && <img alt='' src={'http://homework.mizholdings.com/kacha/kcsj/1c0aee03f542237f/.png'} className={style.level} style={{ width: `${props.nowIcoWidth / 40 * 100 * multiple}px`, top: 65, right: `${props.nowIcoWidth / 40 * 125 * multiple - (multiple - 1) * props.nowImgWidth}px` }} onClick={(e) => { e.stopPropagation() }} onMouseDown={(e) => { e.preventDefault() }} />}
                        {props.wtbHomeworkCorrect.level === "C" && <img alt='' src={'http://homework.mizholdings.com/kacha/kcsj/f1effe5f8b59942f/.png'} className={style.level} style={{ width: `${props.nowIcoWidth / 40 * 100 * multiple}px`, top: 65, right: `${props.nowIcoWidth / 40 * 125 * multiple - (multiple - 1) * props.nowImgWidth}px` }} onClick={(e) => { e.stopPropagation() }} onMouseDown={(e) => { e.preventDefault() }} />}
                        {props.wtbHomeworkCorrect.level === "D" && <img alt='' src={'http://homework.mizholdings.com/kacha/kcsj/41979bc6194d85ae/.png'} className={style.level} style={{ width: `${props.nowIcoWidth / 40 * 100 * multiple}px`, top: 65, right: `${props.nowIcoWidth / 40 * 125 * multiple - (multiple - 1) * props.nowImgWidth}px` }} onClick={(e) => { e.stopPropagation() }} onMouseDown={(e) => { e.preventDefault() }} />}

                    </>
                }
                {props.nowTopic.markList && props.nowTopic.markList.length > 0 && props.nowTopic.markList[0].type === 3 && load === 1 && <img alt='' src={'http://homework.mizholdings.com/kacha/kcsj/d4ceb3ed3044a742/.png'} className={style.dagou} style={{ width: `${props.nowIcoWidth / 40 * 460 * multiple}px`, left: `${multiple * 50}% ` }} onMouseDown={(e) => { e.preventDefault() }} onClick={(e) => { e.stopPropagation() }} />}


            </div>
        </div >

    )

}