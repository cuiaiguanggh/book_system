import React, { useState, useEffect } from 'react';
import style from './fineQuestion.less';
import { Icon, Select, Button, Tree, Input } from "antd";
const { Search } = Input;
const { TreeNode } = Tree;


export default function QuestionMenu(props) {

    const [unfolds, setUnfolds] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(false);

    const [pitchSubject, setPitchSubject] = useState('高中物理');

    const [antistop, setAntistop] = useState(false);

    //获取需要展开的节点
    function getKey(data, cun, value, expandedKeys) {
        data.map((item, i) => {
            cun = cun + ',' + item.knowledgeId;
            if (item.knowledgeName.indexOf(value) > -1) {
                expandedKeys.push(...cun.split(','))
            }
            if (item.hasOwnProperty('children')) {
                getKey(item.children, cun, value, expandedKeys);
            }
        })
    }
    //输入框关键词搜索
    function onChange(e) {
        const { value } = e.target;
        const expandedKeys = [];
        if (value === '') {
            setAntistop(false)
            return
        }
        props.treeStructure.map(item => {
            let cun = item.knowledgeId;
            getKey(item.children, cun, value, expandedKeys);
        })

        setAntistop(value)
        setAutoExpandParent(true)
        setUnfolds([...new Set(expandedKeys)])
    };
    //生成树节点
    function recursion(data) {
        return <>  {data &&
            data.map((item, i) => (
                item.hasOwnProperty('children') ?
                    <TreeNode title={<span style={props.nowKnowledgeId == item.knowledgeId ? { color: '#409EFF' } :
                        { color: `${item.knowledgeName.includes(antistop) ? 'rgb(255, 85, 0)' : ''}` }}>
                        {item.knowledgeName}</span>} key={item.knowledgeId} icon={<><Icon type="plus-circle" /><Icon type="minus-circle" /></>} >
                        <> {recursion(item.children)}</>
                    </TreeNode> :
                    <TreeNode key={item.knowledgeId} title={<span style={props.nowKnowledgeId == item.knowledgeId ? { color: '#409EFF' } :
                        { color: `${item.knowledgeName.includes(antistop) ? 'rgb(255, 85, 0)' : ''}` }} >
                        {item.knowledgeName}
                    </span>} />
            ))
        }
        </>
    }


    return (
        <>
            <div className={style.top}>
                <Icon type="menu" style={{ paddingRight: 7, fontSize: 11 }} />{pitchSubject}

                <div className={style.subjectBox} onClick={(e) => {
                    let subjectId = 0;
                    let value = e.target.getAttribute('data-value');

                    if (value) {
                        switch (value.slice(2, 4)) {
                            case '语文':
                                subjectId = 1
                                break;
                            case '数学':
                                subjectId = 2
                                break;
                            case '英语':
                                subjectId = 3
                                break;
                            case '历史':
                                subjectId = 4
                                break;
                            case '地理':
                                subjectId = 5
                                break;
                            case '政治':
                                subjectId = 6
                                break;
                            case '生物':
                                subjectId = 7
                                break;
                            case '物理':
                                subjectId = 8
                                break;
                            case '化学':
                                subjectId = 9
                                break;
                            case '科学':
                                subjectId = 10
                                break;
                        }

                        setPitchSubject(value)
                        if (value.includes('小学')) {
                            props.updataGrade(['小一', '小二', '小三', '小四', '小五', '小六'], 1, subjectId)
                        } else if (value.includes('初中')) {
                            props.updataGrade(['初一', '初二', '初三'], 2, subjectId)
                        } else if (value.includes('高中')) {
                            props.updataGrade(['高一', '高二', '高三'], 3, subjectId)
                        }
                    }

                }}>
                    <div>
                        <p><span className={style.yuandian}></span>高中</p>
                        <ul>
                            {['语文', '数学', '英语', '物理', '化学', '历史', '地理', '政治', '生物'].map((item, i) => (
                                <li key={i} data-value={`高中${item}`} style={pitchSubject === `高中${item}` ? { background: '#409EFF', color: '#fff' } : {}}>{item}</li>
                            ))}

                        </ul>
                    </div>
                    <div>
                        <p><span className={style.yuandian}></span>初中</p>
                        <ul>
                            {['语文', '数学', '英语', '物理', '化学', '历史', '地理', '政治', '生物'].map((item, i) => (
                                <li key={i} data-value={`初中${item}`} style={pitchSubject === `初中${item}` ? { background: '#409EFF', color: '#fff' } : {}}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p><span className={style.yuandian}></span>小学</p>
                        <ul>
                            {['语文', '数学', '英语'].map((item, i) => (
                                <li key={i} data-value={`小学${item}`} style={pitchSubject === `小学${item}` ? { background: '#409EFF', color: '#fff' } : {}}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <Search className={style.keyword} placeholder="输入知识点关键字" onChange={onChange} />
            <div style={{ position: 'relative', left: '-20px', width: 270, overflow: 'scroll', height: 'calc( 100% - 115px)' }}  >
                <Tree
                    switcherIcon={<></>}
                    showIcon={true}
                    expandedKeys={unfolds}
                    autoExpandParent={autoExpandParent}
                    onSelect={(selectedKeys, e) => {
                        let key = e.node.props.eventKey;

                        if (props.nowKnowledgeId !== key) {
                            props.getTopics(key)
                        }
                        props.upadtaKnowledgeId(key)

                        if (unfolds.length === 0) {
                            setUnfolds(selectedKeys)
                            return;
                        }

                        if (e.node.props.hasOwnProperty('children') && !unfolds.includes(key)) {
                            //展开
                            unfolds.push(key)
                        } else if (unfolds.includes(key)) {
                            // 收缩
                            let index = unfolds.indexOf(key)
                            unfolds.splice(index, 1)
                        }

                        setUnfolds(unfolds)
                        setAutoExpandParent(false)

                    }}>
                    {recursion(props.treeStructure)}
                </Tree>
            </div>
        </>
    )
}