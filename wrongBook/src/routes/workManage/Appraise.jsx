import React, { useState, useEffect } from 'react';
import style from './workCorrection.less';
import { Input, message, Button, Modal, Switch } from 'antd';
const { TextArea } = Input;

export default function Appraise(props) {

    const [visible, setVisible] = useState(false);

    const [useful] = useState(['非常完美，你太棒了！', '进步很大，继续加油！', '字迹工整，作业认真！', '再细心些就更好了！', '最近有所松懈，希望继续努力！', '字迹有些潦草，希望下次注意！']);
    const [pitchOn, setPitchOn] = useState([]);
    const [number, setNumber] = useState(0);
    const [level, setLevel] = useState('');
    const [isExcellent, setIsExcellent] = useState(0);

    //是否点击修改
    const [amend, setAmend] = useState(true);


    useEffect(() => {
        if (props.wtbHomeworkCorrect) {
            let suzu = props.wtbHomeworkCorrect.common.split('！');
            suzu.length = suzu.length - 1;
            for (let i = 0; i < suzu.length; i++) {
                suzu[i] = `${suzu[i]}！`
            }
            setPitchOn(suzu)
            setLevel(props.wtbHomeworkCorrect.level)
            setIsExcellent(props.wtbHomeworkCorrect.isExcellent)
        }
        else {
            setPitchOn([])
            setLevel('')
            setIsExcellent(0)
        }
    }, [props.wtbHomeworkCorrect && props.wtbHomeworkCorrect.correctId]);
    useEffect(() => {
        if (props.wtbHomeworkCorrect) {
            setNumber(props.wtbHomeworkCorrect.content.length)
        }
    }, [amend]);

    function CloseEmpty() {
        setVisible(false)
        setNumber(0);
        setAmend(true);
        if (props.wtbHomeworkCorrect) {
            let suzu = props.wtbHomeworkCorrect.common.split('！');
            suzu.length = suzu.length - 1;
            for (let i = 0; i < suzu.length; i++) {
                suzu[i] = `${suzu[i]}！`
            }
            setPitchOn(suzu)
        } else {
            setPitchOn([])
            setLevel('')
            setIsExcellent(0)
        }
    }

    return (
        <>
            <div className={style.jobEvaluation} onClick={() => { setVisible(true) }}>
                作业 <br />  评价  </div>

            <Modal
                className={style.evaluatePopUp}
                title={<div style={{ textAlign: "center", paddingTop: 20 }}>{props.title}</div>}
                visible={visible}
                width={960}
                footer={false}
                destroyOnClose={true}
                onCancel={() => { CloseEmpty() }}>
                {props.wtbHomeworkCorrect && amend ?
                    <>
                        {pitchOn.map((item, i) => (
                            <span key={item} className={style.usefulBox}
                                style={{ background: '#409EFF' }}>{item}</span>
                        ))}
                        <div className={style.alterOfContent}>
                            {props.wtbHomeworkCorrect.content}
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <Button style={{ width: 75, height: 40, marginTop: 10, }} onClick={() => { CloseEmpty() }}>取消</Button>
                            <Button type="primary" style={{ width: 75, height: 40, margin: '10px 15px 0 15px' }}
                                onClick={() => { props.deleteCommit(); CloseEmpty(); }}>删除</Button>
                            <Button type="primary" style={{ width: 110, height: 40, marginTop: 10 }}
                                onClick={() => {
                                    setAmend(false);
                                    setLevel(props.wtbHomeworkCorrect.level)
                                    setIsExcellent(props.wtbHomeworkCorrect.isExcellent)
                                }}>修改评论</Button>
                        </div>
                    </> : <>
                        {useful.map((item, i) => (
                            <span key={item} className={style.usefulBox}
                                style={pitchOn.includes(item) ? { background: '#409EFF' } : {}}
                                onClick={() => {
                                    let cun = [...pitchOn]
                                    if (pitchOn.includes(item)) {
                                        cun.splice(cun.indexOf(item), 1)
                                    } else {
                                        cun.push(item)
                                    }
                                    setPitchOn(cun)
                                }}>{item} </span>
                        ))}

                        <TextArea id='evaluation' rows={4} placeholder={'请输入该学生今日作业评价'} maxLength={200} style={{ resize: 'none' }}
                            defaultValue={props.wtbHomeworkCorrect && props.wtbHomeworkCorrect.content}
                            onInput={(e) => { setNumber(e.currentTarget.value.length) }} />
                        <div className={style.words} style={number === 200 ? { color: '#EE6B52' } : {}}> 已输入{number}个字</div>
                        <p className={style.giveMark}>
                            等级评分：
                            <span className={style.yuanq} style={level === 'A' ? { marginLeft: 20, background: '#409EFF', color: '#FFFFFF' } : { marginLeft: 20 }} onClick={() => { setLevel('A') }}>A</span>
                            <span className={style.yuanq} style={level === 'B' ? { background: '#409EFF', color: '#FFFFFF' } : {}} onClick={() => { setLevel('B') }}>B</span>
                            <span className={style.yuanq} style={level === 'C' ? { background: '#409EFF', color: '#FFFFFF' } : {}} onClick={() => { setLevel('C') }}>C</span>
                            <span className={style.yuanq} style={level === 'D' ? { background: '#409EFF', color: '#FFFFFF' } : {}} onClick={() => { setLevel('D') }}>D</span>
                        </p>
                        <p style={{ marginBottom: 40 }}>
                            评为优秀作业：<Switch checked={isExcellent ? true : false} onChange={(checked) => { setIsExcellent(checked ? 1 : 0) }} />
                        </p>
                        <div style={{ textAlign: 'right' }}>
                            <Button type="primary" style={{ width: 110, height: 40, }}
                                onClick={() => {
                                    if (document.getElementById('evaluation').value.length === 0 && pitchOn.join('').length === 0) {
                                        message.info('评语为空')
                                        return false
                                    }
                                    if (amend) {
                                        props.workCommit(document.getElementById('evaluation').value, pitchOn.join(''), level, isExcellent)
                                    } else {
                                        props.updateCommit(document.getElementById('evaluation').value, pitchOn.join(''), level, isExcellent)
                                    }
                                    CloseEmpty()
                                }}>发布评价</Button>
                        </div>
                    </>
                }

            </Modal >
        </>
    )

}