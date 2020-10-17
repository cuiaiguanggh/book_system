import React from 'react';
import { Layout, Icon, Pagination, Button, Checkbox, Spin } from "antd";
import { connect } from 'dva';
import style from './fineQuestion.less';
import QuestionMenu from './QuestionMenu';
import QuestionHeader from './QuestionHeader';
import QuestionTopic from './QuestionTopic';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
const { Sider, Content } = Layout;


class fineQuestion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            electTopiced: 0,
            treeStructure: [],
            topics: [],
            parameter: {
                gradeId: [10, 11, 12]
            },
            nowKnowledgeId: '',
            grade: ['高一', '高二', '高三'],
            checkedGrade: ['高一', '高二', '高三'],
            gradePeriod: 3,
            pageNumber: 1,
            loading: true,
        }
    }


    getTopics(parameter) {
        this.props.dispatch({
            type: 'report/queDetail',
            payload: parameter
        }).then(data => {
            this.setState({
                topics: data
            })
        })
    }


    render() {
        //已选题目
        let selected = 0;
        for (let obj of this.state.topics) {
            if (obj.isGood === 1) {
                selected++;
            }
        }
        //过滤后的题目
        let filterTopics = [];
        if (this.state.electTopiced === 1) {
            for (let obj of this.state.topics) {
                if (obj.isGood === 1) {
                    filterTopics.push(obj)
                }
            }
        } else if (this.state.electTopiced === 2) {
            for (let obj of this.state.topics) {
                if (obj.isGood === 0) {
                    filterTopics.push(obj)
                }
            }
        }
        //当前页数的题目
        let nowPageTopics = this.state.topics.slice((this.state.pageNumber - 1) * 10, this.state.pageNumber * 10);
        if (this.state.electTopiced) {
            nowPageTopics = filterTopics.slice((this.state.pageNumber - 1) * 10, this.state.pageNumber * 10);
        }

        return (
            <Layout className={style.bigBox} id='topicId'>
                <Sider className={style.left} style={{ height: 'calc(100% - 95px)' }}>
                    <Spin spinning={this.state.loading}>
                        <QuestionMenu treeStructure={this.state.treeStructure}
                            nowKnowledgeId={this.state.nowKnowledgeId}
                            upadtaKnowledgeId={(id) => { this.setState({ nowKnowledgeId: id }) }}
                            parameter={this.state.parameter}
                            getTopics={(id) => {
                                this.props.dispatch({
                                    type: 'report/queDetail',
                                    payload: {
                                        ...this.state.parameter,
                                        knowledgeId: id
                                        // knowledgeId: 5110
                                    }
                                }).then(data => {
                                    this.setState({
                                        topics: data,
                                        pageNumber: 1,
                                    })
                                    document.getElementById('topicId').scrollTop = 0;
                                })
                            }}
                            updataGrade={(suzu, number, subjectId) => {
                                this.props.dispatch({
                                    type: 'report/tree',
                                    payload: {
                                        subjectId: subjectId,
                                        phaseId: number
                                    }
                                }).then(data => {
                                    this.setState({
                                        treeStructure: data,
                                        loading: false
                                    })
                                })

                                this.setState({
                                    grade: [...suzu],
                                    checkedGrade: [...suzu],
                                    gradePeriod: number,
                                    loading: true,
                                    topics: [],
                                    pageNumber: 1,
                                    nowKnowledgeId: '',
                                })

                            }}
                        />
                    </Spin>
                </Sider>
                <Layout style={{ background: '#EBECEE', marginLeft: 270, maxWidth: 930, overflow: 'visible' }}>
                    <QuestionHeader
                        grade={this.state.grade}
                        checkedGrade={this.state.checkedGrade}
                        setCheckedGrade={(data) => {
                            this.setState({
                                checkedGrade: data
                            })
                        }}
                        parameter={this.state.parameter}
                        gradePeriod={this.state.gradePeriod}
                        getTopics={() => {
                            if (this.state.nowKnowledgeId !== '') {
                                this.props.dispatch({
                                    type: 'report/queDetail',
                                    payload: {
                                        ...this.state.parameter,
                                        knowledgeId: this.state.nowKnowledgeId
                                    }
                                }).then(data => {
                                    this.setState({
                                        topics: data,
                                        pageNumber: 1,
                                    })
                                    document.getElementById('topicId').scrollTop = 0;
                                })
                            }
                        }}
                    />
                    <div className={style.middle}>
                        <Checkbox checked={this.state.electTopiced === 1}
                            onChange={(e) => {
                                this.setState({
                                    pageNumber: 1,
                                    electTopiced: e.target.checked ? 1 : 0
                                })
                                document.getElementById('topicId').scrollTop = 0;
                            }}>已选题目</Checkbox>

                        <Checkbox checked={this.state.electTopiced === 2}
                            onChange={(e) => {
                                this.setState({
                                    pageNumber: 1,
                                    electTopiced: e.target.checked ? 2 : 0
                                })
                                document.getElementById('topicId').scrollTop = 0;
                            }}>未选题目</Checkbox>

                        <div style={{ float: "right" }}>
                            <span>共计 <span style={{ color: '#409EFF' }}>{this.state.topics.length}</span> 题</span>
                        </div>

                    </div>
                    <Content style={{ overflow: `${this.state.topics.length === 0 ? 'hidden' : 'visible'}`, height: '100%' }} >
                        {this.state.topics.length === 0 ?
                            <div style={{ background: '#fff', height: '100%', textAlign: "center" }}>
                                <img src='http://homework.mizholdings.com/kacha/kcsj/bf15af1b5aee2444/.png' style={{ marginTop: 160 }} />
                                <p style={{ color: '#111111' }}>没有找到对应的题目</p>
                            </div> :
                            <QuestionTopic topics={nowPageTopics}
                                delect={(questionId) => {
                                    this.props.dispatch({
                                        type: 'report/remove',
                                        payload: {
                                            questionId: questionId
                                        }
                                    }).then(() => {
                                        this.props.dispatch({
                                            type: 'report/queDetail',
                                            payload: {
                                                ...this.state.parameter,
                                                knowledgeId: this.state.nowKnowledgeId
                                            }
                                        }).then(data => {
                                            this.setState({
                                                topics: data
                                            })
                                        })
                                    })
                                }}
                                joinRemove={(questionId, isGood, index) => {
                                    this.props.dispatch({
                                        type: 'report/sign',
                                        payload: {
                                            questionId,
                                            isGood
                                        }
                                    })
                                    if (this.state.electTopiced) {
                                        for (let i = 0; i < this.state.topics.length; i++) {
                                            if (this.state.topics[i].questionId === questionId) {
                                                this.state.topics[i].isGood = isGood;
                                                break;
                                            }
                                        }
                                    } else {
                                        this.state.topics[(this.state.pageNumber - 1) * 10 + index].isGood = isGood;
                                    }
                                    this.setState({ topics: this.state.topics })
                                }} />}


                        <div style={{ position: 'relative', textAlign: "center", padding: '5px 0 15px', display: `${this.state.topics.length === 0 ? 'none' : 'block'}` }}>
                            <ConfigProvider locale={zhCN}>
                                <Pagination
                                    showQuickJumper
                                    current={this.state.pageNumber}
                                    showTotal={total => `共${total}条`}
                                    total={this.state.electTopiced ? filterTopics.length : this.state.topics.length}
                                    onChange={(pageNumber) => {
                                        document.getElementById('topicId').scrollTop = 0;
                                        this.setState({
                                            pageNumber
                                        })
                                    }} />
                            </ConfigProvider>
                            <img src={'http://homework.mizholdings.com/kacha/kcsj/2b95d97f9acf8189/.png'}
                                style={{
                                    position: 'fixed',
                                    bottom: 70,
                                    right: '8%',
                                    cursor: 'pointer'
                                }}
                                onClick={() => { document.getElementById('topicId').scrollTop = 0; }} />
                        </div>
                    </Content>


                    <div className={style.collect}>
                        <img src='http://homework.mizholdings.com/kacha/kcsj/cc74907be9d951f7/.png' style={{ marginBottom: 10 }} />
                        已<br />收<br />藏
                    <span className={style.yuan}> {selected} </span>
                    </div>

                </Layout>
            </Layout>



        )
    }
    componentDidMount() {
        this.props.dispatch({
            type: 'report/tree',
            payload: {
                subjectId: 8,
                phaseId: 3
            }
        }).then(data => {
            this.setState({
                treeStructure: data,
                loading: false
            })
        })
    }
}


export default connect((state) => ({

}))(fineQuestion);