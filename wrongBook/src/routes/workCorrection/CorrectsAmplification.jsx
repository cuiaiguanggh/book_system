import React, { useState, useEffect } from 'react';
import {
    Layout, Icon, message
} from 'antd';
import style from './workCorrection.less';




export default function CorrectsAmplification(props) {


    const [nowTopic, setNowTopic] = useState(props.shuju);
    const [clientHeight, setClientHeight] = useState(document.body.clientHeight);
    const [remark, setRemark] = useState(props.remark);


    return (<div style={{
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
            let suzu = []
            //获取的批改结果坐标进行转换
            if (nowTopic.markList && nowTopic.markList.length > 0 && nowTopic.markList.type !== 3) {
                for (let obj of nowTopic.markList) {
                    suzu.push({
                        ...obj,
                        x: obj.x / props.proportion,
                        y: obj.y / props.proportion,
                    })
                }
            } else {
                suzu = nowTopic.markList
            }
            props.guanbi({
                ...nowTopic,
                markList: suzu,
            })
        }}>

        <div className={style.nowImg} style={{ height: clientHeight }} onClick={(e) => {

            if (nowTopic.status === 1) {
                //批改过不能修改
                message.warning('此学生作业已完成批改，不可修改')
                return false
            }

            //生成错误图标
            let nowdom = e.currentTarget;
            let x = e.clientX - nowdom.offsetLeft;
            let y = e.clientY - nowdom.offsetTop;


            //防止在边缘点击造成批改图标在外面
            if (x > nowdom.offsetWidth - props.nowIcoWidth - 10 * props.nowIcoWidth / 40) {
                x = nowdom.offsetWidth - props.nowIcoWidth - 10 * props.nowIcoWidth / 40
            } else if (x < props.nowIcoWidth / 2 + 30 * props.nowIcoWidth / 40) {
                x = props.nowIcoWidth / 2 + 30 * props.nowIcoWidth / 40
            }
            if (y > nowdom.offsetHeight - 27 * props.nowIcoWidth / 40) {
                y = nowdom.offsetHeight - 27 * props.nowIcoWidth / 40
            } else if (y < 27 * props.nowIcoWidth / 40) {
                y = 27 * props.nowIcoWidth / 40

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


            //不显示1，全对2，优秀3，需要努力4
            if (nowTopic.status === 1 && !nowTopic.markList || (nowTopic.markList && nowTopic.markList.length > 0 && nowTopic.markList[0].type === 3)) {
                setRemark(2)
            } else if (nowTopic.markList && nowTopic.markList.length === 1 && nowTopic.markList[0].type !== 3) {
                setRemark(3)
            } else if (nowTopic.markList && nowTopic.markList.length > 0) {
                setRemark(4)
            } else {
                setRemark(1)
            }


            setNowTopic({ ...nowTopic })
            e.stopPropagation();
        }}>
            {nowTopic.markList && nowTopic.markList.length > 0 && nowTopic.markList[0].type !== 3 && nowTopic.markList.map((item, j) => {
                return (<div key={j}>
                    {item.type === 1 ?
                        <img src={require('../images/cuowu.png')} className={style.checkCuo} style={{ top: item.y, left: item.x, width: props.nowIcoWidth, }}
                            onClick={(e) => {
                                if (nowTopic.status === 1) {
                                    //批改过不能修改
                                    return false
                                }
                                nowTopic.markList[j].type = 2;
                                setNowTopic({ ...nowTopic })
                                e.stopPropagation();
                            }} /> :
                        <img src={require('../images/bandui.png')} className={style.checkDui} style={{ top: item.y, left: item.x, width: `${props.nowIcoWidth / 40 * 100}px`, }}
                            onClick={(e) => {
                                //点击半对图标时，图标消失
                                if (nowTopic.status === 1) {
                                    //批改过不能修改
                                    return false
                                }
                                nowTopic.markList.splice(j, 1);
                                setNowTopic({ ...nowTopic })
                                e.stopPropagation();
                            }} />}
                </div>)
            })}
            <img src={`${nowTopic.pageUrl}/thumbnail/1000x/interlace/1/rotate/${props.angle}`} style={{
                height: '100%',
            }} onMouseDown={(e) => { e.preventDefault() }} />
            {remark === 2 && <>
                <img src={'http://homework.mizholdings.com/kacha/kcsj/4f6cc398fe2b0168/.png'} className={style.verygood} />
                <img src={'http://homework.mizholdings.com/kacha/kcsj/d4ceb3ed3044a742/.png'} className={style.dagou} /> </>}
            {remark === 3 && <img src={'http://homework.mizholdings.com/kacha/kcsj/7ad9942284f399fd/.png'} className={style.try} />}
            {remark === 4 && <img src={'http://homework.mizholdings.com/kacha/kcsj/8b84a6068e65b2e2/.png'} className={style.try} />}

        </div>
    </div >)
}


