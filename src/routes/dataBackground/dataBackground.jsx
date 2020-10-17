import React from 'react';
import style from './dataBackground.less';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Layout, Progress, DatePicker } from 'antd';
import echarts from 'echarts';
import moment from 'moment';

const { RangePicker } = DatePicker;


class dataBackground extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            appletTodayview: '',
            webTodayview: '',
            activeWhere: 1,
            monthOrYear: 1,
            activeSchool: 1,
            timePeriod: 2,
            overallData: {},
            timeArry: [],
            dateStrings: [moment().format("YYYY-M-DD"), moment().format("YYYY-M-DD")]
        }
    }




    userNmberForApp() {
        this.setState({ activeSchool: 1 });
        echarts.init(document.getElementById('yhl')).setOption({
            xAxis: {
                data: Object.keys(this.state.overallData.userNumByAppData)
            },
            series: [{
                data: Object.values(this.state.overallData.userNumByAppData)
            }]
        });
    }
    userNmberForWeb() {
        this.setState({ activeSchool: 2 });
        echarts.init(document.getElementById('yhl')).setOption({
            xAxis: {
                data: Object.keys(this.state.overallData.userNumByWebData)
            },
            series: [{
                data: Object.values(this.state.overallData.userNumByWebData)
            }]
        });
    }

    userVip(monthOrYear) {
        if (monthOrYear === this.state.monthOrYear) { return }
        this.setState({ monthOrYear })
        console.log(this.state.timeArry)
        if (monthOrYear === 1) {
            this.props.dispatch({
                type: 'market/vipReport',
                payload: {
                    timeStamp: this.state.timeArry[2].startTimeStamp,
                    periodTime: this.state.timeArry[2].periodTime,
                }
            }).then((res) => {
                if (res) {
                    echarts.init(document.getElementById('ffyhl')).setOption({
                        xAxis: {
                            data: Object.keys(res)
                        },
                        series: [{
                            data: Object.values(res),
                        }]
                    })
                }
            })
        } else {
            this.props.dispatch({
                type: 'market/vipReport',
                payload: {
                    timeStamp: moment(`${moment().year()}-01-01`).valueOf(),
                    startTime: `${moment().year()}-01-01`,
                    endTime: `${moment().year()}-12-31`,
                }
            }).then((res) => {
                if (res) {
                    echarts.init(document.getElementById('ffyhl')).setOption({
                        xAxis: {
                            data: Object.keys(res)
                        },
                        series: [{
                            data: Object.values(res),
                        }]
                    })
                }
            })
        }

    }

    userNmber(e) {
        if (e.target.getAttribute('data-value')) {
            let selectValue = Number(e.target.getAttribute('data-value'));
            this.setState({ timePeriod: selectValue })
            if (selectValue === this.state.timePeriod) { return }
            if (selectValue === 2) {
                this.selectTime({
                    timeStamp: this.state.timeArry[3].startTimeStamp,
                    startTime: moment(this.state.timeArry[3].startTimeStamp).format("YYYY-MM-DD"),
                    endTime: moment(this.state.timeArry[3].endTimeStamp).format("YYYY-MM-DD"),
                    periodTime: 4
                })
                this.setState({ dateStrings: [moment(this.state.timeArry[3].startTimeStamp).format("YYYY-MM-DD"), moment(this.state.timeArry[3].endTimeStamp).format("YYYY-MM-DD")] })

            } else if (selectValue === 3) {
                this.selectTime({
                    timeStamp: this.state.timeArry[2].startTimeStamp,
                    startTime: moment(this.state.timeArry[2].startTimeStamp).format("YYYY-MM-DD"),
                    endTime: moment(this.state.timeArry[2].endTimeStamp).format("YYYY-MM-DD"),
                    periodTime: 3
                })
                this.setState({ dateStrings: [moment(this.state.timeArry[2].startTimeStamp).format("YYYY-MM-DD"), moment(this.state.timeArry[2].endTimeStamp).format("YYYY-MM-DD")] })

            } else if (selectValue === 4) {
                this.selectTime({
                    timeStamp: moment(`${moment().year()}-01-01`).valueOf(),
                    startTime: `${moment().year()}-01-01`,
                    endTime: `${moment().year()}-12-31`,
                });
                this.setState({ dateStrings: [`${moment().year()}-01-01`, `${moment().year()}-12-31`] })
            }
        }
    }

    changeRange(dateStrings) {
        this.selectTime({
            timeStamp: moment(dateStrings[0]).valueOf(),
            startTime: dateStrings[0],
            endTime: dateStrings[1],
        })
        this.setState({ dateStrings, timePeriod: 0 })
    }

    render() {

        let overallData = this.state.overallData;

        return (
            <>
                <div className={style.top}>
                    <div className={style.blueButton}> 数据概览</div>
                    <div onClick={() => { this.props.dispatch(routerRedux.push({ pathname: '/dataDetails' })) }} className={style.whiteButton}> 数据详情</div>
                </div>
                <Layout style={{ padding: 32, overflow: 'auto' }}>
                    <div className={style.visits} >
                        <div className={style.visitsBox}>  <div id='xcxzcyhl' style={{ height: 300 }}> </div>
                        </div>
                        <div className={style.visitsBox} style={{ margin: '0 32px' }}> <div id='xcxzfwl'> </div>   <span>{this.state.appletTodayview}</span></div>
                        <div className={style.visitsBox} > <div id='wydzfwl'> </div>  <span>{this.state.webTodayview}</span></div>
                    </div>

                    <div className={style.activeBox}>
                        <div className={style.anniuBox}>
                            <span className={this.state.activeSchool === 1 ? style.blueColor : undefined} onClick={this.userNmberForApp.bind(this)}>小程序</span>
                            <span className={this.state.activeSchool === 2 ? style.blueColor : undefined} onClick={this.userNmberForWeb.bind(this)}>网页端</span>
                        </div>
                        <div className={style.screenTime} onClick={(e) => { this.userNmber(e) }}>

                            <div style={{ float: 'right', marginRight: 25 }}>
                                <RangePicker style={{ width: 213 }} format={['YYYY-MM-DD', 'YYYY-MM-DD']} placeholder={['开始时间', '结束时间']}
                                    value={[moment(this.state.dateStrings[0], "YYYY-MM-DD"), moment(this.state.dateStrings[1], "YYYY-MM-DD")]} onChange={(dates, dateStrings) => { this.changeRange(dateStrings) }} />
                            </div>

                            <span data-value={4} style={this.state.timePeriod === 4 ? { color: '#1890FF' } : undefined}>全年</span>
                            <span data-value={3} style={this.state.timePeriod === 3 ? { color: '#1890FF' } : undefined}>本月</span>
                            <span data-value={2} style={this.state.timePeriod === 2 ? { color: '#1890FF' } : undefined}>本周</span>

                        </div>

                        <div className={style.schoolUsers}>
                            <div id='yhl' style={{ width: '68%', height: '100%', float: 'left' }}></div>
                            <div className={style.rightRanking}>
                                <p className={style.title}> 活跃学校排名</p>

                                {overallData.schoolActives && overallData.schoolActives.map((item, index) => {
                                    if (index < 10) {
                                        return (
                                            <div style={{ marginBottom: 18 }} key={index}>
                                                <span className={style.yuan} style={index === 0 ? { color: '#fff', background: '#ED6B51' } : (index === 1 ? { color: '#fff', background: '#F6963F' } : (index === 2 ? { color: '#fff', background: '#F7BE39' } : {}))}>{index + 1}</span>
                                                <span>{item.schoolName}</span>
                                                <span style={{ float: 'right' }} >{item.num}</span>
                                            </div>
                                        )
                                    }
                                })}

                            </div>
                        </div>



                    </div>
                    <div className={style.sidesBox}>
                        <div className={style.activeAccounted}>
                            <div className={style.title}>用户活跃占比</div>
                            <div className={style.anniuBox}>
                                <span className={this.state.activeWhere === 1 ? style.blueColor : undefined} onClick={() => { this.setState({ activeWhere: 1 }); }}>小程序</span>
                                <span className={this.state.activeWhere === 2 ? style.blueColor : undefined} onClick={() => { this.setState({ activeWhere: 2 }); }}>网页端</span>
                            </div>

                            <div className={style.zhanbi}>
                                <div>
                                    <Progress percent={overallData.loginTimes && (this.state.activeWhere === 1 ? overallData.loginTimes.threeLessForA * 100 : overallData.loginTimes.threeLessForW * 100)} strokeColor={'#4A9DF8'} strokeLinecap="square" type="circle" width={140} strokeWidth={12} />
                                    <p> 月登陆不足3次</p>
                                </div>
                                <div>
                                    <Progress percent={overallData.loginTimes && (this.state.activeWhere === 1 ? overallData.loginTimes.threeToEightForA * 100 : overallData.loginTimes.threeToEightForW * 100)} strokeColor={'#36CBCB'} strokeLinecap="square" type="circle" width={140} strokeWidth={12} />
                                    <p> 月登陆3-8次</p>
                                </div>
                                <div>
                                    <Progress percent={overallData.loginTimes && (this.state.activeWhere === 1 ? overallData.loginTimes.eightMoreForA * 100 : overallData.loginTimes.eightMoreForW * 100)} strokeColor={'#4ECB73'} strokeLinecap="square" type="circle" width={140} strokeWidth={12} />
                                    <p> 月登陆8次以上</p>
                                </div>
                            </div>
                        </div>
                        <div className={style.payUser}>

                            <div id='ffyhl' style={{ height: 405 }}> </div>
                            <div className={style.anniuBox}>
                                <span className={this.state.monthOrYear === 1 ? style.blueColor : undefined} style={{ width: 60 }}
                                    onClick={() => { this.userVip(1) }}>本月</span>
                                <span className={this.state.monthOrYear === 2 ? style.blueColor : undefined} style={{ width: 60 }}
                                    onClick={() => { this.userVip(2) }}>全年</span>
                            </div>
                        </div>
                    </div>
                    <div className={style.bottomSidesBox}>
                        <div id='pzqlczhl'>  </div>
                        <div id='dllczhl'>  </div>

                    </div>
                </Layout>
            </>
        )
    }

    //总访问量
    allPV(id, title, stateName, amount = 0, data = [], color) {

        let xTime = [], yData = [];
        for (let obj of data) {
            xTime.push(obj.visitsTime);
            yData.push(obj.visitsNum);
        }

        echarts.init(document.getElementById(id)).setOption({
            title: {
                ...title
            },
            grid: {
                left: '4%',
                right: '4%',
                bottom: 14,

            },
            yAxis: {
                show: false
            },
            xAxis: {
                boundaryGap: false,
                type: 'category',
                show: false,
                data: xTime
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0, 0, 0, 0.4)'
            },
            series: [{
                data: yData,
                name: '今日访问',
                type: 'line',
                itemStyle: {
                    color: color,
                    borderWidth: 3
                },
                areaStyle: {
                    opacity: 0.2
                },
                smooth: true,
                showSymbol: false,
            }]
        });
        this.setState({
            [stateName]: `日访问量   ${amount} `
        });
    }
    //更改转换率图表
    changeRate() {
        if (window.innerWidth > 1750) {
            echarts.init(document.getElementById('dllczhl')).setOption({
                series: [{}, { left: '-70%', }, {
                    symbolOffset: ['120%', 100],
                }]
            });
            echarts.init(document.getElementById('pzqlczhl')).setOption({
                series: [{}, { left: '-70%', }, {
                    symbolOffset: ['110%', 60],
                }]
            });

        } else if (window.innerWidth <= 1750 && window.innerWidth > 1420) {
            echarts.init(document.getElementById('dllczhl')).setOption({
                series: [{}, { left: '-68%' }, {
                    symbolOffset: ['110%', 100],
                }]
            });
            echarts.init(document.getElementById('pzqlczhl')).setOption({
                series: [{}, { left: '-68%' }, {
                    symbolOffset: ['105%', 60],
                }]
            });

        } else if (window.innerWidth <= 1420) {
            echarts.init(document.getElementById('dllczhl')).setOption({
                series: [{}, { left: '-65%' }, {
                    symbolOffset: ['100%', 100],
                }]
            });
            echarts.init(document.getElementById('pzqlczhl')).setOption({
                series: [{}, { left: '-65%' }, {
                    symbolOffset: ['100%', 60],
                }]
            });

        }
    }


    //更新图表尺寸
    updateChart() {

        echarts.init(document.getElementById('xcxzcyhl')).resize();
        echarts.init(document.getElementById('xcxzfwl')).resize();
        echarts.init(document.getElementById('wydzfwl')).resize();
        echarts.init(document.getElementById('ffyhl')).resize();
        echarts.init(document.getElementById('yhl')).resize();

        this.changeRate();

        echarts.init(document.getElementById('dllczhl')).resize();
        echarts.init(document.getElementById('pzqlczhl')).resize();

    }

    //筛选时间段
    selectTime(payload, back) {

        let titleWay = (text, number) => ({
            text: `{a|${text}} \n {b|${number}}`,
            top: 22,
            left: 24,
            textStyle: {
                fontFamily: 'MicrosoftYaHei',
                rich: {
                    a: {
                        color: '#616161',
                        fontSize: 16,
                    },
                    b: {
                        color: '#0E0E0E',
                        fontSize: 26,
                        padding: [0, 0, 20, 0],
                    },
                }
            }
        })


        this.props.dispatch({
            type: 'market/actReport',
            payload,
        }).then((res) => {
            if (!res) return;
            this.setState({
                overallData: res
            });
            //小程序总访问量
            this.allPV('xcxzfwl', titleWay('小程序总访问量', res.projectVisits.totalVisitsForApp), 'appletTodayview', res.projectVisits.averageApp, res.projectVisits.visitsListForApp, '#007FFF')
            //网页端总访问量
            this.allPV('wydzfwl', titleWay('网页端总访问量', res.projectVisits.totalVisitsForWeb), 'webTodayview', res.projectVisits.averageWeb, res.projectVisits.visitsListForWeb, '#40C9C6')


            //小程序注册用户量
            echarts.init(document.getElementById('xcxzcyhl')).setOption({
                title: {
                    ...titleWay('小程序注册用户量', res.appUserNum + res.noAccountUserNum)
                },
                legend: {
                    itemWidth: 15,
                    itemHeight: 15,
                    orient: 'vertical',
                    right: '3%',
                    top: '52%',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} <br/> {c}',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                },
                series: [{
                    type: 'pie',
                    radius: ['37%', '55%'],
                    center: ['40%', '60%'],
                    label: {
                        show: false,
                        position: 'center'
                    },
                    data: [
                        { value: res.noAccountUserNum, name: '无账号注册', itemStyle: { color: '#40C9C6' } },
                        { value: res.appUserNum, name: '帐号注册', itemStyle: { color: '#409EFF' } },
                    ]
                }]
            })

            //用户量  
            echarts.init(document.getElementById('yhl')).setOption({
                title: {
                    text: `用户量`,
                    top: 25,
                    left: 33,
                    textStyle: {
                        fontFamily: 'MicrosoftYaHei',
                        color: '#666666',
                        fontSize: 16,
                        fontWeight: 400,
                    }
                },
                yAxis: {
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: '#EAEAEA',
                        }
                    }
                },
                xAxis: {
                    type: 'category',
                    axisLine: {
                        lineStyle: {
                            color: '#BFBFBF'
                        }
                    },
                    axisLabel: {
                        color: '#545454'
                    },
                    axisTick: {
                        alignWithLabel: 'true'
                    },
                    data: this.state.activeSchool === 1 ? Object.keys(res.userNumByAppData) : Object.keys(res.userNumByWebData)
                },
                grid: {
                    left: 70,
                    right: '4%',
                    bottom: 40,
                    top: 70,
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                },
                barMaxWidth: 41,
                series: [{
                    name: '用户量',
                    data: this.state.activeSchool === 1 ? Object.values(res.userNumByAppData) : Object.values(res.userNumByWebData),
                    type: 'bar',
                    itemStyle: { color: '#58AFFF' },
                }]
            });

            let photoData = [
                { value: 0, name: '整页拍照' },
                { value: 0, name: '收集错题' },
                { value: 0, name: '确认提交' },
                { value: 0, name: '错题本' },
                { value: 0, name: '打印错题' },
                { value: 0, name: '预览' },
                { value: 0, name: '下载文件' },
            ], photoRate = [
                { value: 140, percent: '0%' },
                { value: 140, percent: '0%' },
                { value: 140, percent: '0%' },
                { value: 140, percent: '0%' },
                { value: 140, percent: '0%' },
                { value: 140, percent: '0%' }
            ], photoRatio = [
                { name: '整页拍照', percent: '0%' },
                { name: '收集错题', percent: '0%' },
                { name: '确认提交', percent: '0%' },
                { name: '错题本', percent: '0%' },
                { name: '打印错题', percent: '0%' },
                { name: '预览', percent: '0%' },
                { name: '下载文件', percent: '0%' },
            ];

            res.photoConversionRate.map((item, i) => {
                photoData[i].value = item.num;
                if (i !== 0) { photoRate[i].percent = `${Math.round(item.rate * 100)}%` };
                photoRatio[i].percent = `${Math.round(item.ratio * 100)}%`;
            });

            //拍照全流程转化率
            echarts.init(document.getElementById('pzqlczhl')).setOption({
                title: {
                    text: `拍照全流程转化率`,
                    top: 26,
                    left: 33,
                    textStyle: {
                        fontFamily: 'MicrosoftYaHei',
                        color: '#252525',
                        fontSize: 16,
                        fontWeight: 400
                    }
                },
                color: ['#45A6F5', '#2EC7C9', '#FFA63A', '#FFCA40', '#67BB6B', '#F7726A', '#60B2F7'],
                xAxis: {
                    show: false,
                },
                yAxis: {
                    show: false,
                    type: 'category',
                    inverse: true,
                    min: 0,
                    max: 6,
                },
                series: [{
                    type: 'funnel',
                    minSize: 90,
                    maxSize: '70%',
                    left: '4%',
                    top: 100,
                    bottom: 50,
                    gap: 2,
                    label: {
                        position: 'inside',
                        fontFamily: 'Microsoft YaHei',
                        fontSize: 16,
                        color: '#fff',
                        formatter: '{b}{xx|}\n{c}',
                        rich: {
                            xx: {
                                padding: [6, 0]
                            }
                        }
                    },
                    data: photoData
                }, {
                    type: 'funnel',
                    minSize: 80,
                    maxSize: 80,
                    top: 100,
                    bottom: 50,
                    left: '-70%',
                    gap: 2,
                    label: {
                        position: 'insideLeft',
                        fontFamily: 'Microsoft YaHei',
                        fontSize: 14,
                        color: '#545454',

                        formatter: function (d) {
                            if (d.data.name === '整页拍照') { return ' ' }
                            var ins = `{s|${d.data.name}}\n` + `{x|${d.data.percent}}`;
                            return ins
                        },
                        rich: {
                            s: {
                                fontSize: 14,
                                color: '#545454',
                                padding: [5, 0, 12, 0]
                            },
                            x: {
                                fontSize: 16,
                                color: '#545454',
                                fontWeight: 'bold'
                            }
                        }

                    },
                    itemStyle: {
                        color: 'transparent',
                        borderWidth: 0,
                    },
                    data: photoRatio
                }, {
                    type: 'pictorialBar',
                    symbol: 'image://http://homework.mizholdings.com/kacha/kcsj/8351c72ed86c1a0c/.png',
                    symbolSize: ['45%', 58],
                    z: 1,
                    symbolOffset: ['110%', 60],
                    label: {
                        show: true,
                        position: 'right',
                        offset: [15, 60],
                        align: 'center',
                        backgroundColor: 'rgba(249,249,249,1)',
                        width: 106,
                        height: 60,
                        fontStyle: 'Microsoft YaHei',
                        formatter: function (d) {
                            var ins = '{s|转换率}\n' + `{x|${d.data.percent}}`;
                            return ins
                        },
                        rich: {
                            s: {
                                fontSize: 14,
                                color: '#545454',
                                padding: [5, 0, 12, 0]
                            },
                            x: {
                                fontSize: 16,
                                color: '#121212'
                            }
                        }
                    },
                    data: photoRate
                }]
            });

            let loginData = [
                { value: 0, name: '输入子女账号' },
                { value: 0, name: '确认子女信息' },
                { value: 0, name: '进入首页' },
                { value: 0, name: '其他操作' },
            ], loginRate = [
                { value: 100, percent: '0%' },
                { value: 100, percent: '0%' },
                { value: 100, percent: '0%' }
            ], loginRatio = [
                { name: '输入子女账号', percent: '0%' },
                { name: '确认子女信息', percent: '0%' },
                { name: '进入首页', percent: '0%' },
                { name: '其他操作', percent: '0%' },
            ];

            res.loginConversionRate.map((item, i) => {
                loginData[i].value = item.num;
                try {
                    if (i !== 0) { loginRate[i].percent = `${Math.round(item.rate * 100)}%`; };
                } catch (e) {
                    console.log(e)
                }
                loginRatio[i].percent = `${Math.round(item.ratio * 100)}%`;


            });
            //登陆流程转化率
            echarts.init(document.getElementById('dllczhl')).setOption({
                title: {
                    text: `登陆流程转化率`,
                    top: 26,
                    left: 33,
                    textStyle: {
                        fontFamily: 'MicrosoftYaHei',
                        color: '#252525',
                        fontSize: 16,
                        fontWeight: 400
                    }
                },
                color: ['#45A6F5', '#2EC7C9', '#FFA63A', '#67BB6B'],
                xAxis: {
                    show: false,
                },
                yAxis: {
                    show: false,
                    type: 'category',
                    inverse: true,
                    min: 0,
                    max: 3,
                },
                series: [{
                    type: 'funnel',
                    minSize: 90,
                    maxSize: '70%',
                    top: 100,
                    bottom: 50,
                    left: '4%',
                    gap: 2,
                    label: {
                        position: 'inside',
                        fontFamily: 'Microsoft YaHei',
                        fontSize: 16,
                        color: '#fff',
                        formatter: '{b}{xx|}\n{c}',
                        rich: {
                            xx: {
                                padding: [6, 0]
                            }
                        }
                    },
                    data: loginData
                }, {
                    type: 'funnel',
                    minSize: 80,
                    maxSize: 80,
                    top: 100,
                    bottom: 50,
                    left: '-70%',
                    gap: 2,
                    label: {
                        position: 'insideLeft',
                        fontFamily: 'Microsoft YaHei',
                        fontSize: 14,
                        color: '#545454',
                        formatter: function (d) {
                            if (d.data.name === '输入子女账号') { return ' ' }
                            var ins = `{s|${d.data.name}}\n` + `{x|${d.data.percent}}`;
                            return ins
                        },
                        rich: {
                            s: {
                                fontSize: 14,
                                color: '#545454',
                                padding: [5, 0, 12, 0]
                            },
                            x: {
                                fontSize: 16,
                                color: '#545454',
                                fontWeight: 'bold'
                            }
                        }

                    },
                    itemStyle: {
                        color: 'transparent',
                        borderWidth: 0,
                    },
                    data: loginRatio
                }, {
                    type: 'pictorialBar',
                    symbol: 'image://http://homework.mizholdings.com/kacha/kcsj/c4441948a3293ce1/.png',
                    symbolSize: ['40%', 106],
                    z: 1,
                    symbolOffset: ['120%', 100],
                    label: {
                        show: true,
                        position: 'right',
                        offset: [-30, 100],
                        align: 'center',
                        backgroundColor: 'rgba(249,249,249,1)',
                        width: 106,
                        height: 107,
                        fontStyle: 'Microsoft YaHei',
                        formatter: function (d) {
                            var ins = '{s|转换率}\n' + `{x|${d.data.percent}}`;
                            return ins
                        },
                        rich: {
                            s: {
                                fontSize: 14,
                                color: '#545454',
                                padding: [10, 0, 35, 0]
                            },
                            x: {
                                fontSize: 16,
                                color: '#121212'
                            }
                        }
                    },
                    data: loginRate
                }]
            });

            if (back) {
                back();
            }
        });

    }


    componentDidMount() {

        this.props.dispatch({
            type: 'market/timeStamp',
            payload: { year: (new Date).getFullYear() }
        }).then((res) => {
            this.setState({
                timeArry: res,
                dateStrings: [moment(res[3].startTimeStamp).format("YYYY-MM-DD"), moment(res[3].endTimeStamp).format("YYYY-MM-DD")]
            });
            this.props.dispatch({
                type: 'market/vipReport',
                payload: {
                    timeStamp: res[2].startTimeStamp,
                    periodTime: res[2].periodTime,
                }
            }).then((res) => {
                if (res) {

                    //付费用户量
                    echarts.init(document.getElementById('ffyhl')).setOption({
                        title: {
                            text: `付费用户量`,
                            top: 25,
                            left: 33,
                            textStyle: {
                                fontFamily: 'MicrosoftYaHei',
                                color: '#262626',
                                fontSize: 16,
                                fontWeight: 400
                            }
                        },
                        yAxis: {
                            axisLine: { show: false },
                            axisTick: { show: false },
                            splitLine: {
                                lineStyle: {
                                    type: 'dashed',
                                    color: '#EAEAEA',
                                }
                            }
                        },
                        xAxis: {
                            type: 'category',
                            axisLine: {
                                lineStyle: {
                                    color: '#BFBFBF'
                                }
                            },
                            axisLabel: {
                                color: '#545454'
                            },
                            axisTick: {
                                alignWithLabel: 'true'
                            },
                            data: Object.keys(res)
                        },
                        grid: {
                            left: 63,
                            right: '4%',
                            bottom: 60,
                            top: 140,
                        },
                        tooltip: {
                            trigger: 'axis',
                            backgroundColor: 'rgba(0, 0, 0, 0.4)'
                        },
                        series: [{
                            name: '付费用户量',
                            data: Object.values(res),
                            type: 'line',
                            itemStyle: { color: '#2292EB', borderWidth: 5 },
                            lineStyle: { color: '#2292EB', width: 2 }
                        }]
                    })
                }
            })

            this.selectTime({
                timeStamp: this.state.timeArry[3].startTimeStamp,
                startTime: moment(this.state.timeArry[3].startTimeStamp).format("YYYY-MM-DD"),
                endTime: moment(this.state.timeArry[3].endTimeStamp).format("YYYY-MM-DD"),
                periodTime: 4
            }, () => { this.changeRate() })


            window.addEventListener('resize', this.updateChart.bind(this))

        })
    }

    componentWillUnmount() {
        document.removeEventListener('resize', this.updateChart.bind(this));
    }


}





export default connect((state) => ({}))(dataBackground);