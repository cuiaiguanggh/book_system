import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Layout, Input, Table } from 'antd';
import style from './dataBackground.less';
const { Search } = Input;


class dataDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            detailwho: 1,
            data: [],
            allData: {},
            searchValue: ''
        }
    }



    render() {

        let dataSource = this.state.data.filter((obj) => {
            if (obj.htmlName.includes(this.state.searchValue)) {
                return obj
            }
        })
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                render: (text, record, index) => (index + 1),
            },
            {
                title: '页面路径',
                dataIndex: 'htmlName',
                render: (text, record) => (text),

            },
            {
                title: '访问次数',
                dataIndex: 'visitTimes',
                render: (text, record) => (text),

            },
            {
                title: '访问次数占比',
                dataIndex: 'visitTimesPer',
                render: (text, record) => (`${Math.floor(text * 100)}%`),

            },
            {
                title: '访问人数',
                dataIndex: 'visitPeo',
                render: (text, record) => (text),
            },
            {
                title: '访问人数占比',
                dataIndex: 'visitPeoPer',
                render: (text, record) => (`${Math.floor(text * 100)}%`),
            },
        ];



        return (
            <>
                <div className={style.top}>
                    <div onClick={() => { this.props.dispatch(routerRedux.push({ pathname: '/dataBackground' })) }} className={style.whiteButton}> 数据概览</div>
                    <div className={style.blueButton}> 数据详情</div>
                </div>
                <Layout style={{ padding: 32, overflow: 'auto' }}>
                    <div className={style.details} style={{ padding: '25px 30px 30px 30px' }}>
                        <div style={{ paddingBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
                            <div className={style.anniuBox}>
                                <span className={this.state.detailwho === 1 ? style.blueColor : undefined}
                                    onClick={() => { this.setState({ detailwho: 1, data: this.state.allData.actReportDetailsApp, searchValue: '' }); }}>小程序</span>
                                <span className={this.state.detailwho === 2 ? style.blueColor : undefined}
                                    onClick={() => { this.setState({ detailwho: 2, data: this.state.allData.actReportDetailsWeb, searchValue: '' }); }}>网页端</span>
                            </div>
                            <Search placeholder="请输入关键字搜索" value={this.state.searchValue}
                                onChange={e => this.setState({ searchValue: '' })} style={{ width: 160 }} />

                        </div>
                        <Table rowKey={record => record.functionId} columns={columns} dataSource={dataSource} pagination={false} />
                    </div>


                </Layout>
            </>
        )
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'market/actReportDetail',
        }).then((res) => {
            if (res) {
                this.setState({
                    data: res.actReportDetailsApp,
                    allData: res
                })
            }
        })
    }



}

export default connect((state) => ({}))(dataDetails);