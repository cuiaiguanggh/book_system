import React, { useState, useEffect } from 'react';
import style from './workCorrection.less';
import { Input, message, Button, InputNumber, Switch, Radio } from 'antd';

const { TextArea } = Input;

export default function CompleteCorrections(props) {
    const [level, setLevel] = useState('');
    const [isExcellent, setIsExcellent] = useState(0);
    const [score, setScore] = useState(100);

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
            setScore(100)
            setEvaluation('')
            setIsExcellent(0)
            setAppraise('')

        }

    }, [props.userId])

    function changeGrade(value) {
        let grade = Math.floor(value);

        setScore(grade)
        if (grade >= 90) {
            setLevel('A+')
        } else if (grade >= 80) {
            setLevel('A')
        } else if (grade >= 70) {
            setLevel('B')
        } else if (grade >= 60) {
            setLevel('C')
        } else if (grade >= 0) {
            setLevel('D')
        }

    }
    function changeLevel(value) {

        setLevel(value)
        if (value === 'A+') {
            setScore(90)
        } else if (value === 'A') {
            setScore(80)
        } else if (value === 'B') {
            setScore(70)
        } else if (value === 'C') {
            setScore(60)
        } else if (value === 'D') {
            setScore(59)
        }
    }
    return (
        <div className={style.correctBox} style={{ visibility: `${props.whether ? 'visible' : 'hidden'}` }}>
            <p className={style.giveMark} style={{ marginBottom: 20 }}>
                <span>等级：</span>
                <span className={style.yuan} style={level === 'A+' ? { marginLeft: 14, background: '#409EFF', color: '#FFFFFF' } : { marginLeft: 14 }} onClick={() => { changeLevel('A+') }}>A+</span>
                <span className={style.yuan} style={level === 'A' ? { background: '#409EFF', color: '#FFFFFF' } : {}} onClick={() => { changeLevel('A') }}>A</span>
                <span className={style.yuan} style={level === 'B' ? { background: '#409EFF', color: '#FFFFFF' } : {}} onClick={() => { changeLevel('B') }}>B</span>
                <span className={style.yuan} style={level === 'C' ? { background: '#409EFF', color: '#FFFFFF' } : {}} onClick={() => { changeLevel('C') }}>C</span>
                <span className={style.yuan} style={level === 'D' ? { background: '#409EFF', color: '#FFFFFF' } : {}} onClick={() => { changeLevel('D') }}>D</span>
            </p>
            <div style={{ marginBottom: 20 }}>
                分数：<InputNumber min={0} max={100} value={score} onChange={changeGrade} />
            </div>
            <p style={{ marginBottom: 20 }}>
                评为优秀作业：<Switch checked={isExcellent ? true : false} onChange={(checked) => { setIsExcellent(checked ? 1 : 0) }} />
            </p>
            <p style={{ marginBottom: 20 }}>
                作业评价：
                </p>
            <Radio.Group onChange={(e) => { setEvaluation(e.target.value) }} value={evaluation}>
                <Radio value={'非常完美，你太棒了！'}>非常完美，你太棒了！</Radio>
                <Radio value={'进步很大，继续加油！'}>进步很大，继续加油！ </Radio>
                <Radio value={'字迹工整，作业认真！'}>字迹工整，作业认真！</Radio>
                <Radio value={'再细心些就更好了！'}>再细心些就更好了！</Radio>
                <Radio value={'最近有所松懈，继续努力！'}>最近有所松懈，继续努力！</Radio>
                <Radio value={'字迹有些潦草，下次注意！'}>字迹有些潦草，下次注意！</Radio>
            </Radio.Group>
            <div style={{ position: 'relative' }}>
                <TextArea style={{ width: 220, minHeight: 90, margin: '5px 0 0 10px' }}
                    onChange={e => { setAppraise(e.target.value) }}
                    value={appraise}
                    placeholder={'请输入该份作业评价'}
                    maxLength={200} />
                {appraise.length === 200 && <div className={style.words} style={appraise.length === 200 ? { color: '#EE6B52' } : {}}>
                    已输入{appraise.length}个字</div>}
            </div>
            <Button type="primary" className={style.wcanniu} onClick={() => {
                props.wancheng(appraise, evaluation, level, score, isExcellent);
            }}>完成批改</Button>
        </div>

    )

}