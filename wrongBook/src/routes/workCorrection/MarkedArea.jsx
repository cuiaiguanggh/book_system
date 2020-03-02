import React, { useState, useEffect } from 'react';
import style from './workCorrection.less';
import { message, Icon, Modal } from 'antd';
export default function MarkedArea(props) {
    const [load, setLoad] = useState(0);
    const [newsrc, setNewsrc] = useState(props.src);
    const [multiple, setMultiple] = useState(1);
    const [mouseClickX, setMouseClickX] = useState(false);
    const [mouseMove, setMouseMove] = useState(false);

    const [top, setTop] = useState(0);

    useEffect(() => {
        if (newsrc !== props.src) {
            setNewsrc(props.src)
            setLoad(0)
        }
        if (document.getElementById('pyu')) {
            setTop(document.getElementById('pyu').offsetHeight)
        } else {
            setTop(0)
        }
    });

    //点击半对图标消失
    function halfAlter(e, nowTopic, j) {
        // if (nowTopic.status === 1) {
        //     //批改过不能修改
        //     return false
        // }
        nowTopic.markList.splice(j, 1);
        props.gxphList()
        e.stopPropagation();
    }
    //点击错误图标变成半对
    function mistakeAlter(e, nowTopic, j) {
        // if (nowTopic.status === 1) {
        //     //批改过不能修改
        //     return false
        // }
        nowTopic.markList[j].type = 2;
        props.gxphList()
        e.stopPropagation();
    }

    //生成批改图标的方法
    function generateResults(e, nowTopic) {
        if (load === 0) {
            //图片正在加载中，不能操作
            return false
        }
        // if (nowTopic.status === 1) {
        //     //批改过不能修改
        //     message.warning('此学生作业已完成批改，不可修改')
        //     return false
        // }
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
        if (load === 0) {
            //图片正在加载中，不能操作
            return false
        }
        // if (nowTopic.status === 1) {
        //     message.info('已批改过，不能旋转')
        //     return false
        // }
        if (nowTopic.markList && nowTopic.markList.length > 0) {
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
    //不显示1，全对2，优秀3，需要努力4
    let remark = 1;
    if (props.nowTopic.status === 1 && !props.nowTopic.markList || (props.nowTopic.markList && props.nowTopic.markList.length > 0 && props.nowTopic.markList[0].type === 3)) {
        remark = 2
    } else if (props.nowTopic.markList && props.nowTopic.markList.length === 1 && props.nowTopic.markList[0].type !== 3) {
        remark = 3
    } else if (props.nowTopic.markList && props.nowTopic.markList.length > 0) {
        remark = 4
    }
    return (
        <div className={style.checkPicture} style={{ width: `${props.nowImgWidth}px` }}>
            <div className={style.imgtop}>
                <div style={{ float: 'left', marginLeft: 20 }}>
                    <span style={{ marginRight: 20 }}>{props.pitchStuName}</span>
                    {props.nowTopic.markList && props.nowTopic.markList.length > 0 && props.nowTopic.markList[0].type !== 3 &&
                        <span style={{ color: '#F56C6C', marginRight: 20 }}> 错误：{props.nowTopic.markList.length}题</span>
                    }
                    {props.nowTopic.markList && props.nowTopic.markList.length > 0 && props.nowTopic.markList[0].type === 3 &&
                        <span style={{ color: '#13CE66', marginRight: 20 }}> 全部正确</span>
                    }
                    {props.nowTopic.markList && props.nowTopic.markList.length > 0 ?
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
                    }
                </div>

                <div className={style.changesize}>
                    <span className={style.suobox}>
                        <div className={style.suo}> 缩小  </div>
                        <Icon type="minus-circle" theme="filled"
                            onClick={() => {
                                if (multiple > 1) {
                                    if (props.nowTopic.markList && props.nowTopic.markList.length > 0 && props.nowTopic.markList[0].type !== 3) {
                                        for (let obj of props.nowTopic.markList) {
                                            obj.x = obj.x / 2
                                            obj.y = obj.y / 2
                                        }
                                    }
                                    setMultiple(multiple / 2)
                                    props.nowTopic.multiple = multiple / 2;
                                }
                            }} />
                    </span>
                    <span className={style.numberx}>{multiple}X</span>
                    <span className={style.fangbox}>
                        <div className={style.fang}> 放大  </div>
                        <Icon type="plus-circle" theme="filled"
                            onClick={() => {
                                if (multiple < 4) {
                                    if (props.nowTopic.markList && props.nowTopic.markList.length > 0 && props.nowTopic.markList[0].type !== 3) {
                                        for (let obj of props.nowTopic.markList) {
                                            obj.x = obj.x * 2
                                            obj.y = obj.y * 2
                                        }
                                    }
                                    setMultiple(multiple * 2)
                                    props.nowTopic.multiple = multiple * 2;

                                }
                            }} />
                    </span>
                </div>
                <span className={style.xuanzhuang} onClick={(e) => { clickRotate(props.nowTopic) }}>
                    <span className={style.hintText}>旋转</span>
                </span>
                <span className={style.keyRemove}
                    onClick={(e) => {
                        if (load === 0) {
                            //图片正在加载中，不能操作
                            return false
                        }
                        // if (props.nowTopic.status === 1) {
                        //     message.info('已批改过，不能清除批改痕迹')
                        //     return false
                        // }
                        props.nowTopic.markList = [];
                        props.gxphList();
                    }}>
                    <span className={style.hintText}>清除批改痕迹</span>
                </span>


            </div>

            <div className={style.nowImg} style={{ width: '100%', overflow: 'hidden' }}
                onMouseMove={e => {
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
                onMouseOut={() => {
                    if (mouseMove) {
                        setMouseMove(false)
                        setMouseClickX(false)
                    }

                }}
                onClick={(e) => {
                    if (!mouseMove) {
                        generateResults(e, props.nowTopic)
                    }
                    setMouseMove(false)
                    setMouseClickX(false)
                    // setMouseClickY(false)
                }}>
                {load === 1 && props.nowTopic.markList && props.nowTopic.markList.length > 0 && props.nowTopic.markList[0].type !== 3 && props.nowTopic.markList.map((item, j) => {
                    return (<div key={j}>
                        {item.type === 1 ?
                            <img src={require('../images/cuowu.png')} className={style.checkCuo} style={{ top: item.y, left: item.x, width: props.nowIcoWidth * multiple, }}
                                onClick={(e) => {
                                    //点击错误图标时，更改为半对
                                    mistakeAlter(e, props.nowTopic, j)
                                    e.stopPropagation()
                                    e.preventDefault()

                                }} /> :
                            <img src={require('../images/bandui.png')} className={style.checkDui} style={{ top: item.y, left: item.x, width: `${props.nowIcoWidth / 40 * 100 * multiple}px`, }}
                                onClick={(e) => {
                                    //点击半对图标时，图标消失
                                    halfAlter(e, props.nowTopic, j)
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
                <img src={`${newsrc}/rotate/${props.nowTopic.angle}`} style={load === 0 ?
                    { visibility: 'hidden' } : {
                        width: `${multiple * props.nowImgWidth}px`,
                    }}
                    onMouseDown={e => {
                        if (e.nativeEvent.target === e.currentTarget && multiple > 1) {
                            setMouseClickX(e.nativeEvent.offsetX)
                        }
                        e.preventDefault()
                    }}
                    onLoad={() => { setLoad(1); }} />
                {props.wtbHomeworkCorrect &&
                    <>
                        <div className={style.teacherComment} id='pyu' style={{ width: `${multiple * 100}%` }}>
                            教师评语：{props.wtbHomeworkCorrect.common}{props.wtbHomeworkCorrect.content}
                        </div>

                        {props.wtbHomeworkCorrect.isExcellent === 1 && <img src={'http://homework.mizholdings.com/kacha/kcsj/6321c93c26e057a5/.png'} className={style.verygood} style={{ width: `${props.nowIcoWidth / 40 * 125 * multiple}px`, top: top, right: `-${(multiple - 1) * props.nowImgWidth}px` }} onMouseDown={(e) => { e.preventDefault() }} />}
                        {props.wtbHomeworkCorrect.level === "A" && <img src={'http://homework.mizholdings.com/kacha/kcsj/32a1349fd07f48bc/.png'} className={style.level} style={{ width: `${props.nowIcoWidth / 40 * 100 * multiple}px`, top: `${top + 65 * multiple}px`, right: `${props.nowIcoWidth / 40 * 125 * multiple - (multiple - 1) * props.nowImgWidth}px` }} onMouseDown={(e) => { e.preventDefault() }} />}
                        {props.wtbHomeworkCorrect.level === "B" && <img src={'http://homework.mizholdings.com/kacha/kcsj/1c0aee03f542237f/.png'} className={style.level} style={{ width: `${props.nowIcoWidth / 40 * 100 * multiple}px`, top: `${top + 65 * multiple}px`, right: `${props.nowIcoWidth / 40 * 125 * multiple - (multiple - 1) * props.nowImgWidth}px` }} onMouseDown={(e) => { e.preventDefault() }} />}
                        {props.wtbHomeworkCorrect.level === "C" && <img src={'http://homework.mizholdings.com/kacha/kcsj/f1effe5f8b59942f/.png'} className={style.level} style={{ width: `${props.nowIcoWidth / 40 * 100 * multiple}px`, top: `${top + 65 * multiple}px`, right: `${props.nowIcoWidth / 40 * 125 * multiple - (multiple - 1) * props.nowImgWidth}px` }} onMouseDown={(e) => { e.preventDefault() }} />}
                        {props.wtbHomeworkCorrect.level === "D" && <img src={'http://homework.mizholdings.com/kacha/kcsj/41979bc6194d85ae/.png'} className={style.level} style={{ width: `${props.nowIcoWidth / 40 * 100 * multiple}px`, top: `${top + 65 * multiple}px`, right: `${props.nowIcoWidth / 40 * 125 * multiple - (multiple - 1) * props.nowImgWidth}px` }} onMouseDown={(e) => { e.preventDefault() }} />}

                    </>
                }
                {remark === 2 && load === 1 && <img src={'http://homework.mizholdings.com/kacha/kcsj/d4ceb3ed3044a742/.png'} className={style.dagou} style={{ width: `${props.nowIcoWidth / 40 * 460 * multiple}px`, left: `${multiple * 50}%` }} onMouseDown={(e) => { e.preventDefault() }} />}


            </div>
        </div >

    )

}