import React, { useState, useEffect } from 'react';
import { Layout, Icon, Select, Button, Checkbox } from "antd";
import style from './fineQuestion.less';


export default function QuestionTopic(props) {
    const [count, setCount] = useState(0);

    useEffect(() => {

    });




    return (
        <>
            {props.topics.map((item, i) => (
                <div className={style.topic} key={item.questionId}>
                    <div className={style.one}>

                        {item.title && <><div dangerouslySetInnerHTML={{ __html: item.title }}></div> <br /></>}
                        {item.answer && <>答案：<div dangerouslySetInnerHTML={{ __html: item.answer }}></div> <br /></>}
                        {item.parse && <>解析：<div dangerouslySetInnerHTML={{ __html: item.parse }}></div> <br /></>}
                        {item.summary && <>总结：<div dangerouslySetInnerHTML={{ __html: item.summary }}></div><br /></>}
                        {item.comment && <>意见<div dangerouslySetInnerHTML={{ __html: item.comment }}></div><br /></>}


                    </div>
                    <div className={style.bottom}>
                        <span className={style.delect}> <Icon type="minus-circle" /> 删除</span>

                        {item.isGood === 1 ?
                            <div className={style.joinQuestion} style={{ background: '#C6CFDA' }} onClick={() => { props.joinRemove(item.questionId, 0, i); }}> ➖ 移出题库  </div> :
                            <div className={style.joinQuestion} onClick={() => { props.joinRemove(item.questionId, 1, i); }}> ➕ 加入题库  </div>
                        }

                    </div>
                </div>
            ))
            }
        </>
    );
}