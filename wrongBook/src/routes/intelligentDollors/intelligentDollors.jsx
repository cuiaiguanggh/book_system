import React from 'react';
import {
    Layout, Icon, DatePicker, Empty, Modal, Spin
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import style from './intelligentDollors.less';
import observer from '../../utils/observer'
import Topics from './topics'
import commonCss from '../css/commonCss.css';
import store from 'store';

const { Header, Sider, Content, } = Layout;
const { RangePicker } = DatePicker;


class intelligentDollors extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectTime: [],
            mouNow: 0,
            dollorsKnowledge: [],
            topicList: [],
            pattern: [],
            pitchOn: '',
            showPdfModal: false,
            pdfUrl: {},
            loading: 0,
            //鼠标次数选中的知识点题数
            nowNume: 0,
        }
        //更新题目中的题型和题型数量和知识点数量的方法
        this.getType = (data) => {
            let map = new Map();
            let knowledge = new Map();

            for (let object of data) {
                // 单选题、多选题、填空题、判断题,其他
                if (!map.has(object.typeName)) {
                    map.set(object.typeName, 1)
                } else if (map.size !== 0) {
                    map.set(object.typeName, map.get(object.typeName) + 1)
                }
                //获取对应知识点的数量
                if (!knowledge.has(object.knowledgeName)) {
                    knowledge.set(object.knowledgeName, 1)
                } else if (knowledge.size !== 0) {
                    knowledge.set(object.knowledgeName, knowledge.get(object.knowledgeName) + 1)
                }
            }

            let hadNumber = [];
            //更新知识点上的对应数量
            [...knowledge].forEach((value) => {
                hadNumber.push(value[0])
            })

            for (let obj of this.state.dollorsKnowledge) {
                if (hadNumber.includes(obj.knowledgeName)) {
                    obj.nowNum = knowledge.get(obj.knowledgeName)
                } else {
                    obj.nowNum = 0
                }
            }
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
                let dollorsKnowledge = [];
                for (let obj of list) {
                    obj.title = obj.title && obj.title.replace(/宋体/g, "微软雅黑");
                    obj.answer = obj.answer && obj.answer.replace(/宋体/g, "微软雅黑");
                    obj.parse = obj.parse && obj.parse.replace(/宋体/g, "微软雅黑");
                    dollorsKnowledge.push({
                        knowledgeId: obj.knowledgeId,
                        knowledgeName: obj.knowledgeName,
                    })
                }
                this.setState({
                    topicList: list,
                    dollorsKnowledge
                })
                this.getType(list)
            })
        }
        //获取知识点方法
        // this.getKnowledge = (data) => {
        //     console.log('getKnowledge')
        //     return;
        //     this.props.dispatch({
        //         type: 'temp/dollorsKnowledge',
        //         payload: data
        //     }).then(data => {
        //         if (data) {
        //             this.setState({
        //                 dollorsKnowledge: data
        //             })
        //         } else {
        //             this.setState({
        //                 dollorsKnowledge: []
        //             })
        //         }
        //     })
        // }
        //重置
        observer.addSubscribe('dollorsReset', () => {
            this.setState({
                selectTime: [],
                mouNow: 0,
                dollorsKnowledge: [],
                topicList: [],
                pattern: [],
            })
        })
        //切换学科时
        observer.addSubscribe('dollorsChange', (subId) => {
            this.setState({
                selectTime: [],
                mouNow: 0,
            })

            //获取知识点
            // this.getKnowledge({
            //     year: this.props.state.years,
            //     classId: this.props.state.classId,
            //     subjectId: subId,
            //     type: 0,
            // })

            //题目列表
            this.getTitles({
                classId: this.props.state.classId,
                subjectId: subId,
                year: this.props.state.years,
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
        // this.getKnowledge({
        //     year: this.props.state.years,
        //     classId: this.props.state.classId,
        //     subjectId: this.props.state.subId,
        //     type: 0,
        // })

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
        // this.getKnowledge({
        //     year: this.props.state.years,
        //     classId: this.props.state.classId,
        //     subjectId: this.props.state.subId,
        //     type: 0,
        //     month: item.v
        // })
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
        // this.getKnowledge({
        //     year: this.props.state.years,
        //     classId: this.props.state.classId,
        //     subjectId: this.props.state.subId,
        //     type: 0,
        //     startTime: dateString[0],
        //     endTime: dateString[1]
        // })
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

        if(!this.state.topicList.length)return
        this.props.dispatch({
            type: 'report/maidian',
            payload: { functionId: 9, actId: 1 }
        });
        this.setState({
            loading: 1
        })
        let questionIds = [];
        this.state.topicList.forEach((obj) => {
            questionIds.push(obj.questionId)
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
    //点击知识点增加试卷题数up按钮
    upAdd(item, length) {
        let that = this;
        let cun = this.state.topicList;
        let nowNum = item.nowNum + 1 || 1;

        //调用接口获取要增加的题目方法
        function getList() {
            let questionIds = [];
            for (let obj of cun) {
                questionIds.push(obj.questionId)
            }
            that.props.dispatch({
                type: 'down/knowledgeQue',
                payload: {
                    knowledgeId: item.knowledgeId,
                    questionIds,
                }
            }).then(res => {
                if (res.length > 0) {

                    let suzu = [];
                    suzu.length = nowNum - 1;
                    for (let obj of res) {
                        obj.title = obj.title && obj.title.replace(/宋体/g, "微软雅黑")
                        obj.answer = obj.answer && obj.answer.replace(/宋体/g, "微软雅黑")
                        obj.parse = obj.parse && obj.parse.replace(/宋体/g, "微软雅黑")
                        suzu.push({ ...obj })
                    }
                    item.cunList = suzu;

                    cun.push({ ...res[0] })
                    that.setState({
                        topicList: cun
                    })
                    that.getType(cun)
                    //记录此时知识点的题数
                    item.addNowNumber = nowNum
                }
            })
            return;
        }


        if (nowNum <= 10 && length < 30) {
            //判断是否已获取对应需要替换的题目列表
            if (item.hasOwnProperty('cunList') && item.nowNum < 10) {
                //此知识点的题目是否减少
                if (item.addNowNumber > nowNum - 1) {
                    getList()
                } else if (nowNum <= item.cunList.length) {
                    //存储的题目数量大于等于要增加的题目数
                    cun.push({ ...item.cunList[nowNum - 1] })
                    this.setState({
                        topicList: cun,
                    })
                    //更新此时知识点的题数
                    item.addNowNumber = ++item.addNowNumber;
                    this.getType(cun)
                }
            } else {
                getList()
            }
        }
    }
    //点击知识点增加试卷题数down按钮
    downReduce(item) {
        if (item.nowNum > 0) {
            let data = this.state.topicList;
            data.reverse();
            for (let i = 0; i < data.length; i++) {
                if (data[i].knowledgeName === item.knowledgeName) {
                    data.splice(i, 1);
                    data.reverse();
                    this.getType(data)
                    this.setState({
                        topicList: data
                    })
                    break;
                }
            }
        }
    }

    render() {
        let mounthList = this.props.state.mounthList;
        let length = this.state.topicList.length;

        return (
            <>
                <Header className={style.layoutHead} style={this.props.state.topBarHide === 0 ? { display: 'none' } : {}}>
                    <span style={{
                        fontSize: 14,
                        fontFamily: 'MicrosoftYaHei-Bold',
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
                        style={{ width: 250 }}
                        format="YYYY-MM-DD"
                        placeholder={['开始时间', '结束时间']}
                        value={this.state.selectTime}
                        disabledDate={current => current && current > moment().endOf('day') || current < moment().subtract(2, 'year')}
                        onChange={this.quantumtime.bind(this)} />
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

                        <div className={style.leftBottom} style={{ height: 'calc(100% - 140px)' }}>
                            <div className={style.title}> 本周班级薄弱知识点 </div>
                            <div className={style.knowledgeBox} style={{ height: 'calc(100% - 20px)' }}>
                                {this.state.dollorsKnowledge.length>0?this.state.dollorsKnowledge.map((item, i) => (
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
                                                        <span className={style.numberUp} onClick={(e) => { this.upAdd(item, length) }}>  <Icon type="caret-up" />  </span>
                                                        <span className={style.numberDown} onClick={() => { this.downReduce(item) }}>  <Icon type="caret-down" /> </span>
                                                    </span> : <>题</>}
                                            </span>
                                        </span>
                                    </p>
                                )):<Empty description='暂无知识点' style={{ position: 'relative', top: '30%'}} />}
                            </div>
                        </div>
                    </Sider>
                    <Content className={style.content} id='dollors' onScroll={(e) => {
                        if (e.currentTarget.scrollTop < 500) {
                            document.getElementById('back').style.opacity = 0.3 * e.currentTarget.scrollTop / 500
                        } else {
                            document.getElementById('back').style.opacity = 0.3
                        }
                        if (e.currentTarget.scrollTop === 0) {
                            this.props.dispatch({
                                type: 'temp/topBarHide',
                                payload: 1
                            })
                        } else {
                            this.props.dispatch({
                                type: 'temp/topBarHide',
                                payload: 0
                            })
                        }
                    }}>
                        {length > 0 ?
                            this.state.topicList.map((item, i) => (
                                <Topics
                                    key={item.questionId}
                                    topic={item}
                                    nowIndex={i}
                                    delete={(nowIndex) => {
                                        let data = this.state.topicList;
                                        //删除题目
                                        data.splice(nowIndex, 1);
                                        this.setState({
                                            topicList: data
                                        })
                                        //左边列表试卷题型更新
                                        this.getType(data)
                                    }}
                                    length={length}
                                    change={(data, tihuan) => {
                                        //调用接口，获取要替换的题目
                                        let questionIds = [];
                                        this.state.topicList.forEach((obj) => {
                                            questionIds.push(obj.questionId)
                                        })
                                        data.questionIds = questionIds.join(','),
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
                            document.getElementById('dollors').scrollTop = document.getElementById('dollors').scrollTop * 0.9;
                            if (document.getElementById('dollors').scrollTop <= 0) {
                                clearInterval(time);
                            }
                        }, 1);
                    }}>
                        <Icon type="up" />
                    </div>
                </Layout >
                <div className={style.dingwei}>
                    <Spin spinning={this.state.loading === 1}>
                        <div className={style.zujuan} disabled={this.state.topicList.length==0} onClick={this.oneDonw.bind(this)}>
                            <img src={require('../images/zujuanDown.png')} style={{ marginBottom: 5 }} />
                         一<br />键<br />组<br />卷<br />
                            <span className={style.yuan}>{length}</span>
                        </div>
                    </Spin>
                </div>

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
                        this.props.dispatch({
                            type: 'report/maidian',
                            payload: { functionId: 10, actId: 1 }
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
        // this.getKnowledge({
        //     year: this.props.state.years,
        //     classId: this.props.state.classId,
        //     subjectId: this.props.state.subId,
        //     type: 0,
        // })


        //题目列表
        this.getTitles({
            classId: this.props.state.classId,
            subjectId: this.props.state.subId,
            year: this.props.state.years,
        })
        this.props.dispatch({
            type: 'report/maidian',
            payload: { functionId: 8, actId: 2 }
        })
    }
    componentWillUnmount() {
        this.props.dispatch({
            type: 'temp/topBarHide',
            payload: 1
        })
    }

}

export default connect((state) => ({
    state: {
        ...state.temp,
        ...state.report,
    }
}))(intelligentDollors);