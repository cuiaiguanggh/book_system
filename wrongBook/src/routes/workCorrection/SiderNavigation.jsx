import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { message, Layout, } from 'antd';
import style from './workCorrection.less';
const { Sider } = Layout;

function SiderNavigation(props) {
    const [dianji, setDianji] = useState(false);
    //一键提醒
    function keyRemind(studentList) {
        //限制连续点击
        if (dianji) {
            setTimeout(() => {
                setDianji(false)
            }, 180000);
            message.info('请勿重复点击，请三分钟后再试')
            return;
        }
        setDianji(true)
        if (studentList.uncommitted.length === 0) {
            message.info('学生已经全部提交')
            return false;
        }
        let userId = [];
        for (let obj of studentList.uncommitted) {
            userId.push(obj.userId)
        }
        props.dispatch({
            type: 'correction/remind',
            payload: {
                classId: props.state.classId,
                subjectId: props.state.subjectId,
                workDate: props.state.workDate,
                userId
            }
        })
    }


    return (
        <Sider className={style.left}>
            <div className={style.dataDisplay}>
                <div>已批：<span style={{ color: '#409EFF' }}>{props.checked.length}/{props.studentList.submitted.length}人</span></div>
            </div>
            <div className={style.submitBox} onClick={(e) => {
                props.changePresent(Number(e.target.getAttribute('data-state')))
            }}>
                <div data-state={1} className={props.present === 1 ? `${style.refer} ${style.pitchButt}` : style.refer}>已提交</div>
                <div data-state={0} className={props.present === 0 ? `${style.norefer} ${style.pitchButt}` : style.norefer}>未提交</div>
            </div>

            {props.present === 0 ? <>
                <div className={style.leftTop} id='uncommittedTop'>
                    <img src={require('../images/orangeSubmit.png')} />
                    <span className={style.text} >  未提交
                <span className={style.remind}
                            onClick={() => { keyRemind(props.studentList) }}>一键提醒</span>
                    </span>
                </div>
                <div style={{ overflow: 'auto', maxHeight: 'calc(100% - 150px)' }}>
                    {props.studentList.uncommitted.map((item, i) => (
                        item.commited === 0 && <div key={i} className={style.stu}> {item.name} </div>
                    ))}
                </div></> : <>
                    {props.uncheck.length > 0 ? <>
                        <div className={style.leftTop} >
                            <img src={require('../images/blueSubmit.png')} />
                            <span className={style.text}>  待批改学生（{props.uncheck.length}） </span>
                        </div>
                        <div style={{ overflow: 'auto', maxHeight: 'calc(100% - 150px)' }}>
                            {props.uncheck.map((item, i) => (
                                <div key={i} onClick={() => { props.clickStu(item, i); props.checkinwho(0) }}
                                    className={props.pitchStuId == item.userId ? `${style.stu} ${style.pitch} ${style.xuanzhong}` :
                                        `${item.corrected === 1 ? `${style.stu} ${style.pitch} ${style.already}` : `${style.stu} ${style.pitch}`}`} >
                                    <span style={{ float: 'left' }}>{item.name}</span>
                                    <span style={{ float: 'right' }}>错{item.wrongNum}题</span>
                                </div>
                            ))}
                            <div className={style.leftTop} >
                                <img src={require('../images/greenSubmit.png')} />
                                <span className={style.text}>已批改学生（{props.checked.length}）</span>
                            </div>
                            <div style={{ overflow: 'auto', maxHeight: 'calc(100% - 150px)' }}>
                                {props.checked.map((item, i) => (
                                    <div key={i} onClick={() => { props.clickStu(item, i); props.checkinwho(1) }}
                                        className={props.state.isCorrected === 0 && props.pitchStuId == item.userId ? `${style.stu} ${style.pitch} ${style.xuanzhong}` :
                                            `${style.stu} ${style.pitch} ${style.already}`} >
                                        <span style={{ float: 'left' }} >{item.name}</span>
                                        <span style={{ float: 'right' }}>错{item.wrongNum}题</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </> : <>
                            <div className={style.leftTop} >
                                <img src={require('../images/greenSubmit.png')} />
                                <span className={style.text}>已批改学生（{props.checked.length}）</span>
                            </div>
                            <div style={{ overflow: 'auto', maxHeight: 'calc(100% - 150px)' }}>

                                <div style={{ overflow: 'auto', maxHeight: 'calc(100% - 150px)' }}>
                                    {props.checked.map((item, i) => (
                                        <div key={i} onClick={() => { props.clickStu(item, i); props.checkinwho(1) }}
                                            className={props.state.isCorrected === 0 && props.pitchStuId == item.userId ? `${style.stu} ${style.pitch} ${style.xuanzhong}` :
                                                `${style.stu} ${style.pitch} ${style.already}`} >
                                            <span style={{ float: 'left' }} >{item.name}</span>
                                            <span style={{ float: 'right' }}>错{item.wrongNum}题</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>}
                </>}
        </Sider>
    );
}

export default connect((state) => ({
    state: {
        classId: state.temp.classId,
        isCorrected: state.correction.isCorrected,
        workDate: state.correction.workDate,
        subjectId: state.correction.subjectId,
    }
}))(SiderNavigation);