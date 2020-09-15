import React, { useState, useEffect } from 'react';
import style from './workCorrection.less';
import { Input, message, Button, InputNumber, Switch, Radio } from 'antd';

const { TextArea } = Input;



function Corrections(props) {



    return (
        <>
            <div style={{ marginBottom: 15 }}>  等级：<span style={{ color: '#409EFF', fontSize: 18 }}>{props.level}</span> </div>

            <div style={{ marginBottom: 15 }}>   分数：<span style={{ color: '#409EFF', fontSize: 18 }}>{props.score && `${props.score}分`}</span>  </div>
            <div style={{ marginBottom: 15 }}>
                评为优秀作业：<Switch checked={props.isExcellent ? true : false} />
            </div>
            <div style={{ marginBottom: 15 }}>
                作业评价：
                <div style={{ color: '#409EFF', overflow: 'hidden', marginTop: 10 }}>
                    {props.evaluation}
                    {props.appraise}
                </div>
            </div>
            <Button type="primary" className={style.wcanniu} style={{ width: 72 }} onClick={props.change}>修改</Button>
        </>
    )
}



export default function CompleteCorrections(props) {
    const [level, setLevel] = useState('');
    const [isExcellent, setIsExcellent] = useState(0);
    const [score, setScore] = useState(null);

    const [evaluation, setEvaluation] = useState('');
    const [appraise, setAppraise] = useState('');



    useEffect(() => {
        console.log('更新数据')
        console.log(props.wtbHomeworkCorrect)
        if (props.wtbHomeworkCorrect) {
            setLevel(props.wtbHomeworkCorrect.level)
            setScore(props.wtbHomeworkCorrect.score)
            setEvaluation(props.wtbHomeworkCorrect.common)
            setIsExcellent(props.wtbHomeworkCorrect.isExcellent)
            setAppraise(props.wtbHomeworkCorrect.content)
        } else {
            setLevel('')
            setScore(null)
            setEvaluation('')
            setIsExcellent(0)
            setAppraise('')
        }
    }, [props.userId, props.wtbHomeworkCorrect && props.wtbHomeworkCorrect.correctId])



    function changeGrade(value) {
        if (value) {
            let grade = Math.floor(value);
            setScore(grade)
        } else {
            setScore(null)
        }
    }
    function changeLevel(value) {
        if (level === value) {
            setLevel('')
        } else {
            setLevel(value)
        }
    }

    return (
        <div className={style.correctBox} style={{ visibility: `${props.whether ? 'visible' : 'hidden'}` }}>

            {props.isAmend ?
                <Corrections change={props.change} level={level} score={score} evaluation={evaluation} appraise={appraise} isExcellent={isExcellent} /> :
                <>
                    <p className={style.giveMark} style={{ marginBottom: 15 }}>
                        <span className={style.yuan} style={level === 'A+' ? { marginLeft: 0, background: '#409EFF', color: '#FFFFFF' } : { marginLeft: 0 }} onClick={() => { changeLevel('A+') }}>A+</span>
                        <span className={style.yuan} style={level === 'A' ? { background: '#409EFF', color: '#FFFFFF' } : {}} onClick={() => { changeLevel('A') }}>A</span>
                        <span className={style.yuan} style={level === 'B' ? { background: '#409EFF', color: '#FFFFFF' } : {}} onClick={() => { changeLevel('B') }}>B</span>
                        <span className={style.yuan} style={level === 'C' ? { background: '#409EFF', color: '#FFFFFF' } : {}} onClick={() => { changeLevel('C') }}>C</span>
                        <span className={style.yuan} style={level === 'D' ? { background: '#409EFF', color: '#FFFFFF' } : {}} onClick={() => { changeLevel('D') }}>D</span>
                    </p>
                    <div style={{ marginBottom: 15 }}>
                        分数：<InputNumber min={0} max={100} value={score} onChange={changeGrade} />
                    </div>
                    <p style={{ marginBottom: 15 }}>
                        评为优秀作业：<Switch checked={isExcellent ? true : false} onChange={(checked) => { setIsExcellent(checked ? 1 : 0) }} />
                    </p>
                    <p style={{ marginBottom: 15 }}>
                        作业评价：
                </p>
                    <Radio.Group onChange={(e) => { setEvaluation(e.target.value) }} value={evaluation}>
                        <Radio value={'非常完美，你太棒了！'} onClick={() => { evaluation === '非常完美，你太棒了！' && setEvaluation('') }}>非常完美，你太棒了！</Radio>
                        <Radio value={'进步很大，继续加油！'} onClick={() => { evaluation === '进步很大，继续加油！' && setEvaluation('') }}>进步很大，继续加油！ </Radio>
                        <Radio value={'字迹工整，作业认真！'} onClick={() => { evaluation === '字迹工整，作业认真！' && setEvaluation('') }}>字迹工整，作业认真！</Radio>
                        <Radio value={'再细心些就更好了！'} onClick={() => { evaluation === '再细心些就更好了！' && setEvaluation('') }}>再细心些就更好了！</Radio>
                        <Radio value={'最近有所松懈，继续努力！'} onClick={() => { evaluation === '最近有所松懈，继续努力！' && setEvaluation('') }}>最近有所松懈，继续努力！</Radio>
                        <Radio value={'字迹有些潦草，下次注意！'} onClick={() => { evaluation === '字迹有些潦草，下次注意！' && setEvaluation('') }}>字迹有些潦草，下次注意！</Radio>
                    </Radio.Group>
                    <div style={{ position: 'relative', marginBottom: 15 }}>
                        <TextArea style={{ width: 180, minHeight: 90, }}
                            onChange={e => { setAppraise(e.target.value) }}
                            value={appraise}
                            placeholder={'请输入该份作业评价'}
                            maxLength={200} />
                        {appraise.length === 200 && <div className={style.words} style={appraise.length === 200 ? { color: '#EE6B52' } : {}}>
                            已输入{appraise.length}个字</div>}
                    </div>
                    <Button type="primary" className={style.wcanniu} loading={props.loading}onClick={() => {
                        props.wancheng(appraise, evaluation, level, score, isExcellent);
                    }}>完成批改</Button>
                </>}
        </div>
    )
}