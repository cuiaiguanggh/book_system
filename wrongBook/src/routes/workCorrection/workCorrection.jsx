import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
    message, Select, Layout, Modal, Button, Icon
} from 'antd';
import style from './workCorrection.less';
import observer from '../../utils/observer'
import CorrectsAmplification from './CorrectsAmplification';
import SiderNavigation from './SiderNavigation';
import Complete from './Complete';
import TransitionalImage from './TransitionalImage';

const Option = Select.Option;
const {
    Header, Content, Sider
} = Layout;



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
            pitchStuName: '',
            idIndex: 0,
            shuju: '',
            minWidth: 1530,
            nowImgWidth: 900,
            nowIcoWidth: 40,
            loading: 0,
            present: 1,
            reminder: false,
            checkinwho: 0
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
        observer.addSubscribe('updateId', (id, index, name, checkinwho) => {
            this.setState({
                pitchStuId: id,
                pitchStuName: name,
                idIndex: index,
                checkinwho
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
        if (document.getElementById('bigBox')) {
            document.getElementById('bigBox').scrollTop = 0;
        }
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
        if (document.getElementById('bigBox')) {
            document.getElementById('bigBox').scrollTop = 0;
        }
        this.setState({
            nowPage: page
        })

    }

    //点击已提交的学生
    clickStu(item, i) {
        this.props.dispatch({
            type: 'correction/isCorrected',
            payload: 0
        })
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
            pitchStuName: item.name,
            idIndex: i
        })

        if (document.getElementById('bigBox')) {
            document.getElementById('bigBox').scrollTop = 0;
        }
    }


    //下一个学生
    nextStu(uncheck, checked) {

        //在待批改学生中时
        if (this.state.checkinwho === 0) {
            let nowindex = this.state.idIndex;
            if (nowindex < uncheck.length - 1) {
                nowindex++
            } else if (nowindex === uncheck.length - 1 && uncheck.length > 1) {
                nowindex = 0;
            } else {
                message.info('已经选择到最后一个学生了')
                return;
            }
            this.props.dispatch({
                type: 'correction/pgPages',
                payload: {
                    classId: this.props.state.classId,
                    subjectId: this.props.state.subjectId,
                    workDate: this.props.state.workDate,
                    userId: uncheck[nowindex].userId
                },
            })
            this.setState({
                nowPage: 0,
                pitchStuId: uncheck[nowindex].userId,
                pitchStuName: uncheck[nowindex].name,
                idIndex: nowindex
            })

        } else {
            //在已批改学生中时
            if (this.state.idIndex < checked.length - 1) {
                let nowindex = ++this.state.idIndex;
                this.props.dispatch({
                    type: 'correction/pgPages',
                    payload: {
                        classId: this.props.state.classId,
                        subjectId: this.props.state.subjectId,
                        workDate: this.props.state.workDate,
                        userId: checked[nowindex].userId
                    },
                })
                this.setState({
                    nowPage: 0,
                    pitchStuId: checked[nowindex].userId,
                    pitchStuName: checked[nowindex].name,
                    idIndex: nowindex
                })
            } else {
                message.info('已经选择到最后一个学生了')
            }


        }

    }

    //点击跳过按钮
    sclickKip(nowTopic, uncheck, checked) {
        if (this.state.phList.length > 0) {
            this.SaveTrace(nowTopic)
            this.nextStu(uncheck, checked)
        }
    }
    //点击完成按钮
    sclickFinish(nowTopic, studentList, uncheck, checked) {
        if (studentList.submitted.length === 0 && studentList.uncommitted.length === 0) {
            message.info('暂无作业')
            return;
        }
        if (checked.length === studentList.submitted.length) {
            message.success('已全部批改完成')
            return;
        }
        let pageIds = [];
        for (let obj of this.state.phList) {
            if (obj.markList && obj.markList.length > 0) {
                pageIds.push(obj.pageId)
            }
        }
        //上传批改痕迹
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
            this.nextStu(uncheck, checked)
        });

        //这个学生，所有题目都批改完成，提醒学生
        let panduan = true;
        for (let obj of this.state.phList) {
            if (obj.status === 0 && (!obj.markList || obj.markList.length === 0)) {
                panduan = false;
                break;
            }
        }
        if (panduan) {
            this.props.dispatch({
                type: 'correction/check',
                payload: {
                    subjectId: this.props.state.subjectId,
                    userId: this.state.pitchStuId
                }
            })
        }


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
        let classList = this.props.state.classList1,
            className = this.props.state.className,
            subjectList = this.props.state.subjectList,
            homeworkList = this.props.state.homeworkList,
            studentList = this.props.state.studentList,
            //总错题数    
            allcuoti = 0,
            //已批改学生
            checked = [],
            //待批改
            uncheck = [];
        for (let obj of studentList.submitted) {
            if (obj.corrected === 1) {
                checked.push(obj)
            } else {
                uncheck.push(obj)
            }
            if (this.props.state.isCorrected === 1) {
                allcuoti += obj.wrongNum
            }
        }

        //已批题目数
        let approvedTopic = 0;
        //当前学生的所有错题数
        for (let obj of this.state.phList) {
            if (obj.markList && obj.markList.length) {
                approvedTopic++;
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


        return (
            <Content style={{ minHeight: 700, overflow: 'hidden', overflowX: 'auto', position: 'relative' }}>
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

                        <SiderNavigation
                            checked={checked}
                            uncheck={uncheck}
                            studentList={studentList}
                            present={this.state.present}
                            pitchStuId={this.state.pitchStuId}
                            clickStu={(item, i) => { this.clickStu(item, i) }}
                            checkinwho={(value) => {
                                this.setState({
                                    checkinwho: value
                                })
                            }}
                            changePresent={(value) => {
                                this.setState({
                                    present: value
                                })
                            }}
                        />

                        <div className={style.correction} >
                            {this.props.state.isCorrected === 1 && nowTopic ?
                                <Complete
                                    nowImgWidth={this.state.nowImgWidth}
                                    approvedStu={checked.length}
                                    average={Math.round(allcuoti / studentList.submitted.length)}
                                    clickButton={() => {
                                        this.props.dispatch({
                                            type: 'correction/isCorrected',
                                            payload: 0
                                        })
                                        this.setState({
                                            present: 1
                                        })
                                    }}
                                /> :
                                <div className={style.checkPicture} style={{ width: `${this.state.nowImgWidth + 15}px` }} id='bigBox'>
                                    {nowTopic ? <>
                                        <div className={style.imgtop}>
                                            <div style={{ float: 'left', marginLeft: 20 }}>
                                                <span style={this.state.minWidth === 1100 ? {
                                                    maxWidth: 125,
                                                    float: 'left',
                                                    marginRight: 5,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                } : { marginRight: 20 }}>{this.state.pitchStuName}</span>
                                                {nowTopic.markList && nowTopic.markList.length > 0 && nowTopic.markList[0].type !== 3 &&
                                                    <span style={{ color: '#F56C6C' }}> 错误：{nowTopic.markList.length}题</span>
                                                }
                                                {nowTopic.markList && nowTopic.markList.length > 0 && nowTopic.markList[0].type === 3 &&
                                                    <span style={{ color: '#13CE66' }}> 全部正确</span>
                                                }
                                            </div>
                                            {nowTopic.markList && nowTopic.markList.length > 0 && nowTopic.markList[0].type !== 3 ?
                                                <div className={style.allTrue} >✔全对</div> :
                                                <div className={style.allTrue} style={{ background: '#13ce66', cursor: 'pointer' }}
                                                    onClick={(e) => {
                                                        if (this.state.loading === 0) {
                                                            //图片正在加载中，不能操作
                                                            return false
                                                        }
                                                        nowTopic.markList = [{ type: 3 }];
                                                        this.setState({
                                                            phList: this.state.phList
                                                        })
                                                        e.stopPropagation();
                                                    }}>✔全对</div>
                                            }
                                            <span className={style.fangda} onClick={(e) => { this.clickMagnify(nowTopic) }}></span>
                                            <span className={style.xuanzhuang} onClick={(e) => { this.clickRotate(nowTopic) }}></span>
                                            <span className={style.rightCut} onClick={() => { this.upDown('down', nowTopic) }}></span>
                                            <span className={style.leftCut} onClick={(e) => { this.upDown('up', nowTopic) }}></span>

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
                                    </> : <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10%' }}>
                                            <div>
                                                <img src={'http://homework.mizholdings.com/kacha/kcsj/65eca522d826abf1/.png'} />
                                                <p style={{
                                                    fontSize: 16,
                                                    color: 'rgba(118, 118, 118, 1)',
                                                    marginTop: 10,
                                                    textAlign: 'center'
                                                }}>暂无作业</p>
                                            </div>
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                        <div className={style.pagination} style={this.props.state.isCorrected === 1 ? { visibility: 'hidden' } : { visibility: 'visible' }}>
                            <span className={style.text}> 页码</span>
                            {this.state.phList.map((item, i) => {
                                return (!item.markList && item.status === 0) || (item.markList && item.markList.length === 0) ?
                                    <span key={i} className={this.state.nowPage === i ? `${style.number} ${style.current}` : `${style.number}`}
                                        onClick={() => { this.cutPagination(nowTopic, i) }}> {i + 1}</span> :
                                    <span key={i} className={this.state.nowPage === i ? `${style.number}  ${style.finish} ${style.current}` : `${style.number}  ${style.finish} `}
                                        onClick={() => { this.cutPagination(nowTopic, i) }}> {i + 1}</span>
                            })}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginLeft: 20, }}>
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
                                <div className={style.tishi} onClick={() => {
                                    this.setState({
                                        reminder: true
                                    })
                                }}>?
                                        <div style={this.state.reminder ? { display: 'block' } : { display: 'none' }}>
                                        <div className={style.triangle}></div>
                                        <div className={style.howdoit}>
                                            <div className={style.howtitle}>如何批改作业</div>
                                            鼠标左键单击作业错题，可判错误；再次单击错号，更改为半对错；第三次单击半对错，取消批改痕迹；依次循环；点击<span style={{ color: '#4B8EFF' }}>【跳过 暂不批改】</span>，
                                本作业页面不批改，再次进入仍可继续批改；所有页面全部批完（不含跳过页），点击 <span style={{ color: '#4B8EFF' }}>【完成】</span>，可自动切换至下一学生的作业.
                                                <div className={style.howbutton} onClick={(e) => {
                                                this.setState({
                                                    reminder: false
                                                })
                                                e.stopPropagation();
                                            }}>我知道了</div>
                                        </div>
                                    </div>
                                </div>

                                <div className={style.tiaoguo} onClick={() => { this.sclickKip(nowTopic, uncheck, checked) }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                                        <span>跳过</span>
                                        <span style={{ fontSize: 14 }}>暂不批改</span>
                                    </div>
                                </div>
                                <div className={style.wancheng} onClick={() => {
                                    let that = this;
                                    if (approvedTopic === this.state.phList.length) {
                                        that.sclickFinish(nowTopic, studentList, uncheck, checked)
                                    } else {
                                        Modal.confirm({
                                            title: '还有页面未批改，是否完成批改',
                                            okText: '确认',
                                            cancelText: '取消',
                                            onOk() {
                                                that.sclickFinish(nowTopic, studentList, uncheck, checked)
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
                nowImgWidth: 940,
                nowIcoWidth: 40,
            })
        } else if (window.screen.availWidth < 1920 && window.screen.availWidth >= 1600) {
            this.setState({
                minWidth: 1400,
                nowImgWidth: 740,
                nowIcoWidth: 31,
            })
        } else if (window.screen.availWidth < 1600) {
            this.setState({
                minWidth: 1100,
                nowImgWidth: 520,
                nowIcoWidth: 21,
            })
        }
        if (this.props.state.classId !== '') {
            this.props.dispatch({
                type: 'correction/pgSubjectList',
                payload: { classId: this.props.state.classId },
            });
        }

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