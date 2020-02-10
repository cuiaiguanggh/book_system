import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
    message, Select, Layout, Modal, Button, Icon
} from 'antd';
import style from './workCorrection.less';
import observer from '../../utils/observer'
import CorrectsAmplification from './CorrectsAmplification';

const Option = Select.Option;
const {
    Header, Content, Sider
} = Layout;


function TransitionalImage(props) {
    const [load, setLoad] = useState(0);
    const [newsrc, setNewsrc] = useState(props.src);

    useEffect(() => {
        if (newsrc !== props.src) {
            setNewsrc(props.src)
            setLoad(0)
            props.changeLoad(0)
        }
    });
    return (
        <>
            <div style={load === 0 ? {
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '15%',
            } : { display: 'none' }}>
                <img src={'https://homework.mizholdings.com/kacha/xcx/page/4785173221607424.4758128007628800.1581070647900.jpg'} style={{ width: 100 }} />
            </div>
            <img src={`${newsrc}/rotate/${props.angle}`} style={load === 0 ?
                { visibility: 'hidden' } : {
                    width: '100%',
                    // transform: `rotate(${props.angle}deg)`
                }}
                id='outImg'
                onMouseDown={(e) => { e.preventDefault() }}
                onLoad={() => { setLoad(1); props.changeLoad(1) }} />
        </>
    )
}
class workCorrection extends React.Component {
    constructor(props) {
        super(props);
        this.Ref = ref => {
            this.refDom = ref
        };
        this.state = {
            meismyong: 0,
            phList: [],
            nowPage: 0,
            pitchStuId: '',
            idIndex: 0,
            shuju: '',
            minWidth: 1530,
            nowImgWidth: 900,
            nowIcoWidth: 40,
            topHeight: 'calc(50% - 105px)',
            loading: 0,
            dianji: false,

        }

        observer.addSubscribe('updateList', (array) => {
            //获取的批改结果坐标进行转换
            for (let obj of array) {
                if (obj.markList) {
                    for (let mark of obj.markList) {
                        mark.x = mark.x / 720 * this.state.nowImgWidth + this.state.nowIcoWidth / 2;
                        mark.y = mark.y / 720 * this.state.nowImgWidth + 27 * (this.state.nowIcoWidth / 40);
                    }
                }
            }
            this.setState({
                phList: array
            })
        })
        observer.addSubscribe('updateId', (id, index) => {
            this.setState({
                pitchStuId: id,
                idIndex: index
            })
        })
    }

    //切换班级
    cutClass(value, option) {
        this.props.dispatch({
            type: 'temp/classId',
            payload: value
        });
        this.props.dispatch({
            type: 'temp/className',
            payload: option.props.children
        })
        this.props.dispatch({
            type: 'report/propsPageNum',
            payload: 1
        });
        this.props.dispatch({
            type: 'report/changeMouth',
            payload: 0,
        });
        this.props.dispatch({
            type: 'report/userId',
            payload: '',
        });
        this.props.dispatch({
            type: 'report/knowledgenow',
            payload: []
        });
        //切换批改页面的学科
        this.setState({
            nowPage: 0
        })
        this.props.dispatch({
            type: 'correction/pgSubjectList',
            payload: { classId: value },
        })
    }
    //切换学科
    cutSubject(value, option) {
        this.props.dispatch({
            type: 'correction/subjectId',
            payload: value
        })
        this.setState({
            nowPage: 0
        })
        this.props.dispatch({
            type: 'correction/pgHomeworkList',
            payload: {
                classId: this.props.state.classId,
                subjectId: value,
            },
        })
    }
    //切换作业
    cutWork(value) {
        this.setState({
            nowPage: 0
        })
        this.props.dispatch({
            type: 'correction/pgStudentList',
            payload: {
                classId: this.props.state.classId,
                subjectId: this.props.state.subjectId,
                workDate: value
            }
        })
    }

    //保存批改痕迹的方法
    SaveTrace(nowTopic) {
        let newmarkList = [], angle = nowTopic.angle;
        if (nowTopic.markList && nowTopic.markList.length > 0) {
            for (let obj of nowTopic.markList) {
                newmarkList.push({
                    ...obj,
                    x: obj.x - this.state.nowIcoWidth / 2,
                    y: obj.y - 27 * (this.state.nowIcoWidth / 40),
                })
            }
        }
        this.props.dispatch({
            type: 'correction/pgMarkCommit',
            payload: {
                pageId: nowTopic.pageId,
                width: this.state.nowImgWidth,
                markList: newmarkList,
                angle,
            },
        })
    }

    //切换页码
    cutPagination(nowTopic, i) {
        this.SaveTrace(nowTopic)
        document.getElementById('bigBox').scrollTop = 0;
        this.setState({
            nowPage: i
        })
    }
    //上一题,下一题
    upDown(direction, nowTopic) {
        let page = this.state.nowPage;
        if (direction === 'up') {
            if (page === 0) {
                message.info('已经是第一页')
                return false;
            } else {
                page--;
            }
        }
        if (direction === 'down') {
            if (page === this.state.phList.length - 1) {
                message.info('已经是最后一页')
                return false;
            } else {
                page++;
            }
        }
        this.SaveTrace(nowTopic);
        document.getElementById('bigBox').scrollTop = 0;
        this.setState({
            nowPage: page
        })

    }

    //点击已提交的学生
    clickStu(item, i) {
        this.props.dispatch({
            type: 'correction/pgPages',
            payload: {
                classId: this.props.state.classId,
                subjectId: this.props.state.subjectId,
                workDate: this.props.state.workDate,
                userId: item.userId
            },
        })
        this.setState({
            nowPage: 0,
            pitchStuId: item.userId,
            idIndex: i
        })
        document.getElementById('bigBox').scrollTop = 0
    }


    //下一个学生
    nextStu(studentList) {
        if (this.state.idIndex < studentList.submitted.length - 1) {
            let nowindex = ++this.state.idIndex;
            this.props.dispatch({
                type: 'correction/pgPages',
                payload: {
                    classId: this.props.state.classId,
                    subjectId: this.props.state.subjectId,
                    workDate: this.props.state.workDate,
                    userId: studentList.submitted[nowindex].userId
                },
            })
            this.setState({
                nowPage: 0,
                pitchStuId: studentList.submitted[nowindex].userId,
                idIndex: nowindex
            })
        } else {
            message.info('已经选择到最后一个学生了')
        }
    }


    //点击跳过按钮
    sclickKip(nowTopic, studentList) {
        if (this.state.phList.length > 0) {
            this.SaveTrace(nowTopic)
            this.nextStu(studentList)
        }
    }
    //点击完成按钮
    sclickFinish(nowTopic, studentList, approvedStu) {

        if (approvedStu === studentList.submitted.length) {
            message.success('已全部批改完成')
            return
        }
        let pageIds = [];
        for (let obj of this.state.phList) {
            if (obj.markList && obj.markList.length > 0) {
                pageIds.push(obj.pageId)
            }
        }


        let newmarkList = [], angle = nowTopic.angle
        if (nowTopic.markList && nowTopic.markList.length > 0) {
            for (let obj of nowTopic.markList) {
                newmarkList.push({
                    ...obj,
                    x: obj.x - this.state.nowIcoWidth / 2,
                    y: obj.y - 27 * (this.state.nowIcoWidth / 40),
                })
            }
        }

        this.props.dispatch({
            type: 'correction/pgMarkCommit',
            payload: {
                pageId: nowTopic.pageId,
                width: this.state.nowImgWidth,
                markList: newmarkList,
                angle,
            },
        }).then(() => {
            if (pageIds.length > 0) {
                this.props.dispatch({
                    type: 'correction/pgPageCommit',
                    payload: {
                        pageIds: pageIds,
                    },
                }).then(() => {
                    message.success('提交成功')
                    this.props.dispatch({
                        //更新学生列表
                        type: 'correction/updateStudentList',
                        payload: {
                            classId: this.props.state.classId,
                            subjectId: this.props.state.subjectId,
                            workDate: this.props.state.workDate
                        }
                    })

                })
            }
            //下一个学生
            this.nextStu(studentList)
        })
    }

    //生成批改图标的方法
    generateResults(e, nowTopic) {
        if (this.state.loading === 0) {
            //图片正在加载中，不能操作
            return false
        }
        if (nowTopic.status === 1) {
            //批改过不能修改
            message.warning('此学生作业已完成批改，不可修改')
            return false
        }
        //生成错误图标
        let nowdom = e.currentTarget;
        let x = e.clientX - nowdom.offsetLeft - nowdom.offsetParent.offsetParent.offsetLeft;
        let y = e.clientY - nowdom.offsetTop - nowdom.offsetParent.offsetTop - nowdom.offsetParent.offsetParent.offsetTop + document.getElementById('bigBox').scrollTop;
        //防止在边缘点击造成批改图标在外面
        if (x > nowdom.offsetWidth - this.state.nowIcoWidth - 10 * this.state.nowIcoWidth / 40) {
            x = nowdom.offsetWidth - this.state.nowIcoWidth - 10 * this.state.nowIcoWidth / 40
        } else if (x < this.state.nowIcoWidth / 2 + 30 * this.state.nowIcoWidth / 40) {
            x = this.state.nowIcoWidth / 2 + 30 * this.state.nowIcoWidth / 40
        }
        if (y > nowdom.offsetHeight - 27 * this.state.nowIcoWidth / 40) {
            y = nowdom.offsetHeight - 27 * this.state.nowIcoWidth / 40
        } else if (y < 27 * this.state.nowIcoWidth / 40) {
            y = 27 * this.state.nowIcoWidth / 40

        }


        if (!nowTopic.markList || nowTopic.markList.length === 0 || nowTopic.markList[0].type === 3) {
            //第一次批改或者从打勾开始重新批改
            nowTopic.markList = [{
                x,
                y,
                type: 1
            }];
        } else {
            //已批改过
            nowTopic.markList.push({
                x,
                y,
                type: 1
            });
        }
        this.setState({
            phList: this.state.phList
        })
    }
    //点击错误图标变成半对
    mistakeAlter(e, nowTopic, j) {
        if (nowTopic.status === 1) {
            //批改过不能修改
            return false
        }
        nowTopic.markList[j].type = 2;
        this.setState({
            phList: this.state.phList
        })
        e.stopPropagation();
    }

    //点击半对图标消失
    halfAlter(e, nowTopic, j) {
        if (nowTopic.status === 1) {
            //批改过不能修改
            return false
        }
        nowTopic.markList.splice(j, 1);
        this.setState({
            phList: this.state.phList
        })
        e.stopPropagation();
    }

    //点击放大批改
    clickMagnify(nowTopic) {
        if (this.state.loading === 0) {
            //图片正在加载中，不能操作
            return false
        }
        let tup = document.getElementById('outImg')
        let proportion = document.body.clientHeight / tup.height;
        let suzu = []
        //获取的批改结果坐标进行转换
        if (nowTopic.markList && nowTopic.markList.length > 0 && nowTopic.markList.type !== 3) {
            for (let obj of nowTopic.markList) {
                suzu.push({
                    ...obj,
                    x: obj.x * proportion,
                    y: obj.y * proportion,
                })
            }
        } else {
            suzu = nowTopic.markList
        }
        this.setState({
            shuju: {
                ...nowTopic,
                markList: suzu,
            },
            proportion
        })
    }
    //点击旋转
    clickRotate(nowTopic) {
        if (this.state.loading === 0) {
            //图片正在加载中，不能操作
            return false
        }
        if (nowTopic.status === 1) {
            message.info('已批改过，不能旋转')
            return false
        }
        let that = this;
        if (nowTopic.markList && nowTopic.markList.length > 0) {
            Modal.confirm({
                title: '已有批改痕迹，旋转将清空当前批改痕迹',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    if (nowTopic.angle < 360) {
                        nowTopic.angle += 90
                    } else if (nowTopic.angle === 360) {
                        nowTopic.angle = 90
                    }
                    nowTopic.markList = [];
                    that.setState({
                        phList: that.state.phList
                    })
                }
            });
        } else {
            if (nowTopic.angle < 360) {
                nowTopic.angle += 90
            } else if (nowTopic.angle === 360) {
                nowTopic.angle = 90
            }
            nowTopic.markList = [];
            this.setState({
                phList: this.state.phList
            })
        }

    }

    render() {
        let classList = this.props.state.classList1;
        let className = this.props.state.className;
        let subjectList = this.props.state.subjectList;
        let homeworkList = this.props.state.homeworkList;
        let studentList = this.props.state.studentList;
        //已批学生数
        let approvedStu = 0;
        for (let obj of studentList.submitted) {
            if (obj.corrected === 1) {
                approvedStu++;
            }
        }
        //已批题目数
        let approvedTopic = 0;
        //当前学生的所有错题数
        // let currentAll = 0;
        for (let obj of this.state.phList) {
            if (obj.markList && obj.markList.length) {
                approvedTopic++;
                // if (obj.markList[0].type !== 3) {
                //     currentAll += obj.markList.length
                // }
            }
        }

        //当前页码题目
        let nowTopic = this.state.phList.length > 0 && this.state.phList[this.state.nowPage];


        //不显示1，全对2，优秀3，需要努力4
        let remark = 1;
        if (nowTopic.status === 1 && !nowTopic.markList || (nowTopic.markList && nowTopic.markList.length > 0 && nowTopic.markList[0].type === 3)) {
            remark = 2
        } else if (nowTopic.markList && nowTopic.markList.length === 1 && nowTopic.markList[0].type !== 3) {
            remark = 3
        } else if (nowTopic.markList && nowTopic.markList.length > 0) {
            remark = 4
        }
        //未提交的最大高度
        if (document.getElementById('uncommittedTop')) {
            this.state.topHeight = `calc(100% - ${document.getElementById('uncommittedTop') && document.getElementById('uncommittedTop').offsetTop}px - 20px)`

        }

        return (
            <Content style={{ minHeight: 280, overflow: 'hidden', overflowX: 'auto', position: 'relative' }}>
                <Layout className={style.layout}>
                    <Header style={{ background: '#a3b0c3', height: '50px', padding: 0, minWidth: this.state.minWidth }}>
                        <div style={{ height: '50px', lineHeight: '50px', background: 'rgba(198,206,218,1)' }}>
                            {classList.data && classList.data.length > 0 && className != '' &&
                                <Select style={{ width: 150, margin: '0 20px' }}
                                    placeholder="班级"
                                    value={this.props.state.classId}
                                    optionFilterProp="children"
                                    onChange={(value, option) => { this.cutClass(value, option) }}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                                    {classList.data.map((item, i) => (
                                        <Option key={i} value={item.classId}>{item.className}</Option>
                                    ))}
                                </Select>
                            }
                            {subjectList.length > 0 &&
                                <Select style={{ width: 150, margin: '0 20px 0 0' }}
                                    showSearch
                                    placeholder="学科"
                                    value={this.props.state.subjectId}
                                    optionFilterProp="children"
                                    onChange={(value) => { this.cutSubject(value) }}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                                    {subjectList.map((item, i) => (
                                        <Option key={i} value={item.v}>{item.k}</Option>
                                    ))}
                                </Select>
                            }
                            {homeworkList.length > 0 &&
                                <Select style={{ width: 150, margin: '0 20px 0 0' }}
                                    showSearch
                                    placeholder="作业"
                                    optionFilterProp="children"
                                    value={this.props.state.workDate}
                                    onChange={(value) => { this.cutWork(value) }}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                                    {homeworkList.map((item, i) => (
                                        <Option key={item} value={item}>{item}</Option>
                                    ))}
                                </Select>
                            }
                        </div>
                    </Header>
                    <Layout className={style.innerOut} style={{ minWidth: this.state.minWidth }}>
                        <Sider className={style.left}>

                            <div className={style.dataDisplay}>
                                <div>已批：<span style={{ color: '#409EFF' }}>{approvedStu}/{studentList.submitted.length}人</span></div>
                            </div>
                            <div className={style.leftTop} >
                                <img src={require('../images/greenSubmit.png')} />
                                <span className={style.text}>
                                    已提交学生（{studentList.submitted.length}）
                                  </span>
                            </div>
                            <div style={{ overflow: 'auto', maxHeight: 'calc(50% - 105px)' }}>
                                {studentList.submitted.map((item, i) => (
                                    item.commited === 1 &&
                                    <div key={i} onClick={() => { this.clickStu(item, i) }}
                                        className={this.state.pitchStuId == item.userId ? `${style.stu} ${style.pitch} ${style.xuanzhong}` :
                                            `${item.corrected === 1 ? `${style.stu} ${style.pitch} ${style.already}` : `${style.stu} ${style.pitch}`}`} >
                                        <span style={{ float: 'left' }}>{item.name}</span>
                                        <span style={{ float: 'right' }}>错{item.wrongNum}题</span>
                                    </div>
                                ))}
                            </div>
                            <div className={style.leftTop} id='uncommittedTop'>
                                <img src={require('../images/orangeSubmit.png')} />
                                <span className={style.text} >
                                    未提交<span className={style.remind} onClick={() => {
                                        //限制连续点击
                                        if (this.state.dianji) {
                                            setTimeout(() => {
                                                this.setState({
                                                    dianji: false
                                                })
                                            }, 180000);
                                            message.info('请勿重复点击，请三分钟后再试')
                                            return;
                                        }
                                        this.setState({
                                            dianji: true
                                        })
                                        if (studentList.uncommitted.length === 0) {
                                            message.info('学生已经全部提交')
                                            return false;
                                        }
                                        let userId = [];
                                        for (let obj of studentList.uncommitted) {
                                            userId.push(obj.userId)
                                        }
                                        this.props.dispatch({
                                            type: 'correction/remind',
                                            payload: {
                                                classId: this.props.state.classId,
                                                subjectId: this.props.state.subjectId,
                                                workDate: this.props.state.workDate,
                                                userId
                                            }
                                        })
                                    }}>一键提醒</span>
                                </span>
                            </div>
                            <div style={{ overflow: 'auto', maxHeight: `${this.state.topHeight}` }}>
                                {studentList.uncommitted.map((item, i) => (
                                    item.commited === 0 && <div key={i} className={style.stu}> {item.name} </div>
                                ))}
                            </div>

                        </Sider>
                        <div className={style.correction} >
                            <div className={style.checkPicture} style={{ width: `${this.state.nowImgWidth + 55}px` }} id='bigBox'>
                                {nowTopic ? <>
                                    {nowTopic.markList && nowTopic.markList.length > 0 && nowTopic.markList[0].type !== 3 ?
                                        <div className={style.cuo}>
                                            <span style={{ paddingLeft: '18%' }}> 【错误】：{nowTopic.markList.length}题  </span>

                                            <img src={require('../images/fangda.png')} className={style.fangda} onClick={(e) => { this.clickMagnify(nowTopic) }} />
                                            <img src={require('../images/rotate.png')} className={style.fangda} onClick={(e) => { this.clickRotate(nowTopic) }} />

                                            <div className={style.allTrue} >✔全对</div>
                                        </div>
                                        :
                                        <div className={style.dui} >
                                            <span style={{ paddingLeft: '18%' }}> 【错误】：0 题  </span>
                                            <img src={require('../images/fangda.png')} className={style.fangda} onClick={(e) => { this.clickMagnify(nowTopic) }} />
                                            <img src={require('../images/rotate.png')} className={style.fangda} onClick={(e) => { this.clickRotate(nowTopic) }} />

                                            <div className={style.allTrue} style={{
                                                background: '#13ce66',
                                                cursor: 'pointer',
                                            }} onClick={(e) => {
                                                nowTopic.markList = [{ type: 3 }];
                                                this.setState({
                                                    phList: this.state.phList
                                                });
                                                e.stopPropagation()
                                            }}>✔全对</div>
                                        </div>
                                    }
                                    <div style={{
                                        display: 'flex',
                                        position: 'absolute',
                                        justifyContent: ' space-between',
                                        width: this.state.nowImgWidth,
                                        height: '100%',
                                        alignItems: 'center',
                                    }}>
                                        <img src={require('../images/leftCut.png')} style={{
                                            zIndex: 20, cursor: 'pointer'
                                        }} onClick={() => { this.upDown('up', nowTopic) }} />
                                        <img src={require('../images/rightCut.png')} style={{
                                            zIndex: 20, cursor: 'pointer'
                                        }} onClick={() => { this.upDown('down', nowTopic) }} />
                                    </div>
                                    <div className={style.nowImg} style={{ width: '100%', }} onClick={(e) => { this.generateResults(e, nowTopic) }}>
                                        {this.state.loading === 1 && nowTopic.markList && nowTopic.markList.length > 0 && nowTopic.markList[0].type !== 3 && nowTopic.markList.map((item, j) => {
                                            return (<div key={j}>
                                                {item.type === 1 ?
                                                    <img src={require('../images/cuowu.png')} className={style.checkCuo} style={{ top: item.y, left: item.x, width: this.state.nowIcoWidth, }}
                                                        onClick={(e) => {
                                                            //点击错误图标时，更改为半对
                                                            this.mistakeAlter(e, nowTopic, j)
                                                        }} /> :
                                                    <img src={require('../images/bandui.png')} className={style.checkDui} style={{ top: item.y, left: item.x, width: `${this.state.nowIcoWidth / 40 * 100}px`, }}
                                                        onClick={(e) => {
                                                            //点击半对图标时，图标消失
                                                            this.halfAlter(e, nowTopic, j)
                                                        }} />}
                                            </div>)
                                        })}

                                        <TransitionalImage
                                            angle={nowTopic.angle}
                                            src={`${nowTopic.pageUrl}/thumbnail/1000x/interlace/1`}
                                            changeLoad={(value) => {
                                                this.setState({
                                                    loading: value
                                                })
                                            }} />
                                        {/* <img src={`${nowTopic.pageUrl}/thumbnail/1000x/interlace/1`} style={{ width: '100%' }} id='outImg'
                                            onMouseDown={(e) => { e.preventDefault() }}
                                            onLoad={() => { console.log(111) }} /> */}

                                        {remark === 2 && this.state.loading === 1 && <>
                                            <img src={'http://homework.mizholdings.com/kacha/kcsj/4f6cc398fe2b0168/.png'} className={style.verygood} style={{ width: `${this.state.nowIcoWidth / 40 * 125}px` }} />
                                            <img src={'http://homework.mizholdings.com/kacha/kcsj/d4ceb3ed3044a742/.png'} className={style.dagou} style={{ width: `${this.state.nowIcoWidth / 40 * 460}px` }} /> </>}
                                        {remark === 3 && this.state.loading === 1 && <img src={'http://homework.mizholdings.com/kacha/kcsj/7ad9942284f399fd/.png'} className={style.try} style={{ width: `${this.state.nowIcoWidth / 40 * 125}px` }} />}
                                        {remark === 4 && this.state.loading === 1 && <img src={'http://homework.mizholdings.com/kacha/kcsj/8b84a6068e65b2e2/.png'} className={style.try} style={{ width: `${this.state.nowIcoWidth / 40 * 125}px` }} />}

                                    </div>
                                    {this.state.shuju !== '' && <CorrectsAmplification
                                        shuju={this.state.shuju}
                                        angle={nowTopic.angle}
                                        nowImgWidth={this.state.nowImgWidth}
                                        remark={remark}
                                        proportion={this.state.proportion}
                                        nowIcoWidth={this.state.nowIcoWidth * this.state.proportion}
                                        guanbi={(data) => {
                                            nowTopic.markList = data.markList;
                                            this.setState({
                                                shuju: '',
                                            })
                                        }} />}
                                </> : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', }}>
                                        <div>
                                            <img src={require('../images/noWork.png')} />
                                            <p style={{
                                                fontSize: 16,
                                                color: 'rgba(118, 118, 118, 1)',
                                                margin: '10px 0 0 -5px',
                                            }}>暂无作业</p>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className={style.pagination}>
                            <span className={style.text}> 页码</span>
                            {this.state.phList.map((item, i) => {
                                return (!item.markList && item.status === 0) || (item.markList && item.markList.length === 0) ?
                                    <span key={i} className={this.state.nowPage === i ? `${style.number} ${style.current}` : `${style.number}`}
                                        onClick={() => { this.cutPagination(nowTopic, i) }}> {i + 1}</span> :
                                    <span key={i} className={this.state.nowPage === i ? `${style.number}  ${style.finish} ${style.current}` : `${style.number}  ${style.finish} `}
                                        onClick={() => { this.cutPagination(nowTopic, i) }}> {i + 1}</span>
                            })}
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            marginLeft: 20,
                        }}>
                            <div className={style.gifBox} style={localStorage.getItem('dongtu') ? { visibility: 'hidden' } : { visibility: 'visible' }}>
                                <img src={'https://homework.mizholdings.com/kacha/xcx/page/4785173221607424.4758128007628800.1581070206200.jpg'} style={{ width: 250, height: 202 }} />
                                <p style={{ margin: 14 }}>单击图片任意位置可判错，单击<span style={{ color: '#e76f64' }}>✖</span>更改为半对，再次单击取消批改结果</p>
                                <div className={style.guanbi} onClick={() => {
                                    localStorage.setItem('dongtu', true)
                                    this.setState({
                                        meismyong: 1
                                    })
                                }}>
                                    关闭
                                </div>
                            </div>
                            <div className={style.anniu}>
                                <div className={style.tiaoguo} onClick={() => { this.sclickKip(nowTopic, studentList) }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                                        <span>跳过</span>
                                        <span style={{ fontSize: 14 }}>暂不批改</span>
                                    </div>
                                </div>
                                <div className={style.wancheng} onClick={() => {
                                    let that = this;
                                    if (approvedTopic === this.state.phList.length) {
                                        that.sclickFinish(nowTopic, studentList, approvedStu)
                                    } else {
                                        Modal.confirm({
                                            title: '还有页面未批改，是否完成批改',
                                            okText: '确认',
                                            cancelText: '取消',
                                            onOk() {
                                                that.sclickFinish(nowTopic, studentList, approvedStu)
                                            }
                                        });
                                    }

                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span>{approvedTopic}/{this.state.phList.length}</span>
                                        <span>完成</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Layout>

                </Layout >
            </Content >
        )

    }
    componentDidMount() {
        //根据显示器不同分辨率显示不同情况
        if (window.screen.availWidth === 1920) {
            this.setState({
                minWidth: 1530,
                nowImgWidth: 900,
                nowIcoWidth: 40,
            })
        } else if (window.screen.availWidth < 1920 && window.screen.availWidth >= 1600) {
            this.setState({
                minWidth: 1400,
                nowImgWidth: 700,
                nowIcoWidth: 31,
            })
        } else if (window.screen.availWidth < 1600) {
            this.setState({
                minWidth: 1100,
                nowImgWidth: 480,
                nowIcoWidth: 21,
            })
        }

        this.props.dispatch({
            type: 'correction/pgSubjectList',
            payload: { classId: this.props.state.classId },
        });

    }

}
export default connect((state) => ({
    state: {
        classList1: state.temp.classList1,
        className: state.temp.className,
        classId: state.temp.classId,
        ...state.correction
    }
}))(workCorrection);