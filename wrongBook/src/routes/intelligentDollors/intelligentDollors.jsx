import React from 'react';
import {
    Layout, Icon, DatePicker, Empty, Modal
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import style from './intelligentDollors.less';
import observer from '../../utils/observer'
import Topics from './topics'
import commonCss from '../css/commonCss.css';
import store from 'store';

const {
    Header, Footer, Sider, Content,
} = Layout;
const { RangePicker } = DatePicker;


class intelligentDollors extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectTime: [moment(`${moment().subtract(7, 'days').calendar(null, {
                sameDay: 'YYYY/MM/DD',
                nextDay: 'YYYY/MM/DD',
                nextWeek: 'YYYY/MM/DD',
                lastDay: 'YYYY/MM/DD',
                lastWeek: 'YYYY/MM/DD',
                sameElse: 'YYYY/MM/DD'
            })}`, "YYYY-MM-DD"), moment(`${moment().format('YYYY/MM/DD')}`, "YYYY-MM-DD")],
            mouNow: -1,
            dollorsKnowledge: [],
            topicList: [],
            pattern: [],
            pitchOn: '',
            showPdfModal: false,
            pdfUrl: {},
            loading: 0,
            //鼠标次数选中的知识点题数
            nowNume: ''
        }
        //更新题目中的题型和题型数量和知识点数量的方法
        this.getType = (data) => {
            let map = new Map();
            let knowledge = new Map();

            for (let object of data) {
                // 单选题、多选题、填空题、判断题,其他
                if (!map.has(object.typeName) && !object.hide) {
                    map.set(object.typeName, 1)
                } else if (map.size !== 0 && !object.hide) {
                    map.set(object.typeName, map.get(object.typeName) + 1)
                }
                //获取对应知识点的数量
                if (!knowledge.has(object.knowledgeName)) {
                    if (object.hide) {
                        knowledge.set(object.knowledgeName, 0)
                    } else {
                        knowledge.set(object.knowledgeName, 1)
                    }
                } else if (knowledge.size !== 0 && !object.hide) {
                    knowledge.set(object.knowledgeName, knowledge.get(object.knowledgeName) + 1)
                }
            }

            //反应到知识点上
            [...knowledge].forEach((value) => {
                for (let obj of this.state.dollorsKnowledge) {
                    if (obj.knowledgeName === value[0]) {
                        obj.nowNum = value[1]
                        break;
                    }
                }
            })
            this.setState({
                pattern: [...map],
                dollorsKnowledge: this.state.dollorsKnowledge
            })
        }

        //获取题目列表方法
        this.getTitles = (data) => {
            if (!data.subjectId) {
                return
            }
            this.props.dispatch({
                type: 'temp/combinedPaper',
                payload: data
            }).then(list => {
                this.setState({
                    topicList: list
                })
                this.getType(list)
            })
        }
        //获取知识点方法
        this.getKnowledge = (data) => {
            this.props.dispatch({
                type: 'temp/dollorsKnowledge',
                payload: data
            }).then(data => {
                if (data) {
                    this.setState({
                        dollorsKnowledge: data
                    })
                } else {
                    this.setState({
                        dollorsKnowledge: []
                    })
                }
            })
        }
        //重置
        observer.addSubscribe('dollorsReset', () => {
            this.setState({
                selectTime: [moment(`${moment().subtract(7, 'days').calendar(null, {
                    sameDay: 'YYYY/MM/DD',
                    nextDay: 'YYYY/MM/DD',
                    nextWeek: 'YYYY/MM/DD',
                    lastDay: 'YYYY/MM/DD',
                    lastWeek: 'YYYY/MM/DD',
                    sameElse: 'YYYY/MM/DD'
                })}`, "YYYY-MM-DD"), moment(`${moment().format('YYYY/MM/DD')}`, "YYYY-MM-DD")],
                mouNow: -1,
                dollorsKnowledge: [],
                topicList: [],
                pattern: [],
            })
        })
        //切换学科时
        observer.addSubscribe('dollorsChange', (subId) => {
            this.setState({
                selectTime: [moment(`${moment().subtract(7, 'days').calendar(null, {
                    sameDay: 'YYYY/MM/DD',
                    nextDay: 'YYYY/MM/DD',
                    nextWeek: 'YYYY/MM/DD',
                    lastDay: 'YYYY/MM/DD',
                    lastWeek: 'YYYY/MM/DD',
                    sameElse: 'YYYY/MM/DD'
                })}`, "YYYY-MM-DD"), moment(`${moment().format('YYYY/MM/DD')}`, "YYYY-MM-DD")],
                mouNow: -1,
            })

            //获取知识点
            this.getKnowledge({
                year: this.props.state.years,
                classId: this.props.state.classId,
                subjectId: subId,
                type: 0,
                endTime: moment().format('YYYY-MM-DD'),
                startTime: moment().subtract(7, 'days').calendar(null, {
                    sameDay: 'YYYY-MM-DD',
                    nextDay: 'YYYY-MM-DD',
                    nextWeek: 'YYYY-MM-DD',
                    lastDay: 'YYYY-MM-DD',
                    lastWeek: 'YYYY-MM-DD',
                    sameElse: 'YYYY-MM-DD'
                }),
            })

            //题目列表
            this.getTitles({
                classId: this.props.state.classId,
                subjectId: subId,
            })

        })

    }
    //点击时间全部事件
    alltime() {
        this.setState({
            mouNow: 0,
            selectTime: [],
        })

        //获取知识点
        this.getKnowledge({
            year: this.props.state.years,
            classId: this.props.state.classId,
            subjectId: this.props.state.subId,
            type: 0,
        })

        //题目列表
        this.getTitles({
            classId: this.props.state.classId,
            subjectId: this.props.state.subId,
            year: this.props.state.years,
        })
    }
    //点击不同月份的事件
    monthtime(item) {
        this.setState({
            mouNow: item.k,
            selectTime: [],
        })

        //获取知识点
        this.getKnowledge({
            year: this.props.state.years,
            classId: this.props.state.classId,
            subjectId: this.props.state.subId,
            type: 0,
            month: item.v
        })
        //题目列表
        this.getTitles({
            classId: this.props.state.classId,
            subjectId: this.props.state.subId,
            month: item.v
        })
    }
    //时间框
    quantumtime(date, dateString) {
        this.setState({
            mouNow: -1,
            selectTime: date,
        })
        //获取知识点
        this.getKnowledge({
            year: this.props.state.years,
            classId: this.props.state.classId,
            subjectId: this.props.state.subId,
            type: 0,
            startTime: dateString[0],
            endTime: dateString[1]
        })
        //题目列表
        this.getTitles({
            classId: this.props.state.classId,
            subjectId: this.props.state.subId,
            start: dateString[0],
            end: dateString[1],
        })

    }
    //一键组卷
    oneDonw() {
        this.setState({
            loading: 1
        })
        let questionIds = [];
        this.state.topicList.forEach((obj) => {
            if (!obj.hide) {
                questionIds.push(obj.questionId)
            }
        })
        this.props.dispatch({
            type: 'down/makeIntelligentTestPdf',
            payload: {
                classId: this.props.state.classId,
                subjectId: this.props.state.subId,
                questionIds: questionIds.join(','),
                isAnswer: 1,
            }
        }).then((res) => {
            if (res) {
                this.setState({
                    pdfUrl: res,
                    showPdfModal: true,
                    loading: 0
                })
            } else {
                this.setState({
                    pdfUrl: {},
                    loading: 0
                })
            }
        })

    }


    render() {
        let mounthList = this.props.state.mounthList;
        let length = this.state.topicList.length;
        for (let obj of this.state.topicList) {
            if (obj.hide) {
                length--;
            }
        }

        return (
            <>
                <Header className={style.layoutHead}>
                    <span style={{
                        fontSize: 14,
                        fontFamily: 'MicrosoftYaHei-Bold',
                        fontWeight: 'bold',
                        color: 'rgba(96,98,102,1)',
                    }}>时间：</span>
                    <span key={0} className={0 == this.state.mouNow ? 'choseMonthOn' : 'choseMonth'}
                        style={{ marginLeft: 24 }} onClick={this.alltime.bind(this)}>全部</span>
                    {
                        mounthList.data && mounthList.data.length > 0 ?
                            mounthList.data.map((item, i) => {
                                return (
                                    <span key={i} className={item.k == this.state.mouNow ? 'choseMonthOn' : 'choseMonth'}
                                        onClick={this.monthtime.bind(this, item)}>{item.k}</span>
                                )
                            }) : ''
                    }
                    <RangePicker
                        style={{ width: 220 }}
                        format="YYYY-MM-DD"
                        placeholder={['开始时间', '结束时间']}
                        value={this.state.selectTime}
                        disabledDate={current => current && current > moment().endOf('day') || current < moment().subtract(2, 'year')}
                        onChange={
                            this.quantumtime.bind(this)
                        } />
                </Header>
                <Layout className={style.dollors}>

                    <Sider className={style.left}>
                        <div className={style.leftTop}>
                            <div className={style.title}> 试卷（{length}题） </div>
                            <div style={{ padding: '5px 5px 15px 5px' }}>
                                {this.state.pattern.map((item, i) => (
                                    <span key={i} className={style.label}>{item[0]}<span>{item[1]}题</span></span>
                                ))}

                            </div>
                        </div>

                        <div className={style.leftBottom} style={{ maxHeight: 'calc(100% - 140px)' }}>
                            <div className={style.title}> 本周班级薄弱知识点 </div>
                            <div className={style.knowledgeBox}>
                                {this.state.dollorsKnowledge.map((item, i) => (
                                    <p key={i} style={{ margin: 0, fontSize: 12 }}
                                        onMouseOver={e => {
                                            this.setState({
                                                nowNume: i
                                            })
                                        }}
                                        onMouseLeave={(e) => {
                                            this.setState({
                                                nowNume: ''
                                            })
                                        }}>
                                        <span className={style.label} title={item.knowledgeName}> {item.knowledgeName}</span>
                                        <span style={{ float: 'right' }}>
                                            <span className={style.changeNum} style={this.state.nowNume === i ? { background: 'rgba(236, 245, 255, 1)', minWidth: 45 } : { textAlign: 'left' }}>
                                                {item.nowNum || 0}{this.state.nowNume === i ?
                                                    <span style={{ flexDirection: 'column', display: 'inline-flex', float: 'right', color: '#505050' }}>
                                                        <span className={style.numberUp} data-klist={[]} onClick={(e) => {
                                                            let nowNum = item.nowNum + 1 || 1;
                                                            if (nowNum <= 10 && length < 30) {
                                                                let cun = this.state.topicList;
                                                                if (item.hasOwnProperty('cunList') && item.nowNum < 10) {
                                                                    if (nowNum <= item.cunList.length) {
                                                                        cun.push({ ...item.cunList[nowNum - 1] })
                                                                        this.setState({
                                                                            topicList: cun
                                                                        })
                                                                        this.getType(cun)
                                                                    }

                                                                } else {
                                                                    this.props.dispatch({
                                                                        type: 'down/knowledgeQue',
                                                                        payload: { knowledgeId: item.knowledgeId }
                                                                    }).then(res => {
                                                                        item.cunList = res;
                                                                        cun.push({ ...res[nowNum - 1] })
                                                                        this.setState({
                                                                            topicList: cun
                                                                        })
                                                                        this.getType(cun)

                                                                    })
                                                                }
                                                            }

                                                        }}>  <Icon type="caret-up" />  </span>
                                                        <span className={style.numberDown} onClick={() => {
                                                            //删除题目
                                                            if (item.nowNum > 0) {
                                                                list: for (let obj of this.state.topicList) {
                                                                    if (obj.knowledgeName === item.knowledgeName && !obj.hide) {
                                                                        obj.hide = true;
                                                                        this.getType(this.state.topicList)
                                                                        this.setState({
                                                                            topicList: this.state.topicList
                                                                        })
                                                                        break list;
                                                                    }
                                                                }
                                                            }
                                                        }}>  <Icon type="caret-down" /> </span>
                                                    </span> : <>题</>}
                                            </span>
                                        </span>
                                    </p>
                                ))}
                            </div>
                        </div>
                    </Sider>
                    <Content className={style.content} id='dollors' onScroll={(e) => {
                        if (e.currentTarget.scrollTop < 500) {
                            document.getElementById('back').style.opacity = 0.3 * e.currentTarget.scrollTop / 500
                        } else {
                            document.getElementById('back').style.opacity = 0.3
                        }
                    }}>
                        {length > 0 ?
                            this.state.topicList.map((item, i) => (
                                <Topics
                                    key={i}
                                    topic={item}
                                    delete={(id) => {
                                        for (let i = 0; i < this.state.topicList.length; i++) {
                                            if (this.state.topicList[i].questionId === id) {
                                                this.state.topicList[i].hide = true;
                                                this.setState({
                                                    topicList: this.state.topicList
                                                })
                                                break;
                                            }
                                        }
                                        //左边列表试卷题型更新
                                        this.getType(this.state.topicList)
                                    }}
                                    length={length}
                                    change={(data, tihuan) => {
                                        //调用接口，获取要替换的题目
                                        this.props.dispatch({
                                            type: 'temp/changeQue',
                                            payload: data
                                        }).then((data) => {
                                            tihuan(data)
                                        })
                                    }}
                                    changeList={(topicLists) => {
                                        //替换题目
                                        let index
                                        for (let j = 0; j < topicLists.length; j++) {
                                            if (topicLists[j].questionId === item.questionId) {
                                                index = j === topicLists.length - 1 ? 0 : j + 1;
                                                this.state.topicList.splice(i, 1, topicLists[index])
                                                break;
                                            }
                                        }
                                        this.setState({
                                            topicList: this.state.topicList,
                                            pitchOn: topicLists[index].questionId
                                        })
                                        //左边列表试卷题型更新
                                        this.getType(this.state.topicList)
                                    }}
                                    pitchOn={this.state.pitchOn}
                                    selecttopic={(id) => {
                                        this.setState({
                                            pitchOn: id
                                        })
                                    }}
                                    type={`${i + 1}. ${item.typeName}`}
                                    answer={item.answer ? item.answer : item.standardAnswer}
                                />
                            )) : <Empty description='暂无题目' style={{ position: 'relative', top: '50%', transform: 'translate(0, -50%)' }} />
                        }

                    </Content>
                    <div id='back' className={style.upArrows} onClick={() => {
                        var time = setInterval(function () {
                            document.getElementById('dollors').scrollTop = document.getElementById('dollors').scrollTop - 7;
                            if (document.getElementById('dollors').scrollTop <= 0) {
                                clearInterval(time);
                            }
                        }, 1);
                    }}>
                        <Icon type="up" />
                    </div>
                </Layout >
                <Footer className={style.bottom}>
                    <div className={style.anniu} style={{ width: 116 }} onClick={this.oneDonw.bind(this)}>
                        <Icon type="loading" hidden={this.state.loading !== 1} /><Icon type="download" /> 一键组卷  </div>

                </Footer>
                <Modal
                    visible={this.state.showPdfModal}
                    maskClosable={false}
                    keyboard={false}
                    onOk={() => {
                        let downame = `${moment().format('YYYY年MM月DD日')}${store.get('wrongBookNews').schoolType}${this.props.state.subName}${length}.pdf`
                        window.location.href = `${this.state.pdfUrl.downloadUrl}${downame}`;
                        this.setState({
                            showPdfModal: false
                        })
                    }}
                    onCancel={() => {
                        this.setState({
                            showPdfModal: false
                        })
                    }}
                    className={commonCss.pdfModal}
                    closable={false}
                    cancelText='取消'
                    okText='下载' >
                    <div style={{ height: '700px' }}>
                        <iframe src={this.state.pdfUrl.url} title='下载预览' style={{ width: '100%', height: '100%', border: 0 }}></iframe>
                    </div>
                </Modal>
            </>
        )
    }
    componentDidMount() {

        //获取知识点
        this.getKnowledge({
            year: this.props.state.years,
            classId: this.props.state.classId,
            subjectId: this.props.state.subId,
            type: 0,
            endTime: moment().format('YYYY-MM-DD'),
            startTime: moment().subtract(7, 'days').calendar(null, {
                sameDay: 'YYYY-MM-DD',
                nextDay: 'YYYY-MM-DD',
                nextWeek: 'YYYY-MM-DD',
                lastDay: 'YYYY-MM-DD',
                lastWeek: 'YYYY-MM-DD',
                sameElse: 'YYYY-MM-DD'
            }),
        })

        //题目列表
        this.getTitles({
            classId: this.props.state.classId,
            subjectId: this.props.state.subId,
        })

    }

}

export default connect((state) => ({
    state: {
        ...state.temp,
        ...state.report,
    }
}))(intelligentDollors);