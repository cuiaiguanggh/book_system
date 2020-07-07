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

            data: [{
                index: '1',
                path: '页面',
                time: 23232,
                timeRatio: '40%',
                population: 21321545,
                populationRatio: '1%'
            }, {
                index: '2',
                path: '页面',
                time: 23232,
                timeRatio: '40%',
                population: 21321545,
                populationRatio: '1%'
            }, {
                index: '3',
                path: '页面',
                time: 23232,
                timeRatio: '40%',
                population: 21321545,
                populationRatio: '1%'
            }, {
                index: '4',
                path: '页面',
                time: 23232,
                timeRatio: '40%',
                population: 21321545,
                populationRatio: '1%'
            }, {
                index: '5',
                path: '页面',
                time: 23232,
                timeRatio: '40%',
                population: 21321545,
                populationRatio: '1%'
            }, {
                index: '6',
                path: '页面',
                time: 23232,
                timeRatio: '40%',
                population: 21321545,
                populationRatio: '1%'
            }, {
                index: '7',
                path: '页面',
                time: 23232,
                timeRatio: '40%',
                population: 21321545,
                populationRatio: '1%'
            }, {
                index: '8',
                path: '页面',
                time: 23232,
                timeRatio: '40%',
                population: 21321545,
                populationRatio: '1%'
            }, {
                index: '9',
                path: '页面',
                time: 23232,
                timeRatio: '40%',
                population: 21321545,
                populationRatio: '1%'
            }, {
                index: '10',
                path: '页面',
                time: 23232,
                timeRatio: '40%',
                population: 21321545,
                populationRatio: '1%'
            }, {
                index: '11',
                path: '页面',
                time: 23232,
                timeRatio: '40%',
                population: 21321545,
                populationRatio: '1%'
            }, {
                index: '12',
                path: '页面',
                time: 23232,
                timeRatio: '40%',
                population: 21321545,
                populationRatio: '1%'
            },{
                index: '13',
                path: '页面',
                time: 23232,
                timeRatio: '40%',
                population: 21321545,
                populationRatio: '1%'
            },{
                index: '14',
                path: '页面',
                time: 23232,
                timeRatio: '40%',
                population: 21321545,
                populationRatio: '1%'
            },{
                index: '15',
                path: '页面',
                time: 23232,
                timeRatio: '40%',
                population: 21321545,
                populationRatio: '1%'
            },{
                index: '16',
                path: '页面',
                time: 23232,
                timeRatio: '40%',
                population: 21321545,
                populationRatio: '1%'
            },],
        }
    }



    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                render: (text, record) => (text),
            },
            {
                title: '页面路径',
                dataIndex: 'path',
                render: (text, record) => (text),

            },
            {
                title: '访问次数',
                dataIndex: 'time',
                render: (text, record) => (text),

            },
            {
                title: '访问次数占比',
                dataIndex: 'timeRatio',
                render: (text, record) => (text),

            },
            {
                title: '访问人数',
                dataIndex: 'population',
                render: (text, record) => (text),
            },
            {
                title: '访问人数占比',
                dataIndex: 'populationRatio',
                render: (text, record) => (text),
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
                                <span className={this.state.detailwho === 1 ? style.blueColor : undefined} onClick={() => { this.setState({ detailwho: 1 }); }}>小程序</span>
                                <span className={this.state.detailwho === 2 ? style.blueColor : undefined} onClick={() => { this.setState({ detailwho: 2 }); }}>网页端</span>
                            </div>
                            <Search placeholder="请输入关键字搜索" onSearch={value => console.log(value)} style={{ width: 160 }} />

                        </div>
                        <Table rowKey={record => record.index} columns={columns} dataSource={this.state.data} pagination={false} />
                    </div>


                </Layout>
            </>
        )
    }





}

export default connect((state) => ({}))(dataDetails);