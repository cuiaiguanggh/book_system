import React, { useState, useEffect } from 'react';
import { Icon, Select, Button, Checkbox, Input } from "antd";

import style from './fineQuestion.less';
const { Option } = Select;


export default function QuestionHeader(props) {
    const [checkAll, setCheckAll] = useState(true);
    const [indeterminate, setIndeterminate] = useState(false);

    const [selectTypes, setSelectTypes] = useState(0);
    const [selectDifficulty, setSelectDifficulty] = useState('全部');
    const [year, setYear] = useState('全部');
    const [region, setRegion] = useState('全部');
 

    useEffect(() => {

    });


    //年级全选
    function onCheckAllChange(e) {
        console.log(props.grade)
        if (!e.target.checked || e.target.checked && props.checkedGrade.toString() === props.grade.toString()) {
            return
        }
        props.setCheckedGrade(props.grade)
        setCheckAll(e.target.checked)
        setIndeterminate(false)


        if (props.gradePeriod === 1) {
            props.parameter.gradeId = [1, 2, 3, 4, 5, 6]
        } else if (props.gradePeriod === 2) {
            props.parameter.gradeId = [7, 8, 9]
        } else if (props.gradePeriod === 3) {
            props.parameter.gradeId = [10, 11, 12]
        }
        props.getTopics()
    };

    //选择年级
    function changeGrade(checkedValues) {
        if (checkedValues.length === 0) {
            return
        }
        props.setCheckedGrade(checkedValues)
        setCheckAll(checkedValues.length === props.grade.length)
        setIndeterminate(!!checkedValues.length && checkedValues.length < props.grade.length)

        let gradeId = []
        if (props.gradePeriod === 1) {
            for (let str of checkedValues) {
                gradeId.push(props.grade.indexOf(str) + 1)
            }
        } else if (props.gradePeriod === 2) {
            for (let str of checkedValues) {
                gradeId.push(props.grade.indexOf(str) + 7)
            }
        } else if (props.gradePeriod === 3) {
            for (let str of checkedValues) {
                gradeId.push(props.grade.indexOf(str) + 10)
            }
        }
        props.parameter.gradeId = gradeId
        props.getTopics()

    }
    //题型和难度的方法
    function onSelect(who, e) {
        let value = e.target.getAttribute('data-value');
        if (who === 1) {
            //题型
            setSelectTypes(value);
            if (value == 0) {
                delete props.parameter.questionType
            } else {
                props.parameter.questionType = value;
            }
        } else {
            //难度
            setSelectDifficulty(value)
            if (value == 0) {
                delete props.parameter.diff
            } else {
                props.parameter.diff = value;
            }
        }
        props.getTopics();
    }

    //选择年份
    function changeYear(value) {
        setYear(value)

        props.parameter.year = value;
        props.getTopics();

    }

    //选择地区
    function changeRegion(value) {
        console.log(value)
        setRegion(value)
    }
    return (
        <div className={style.header}>
            <div style={{ marginBottom: 17 }}>
                <span className={style.text}>年级</span>
                <Checkbox
                    indeterminate={indeterminate}
                    onChange={onCheckAllChange}
                    checked={checkAll} >
                    全部
                </Checkbox>
                <Checkbox.Group options={props.grade} value={props.checkedGrade} onChange={changeGrade} />
            </div>

            <div style={{ marginBottom: 17 }} onClick={e => onSelect(1, e)}>
                <span className={style.text}>题型</span>
                {['全部', '填空题', '判断题', '主观题', '单选题', '多选题'].map((item, i) => (
                    <span key={i} className={`${style.noselect} ${Number(selectTypes) === i && style.select}`} data-value={i}>{item}</span>
                ))}

            </div>

            <div style={{ marginBottom: 17 }} onClick={e => onSelect(2, e)}>
                <span className={style.text}>难度</span>
                {['全部', '容易', '较易', '中等', '较难', '困难'].map((item, i) => (
                    <span key={i} className={`${style.noselect} ${selectDifficulty === item && style.select}`} data-value={item}>{item}</span>
                ))}
            </div>

            <div style={{ marginBottom: 17 }}>
                <span className={style.text}>更多</span>
                <span style={{ padding: 5 }}>  年份：</span>
                <Select
                    showSearch
                    className={style.selectBox}
                    placeholder="请选择年份"
                    optionFilterProp="children"
                    onChange={changeYear}
                    value={year}
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    <Option value="2020">2020</Option>
                    <Option value="2019">2019</Option>
                    <Option value="2018">2018</Option>
                </Select>

                <span style={{ padding: 5 }}>  地区：</span>
                <Select
                    showSearch
                    className={style.selectBox}
                    placeholder="请选择地区"
                    optionFilterProp="children"
                    onChange={changeRegion}
                    value={region}
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    } >

                </Select>
            </div>
        </div>
    );
}