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
            electTopiced: false,
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
        for (let obj of this.state.topics) {
            if (obj.isGood === 0) {
                filterTopics.push(obj)
            }
        }

        //当前页数的题目
        let nowPageTopics = this.state.topics.slice((this.state.pageNumber - 1) * 10, this.state.pageNumber * 10);
        if (this.state.electTopiced) {
            nowPageTopics = filterTopics.slice((this.state.pageNumber - 1) * 10, this.state.pageNumber * 10);
        }

        return (
            <Layout style={{ background: '#EBECEE', padding: '15px 4% 15px 8%' }}>
                <Sider className={style.left} >
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
                                        topics: data
                                    })
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
                                })

                            }}
                        />
                    </Spin>
                </Sider>

                <Layout style={{ background: '#EBECEE', marginLeft: 20, maxWidth: 930 }}>
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
                                        topics: data
                                    })
                                })
                            }
                        }}
                    />
                    <div className={style.middle}>
                        <Checkbox checked={this.state.electTopiced}
                            onChange={(e) => {
                                this.setState({
                                    pageNumber: 1,
                                    electTopiced: e.target.checked
                                })
                                document.getElementById('topicId').scrollTop = 0;
                            }}>过滤已选题目</Checkbox>
                        <div style={{ float: "right" }}>
                            <span>共计 <span style={{ color: '#409EFF' }}>{this.state.topics.length}</span> 题目</span>
                            <span style={{ margin: '0 20px' }}>已选 <span style={{ color: '#FF690F' }}> {selected} </span> 题目</span>
                            <span className={style.allIn} onClick={() => {
                                let questionId = [];
                                for (let obj of nowPageTopics) {
                                    questionId.push(obj.questionId)
                                }
                                this.props.dispatch({
                                    type: 'report/sign',
                                    payload: {
                                        questionId,
                                        isGood: 1
                                    }
                                })
                            }}>选择本页全部试题</span>
                        </div>

                    </div>
                    <Content style={{ overflow: `${this.state.topics.length === 0 ? 'hidden' : 'auto'}`, height: '100%' }} id='topicId'>
                        {this.state.topics.length === 0 ?
                            <div style={{ background: '#fff', height: '100%', textAlign: "center" }}>
                                <img src='http://homework.mizholdings.com/kacha/kcsj/bf15af1b5aee2444/.png' style={{ marginTop: 160 }} />
                                <p style={{ color: '#111111' }}>没有找到对应的题目</p>
                            </div> :
                            <QuestionTopic topics={nowPageTopics}
                                joinRemove={(questionId, isGood, index) => {
                                    this.props.dispatch({
                                        type: 'report/sign',
                                        payload: {
                                            questionId,
                                            isGood
                                        }
                                    })
                                    this.state.topics[(this.state.pageNumber - 1) * 10 + index].isGood = isGood;
                                    this.setState({
                                        topics: this.state.topics
                                    })
                                }} />}
                    </Content>

                    <div style={{ position: 'relative', textAlign: "center", paddingTop: 5, display: `${this.state.topics.length === 0 ? 'none' : 'block'}` }}>
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
                        <img src={'http://homework.mizholdings.com/kacha/kcsj/309f4c25a216fffe/.png'}
                            style={{
                                position: 'fixed',
                                bottom: 70,
                                right: '8%',
                                cursor: 'pointer'
                            }}
                            onClick={() => { document.getElementById('topicId').scrollTop = 0; }} />
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