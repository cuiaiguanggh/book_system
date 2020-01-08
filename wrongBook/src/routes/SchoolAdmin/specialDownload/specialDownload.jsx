import React from 'react';
import {
    Layout, message, Select, Icon, Button, Table, Modal
} from 'antd';
import { connect } from 'dva';
import commonCss from '../../css/commonCss.css';

const { Footer, Content } = Layout;
const { Option } = Select;

class specialDownload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gradeId: 9,
            subjectId: undefined,
            type: 1,
            data: [],
            visible: false,
            fileLink: '',
            loading: false,
            loading1: false,
            downloadUrl: '',
            url: '',
            courseId: null,
            courseName1: '',
            courseName2: '',
        };
    }

    getdata(payload) {
        this.props.dispatch({
            type: 'down/queryCourseDetail',
            payload: payload
        }).then((res) => {
            if (res) {
                this.setState({
                    data: res
                })
            } else {
                this.setState({
                    data: [],
                    courseId: null
                })
            }
        })
    }



    render() {
        let columns = [
            {
                title: '目录',
                dataIndex: 'courseName',
                render: text => (text)
            }, {
                title: '知识点',
                dataIndex: 'knowledgeName',
                render: text => (text)
            }, {
                title: '操作',
                render: (text, record) => <Button type="primary" loading={this.state.loading1 === record.courseId} onClick={() => {
                    this.setState({
                        loading1: record.courseId
                    })
                    this.props.dispatch({
                        type: 'down/makeMidExamPdfs',
                        payload: {
                            courseIds: record.courseId
                        }
                    }).then((res) => {
                        if (res) {
                            this.setState({
                                visible: true,
                                downloadUrl: res.downloadUrl,
                                url: res.url,
                                loading1: false,
                                courseName2: record.courseName
                            })
                        }
                    })
                }}>查看详情</Button>
            }]
        return (
            <Layout style={{ background: '#fff', boxShadow: '0 0 10px #efefef inset' }}>
                <Content style={{ padding: '15px 40px 0 20px', }}>
                    <Select
                        showSearch
                        style={{ width: 90 }}
                        optionFilterProp="children"
                        value={this.state.gradeId}
                        onChange={(value) => {
                            this.setState({
                                gradeId: value
                            })
                            if (this.state.subjectId) {
                                this.getdata({
                                    subjectId: this.state.subjectId,
                                    gradeId: value,
                                    type: this.state.type
                                })
                            }

                        }}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                        {['一', '二', '三', '四', '五', '六', '七', '八', '九'].map((item, index) => (
                            <Option value={index + 1} key={index}> {item}年级</Option>
                        ))}
                    </Select>

                    <Select
                        showSearch
                        style={{ width: 90, margin: '0 5px ' }}
                        optionFilterProp="children"
                        placeholder="学科"
                        value={this.state.subjectId}
                        onChange={(value) => {
                            this.getdata({
                                subjectId: value,
                                gradeId: this.state.gradeId,
                                type: this.state.type
                            })
                            this.setState({
                                subjectId: value
                            })
                        }}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                        <Option value={2}>数学</Option>
                        <Option value={5}>地理</Option>
                        <Option value={7}>生物</Option>
                        <Option value={8}>物理</Option>
                        <Option value={9}>化学</Option>
                    </Select>

                    <Select
                        showSearch
                        style={{ width: 130 }}
                        optionFilterProp="children"
                        value={this.state.type}
                        onChange={(value) => {
                            this.setState({
                                type: value
                            })
                            if (this.state.subjectId) {
                                this.getdata({
                                    subjectId: this.state.subjectId,
                                    gradeId: this.state.gradeId,
                                    type: value
                                })
                            }
                        }}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                        <Option value={1}> 中考专题</Option>
                        <Option value={2}> 高考专题</Option>
                    </Select>

                    <Table style={{ marginTop: 20 }}
                        rowSelection={{
                            type: 'radio',
                            onChange: (selectedRowKeys, selectedRows) => {
                                this.setState({
                                    courseId: selectedRows[0].courseId,
                                    courseName1: selectedRows[0].courseName,
                                })
                            }
                        }}
                        columns={columns}
                        bordered
                        rowKey={(record) => (record.courseId)}
                        dataSource={this.state.data} />
                </Content>

                <Footer style={{ background: '#fff', textAlign: "center", height: 60, lineHeight: '60px', boxShadow: '0 0 10px #efefef inset', padding: 0 }}>
                    <Button style={{height: 40, background: '#409EFF' }} type="primary" loading={this.state.loading}
                        onClick={() => {
                            if (this.state.courseId) {
                                this.setState({
                                    loading: true
                                })
                                this.props.dispatch({
                                    type: 'down/makeMidExamPdfs',
                                    payload: {
                                        courseIds: this.state.courseId
                                    }
                                }).then((res) => {
                                    window.location.href = `${res.downloadUrl}${this.state.courseName1}.pdf`
                                    this.setState({
                                        loading: false,
                                    })
                                })
                            } else {
                                message.warning('请先选择要下载/导出的专题')
                            }
                        }}>
                        <Icon type="vertical-align-bottom" style={{ fontSize: 16 }} />下载/导出</Button>
                </Footer>

                <Modal
                    visible={this.state.visible}
                    maskClosable={false}
                    keyboard={false}
                    onOk={() => {
                        window.location.href = `${this.state.downloadUrl}${this.state.courseName2}.pdf`
                        this.setState({
                            visible: false
                        })
                    }}
                    onCancel={() => {
                        this.setState({
                            visible: false
                        })
                    }}
                    className={commonCss.pdfModal}
                    closable={false}
                    cancelText='取消'
                    okText='下载'>
                    <div style={{ height: '700px' }}>
                        <iframe src={this.state.url} title='下载预览' style={{ width: '100%', height: '100%', border: 0 }}></iframe>
                    </div>
                </Modal>
            </Layout >
        )
    }
}

export default connect()(specialDownload);
