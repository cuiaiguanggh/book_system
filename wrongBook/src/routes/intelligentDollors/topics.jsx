import { useState, useEffect } from 'react';
import { Spring, } from 'react-spring/renderprops'
import style from './intelligentDollors.less';
import { Icon, Popconfirm } from 'antd';


export default function Topics(prop) {
    const [rotate, setRotate] = useState(0);
    const [opacity, setOpacity] = useState(0);
    const [height, setHeight] = useState(0);
    //要替换的题目
    const [replace, setReplace] = useState([]);
    //替换后题目，记录题目的id。
    const [nowId, setNowId] = useState([]);

    if (prop.topic.hide) {
        return (<></>)
    }


    return (
        <div className={style.bigBox} style={prop.pitchOn == prop.topic.questionId ? { borderColor: '#409EFF' } : {}}
            onClick={() => { prop.selecttopic(prop.topic.questionId) }}>
            <div className={style.title}>
                <span style={{ margin: ' 0 30px ' }}> {prop.type}</span>知识点：{prop.topic.knowledgeName}
                {prop.pitchOn == prop.topic.questionId &&
                    <>
                        <div className={`${style.anniu} ${style.topicButton}`} style={{ marginRight: 15 }}
                            onClick={(e) => {
                                if (replace.length === 0 || !nowId.includes(prop.topic.questionId)) {
                                    prop.change({
                                        knowledgeId: prop.topic.knowledgeId,
                                        questionId: prop.topic.questionId,
                                    }, (data) => {
                                        data.push(prop.topic)
                                        setReplace(data)
                                        prop.changeList(data)
                                        //当前试卷题目的id
                                        let suzu = []
                                        for (let obj of data) {
                                            suzu.push(obj.questionId)
                                        }
                                        setNowId(suzu)
                                    })
                                } else {
                                    prop.changeList(replace)
                                }

                                e.stopPropagation();
                            }}
                        > 换一题</div>
                        <Popconfirm
                            title={`删除后，本试卷共为${prop.length - 1}题`}
                            onConfirm={(e) => {
                                prop.delete(prop.topic.questionId)
                                e.stopPropagation();
                            }}
                            onCancel={(e) => {
                                e.stopPropagation();
                            }}
                            okText="确定"
                            cancelText="取消" >
                            <div className={`${style.anniu} ${style.topicButton}`} style={{ marginRight: 10 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}>删除</div>
                        </Popconfirm>
                    </>
                }

            </div>
            <div dangerouslySetInnerHTML={{ __html: prop.topic.title }} style={{ padding: '30px 90px 20px 30px', overflow: 'hidden' }} />
            <Spring to={{ opacity: opacity, height: height, padding: '0 90px 0 30px', overflow: 'hidden' }}>
                {props =>
                    <div style={props}>
                        答案：{prop.answer ? <div dangerouslySetInnerHTML={{ __html: prop.answer }} /> : '略'}
                        <br />
                        解析：{prop.topic.parse ? <div dangerouslySetInnerHTML={{ __html: prop.topic.parse }} /> : '略'}
                    </div>
                }
            </Spring>

            <div className={style.lookButton} onClick={(e) => {
                setRotate(rotate === 180 ? 0 : 180)
                setOpacity(opacity === 0 ? 1 : 0)
                setHeight(height === 0 ? 'auto' : 0)
                e.stopPropagation();
            }}>
                查看解析
          <Spring to={{ rotate: rotate }}>
                    {props => <Icon type="down" style={{ transform: `rotate(${props.rotate}deg)`, color: '#B6BDCF', marginLeft: 5 }} />}
                </Spring>
            </div>
        </div >
    )
}