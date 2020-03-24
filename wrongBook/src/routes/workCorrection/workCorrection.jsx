import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
    message, Select, Layout, Modal, Button, Icon
} from 'antd';
import style from './workCorrection.less';
import observer from '../../utils/observer'
import SiderNavigation from './SiderNavigation';
import Complete from './Complete';
import MarkedArea from './MarkedArea';
// import Appraise from './Appraise';
import CompleteCorrections from './CompleteCorrections';


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
            agoPage: -1,
            pitchStuId: '',
            pitchStuName: '',
            pitchCorrected: 0,
            idIndex: 0,
            minWidth: 1635,
            nowImgWidth: 940,
            nowIcoWidth: 40,
            present: 1,
            reminder: false,
            checkinwho: 0,
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
                if (obj.supMarkList) {
                    for (let sup of obj.supMarkList) {
                        sup.x = sup.x / 720 * this.state.nowImgWidth;
                        sup.y = sup.y / 720 * this.state.nowImgWidth;
                        sup.width = sup.width / 720 * this.state.nowImgWidth;
                        sup.height = sup.height / 720 * this.state.nowImgWidth;

                    }
                }
                if (obj.contentMarkList) {
                    for (let content of obj.contentMarkList) {
                        content.x = content.x / 720 * this.state.nowImgWidth;
                        content.y = content.y / 720 * this.state.nowImgWidth;
                        content.width = content.width / 720 * this.state.nowImgWidth;
                        content.height = content.height / 720 * this.state.nowImgWidth;
                    }
                }
            }
            this.setState({
                phList: array
            })
        })
        observer.addSubscribe('updateId', (id, name, checkinwho, corrected) => {
            this.setState({
                pitchStuId: id,
                pitchStuName: name,
                idIndex: 0,
                checkinwho,
                pitchCorrected: corrected
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
        this.props.dispatch({
            type: 'correction/subjectName',
            payload: option.props.children
        })

        this.setState({
            nowPage: 0,
            agoPage: -1
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
            nowPage: 0,
            agoPage: -1
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
            agoPage: -1,
            pitchStuId: item.userId,
            pitchStuName: item.name,
            idIndex: i,
            pitchCorrected: item.corrected,
        })
        document.getElementById('markedArea').scrollTop = 0;
        document.getElementById('pagination').scrollTop = 0;

    }


    //下一个学生
    nextStu(uncheck, checked) {
        //在待批改学生中时
        let nowindex = this.state.idIndex;
        if (this.state.checkinwho === 0) {
            if (nowindex === uncheck.length - 1) {
                nowindex = 0;
                this.setState({
                    idIndex: 0,
                })
            } else if (nowindex < uncheck.length - 1) {
                nowindex++;
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
                agoPage: -1,
                pitchStuId: uncheck[nowindex].userId,
                pitchStuName: uncheck[nowindex].name,
                pitchCorrected: uncheck[nowindex].corrected,
            })



        } else {
            //在已批改学生中时
            if (this.state.idIndex < checked.length - 1) {
                nowindex++;
            } else {
                message.info('已经选择到最后一个学生了')
            }

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
                agoPage: -1,
                pitchStuId: checked[nowindex].userId,
                pitchStuName: checked[nowindex].name,
                pitchCorrected: checked[nowindex].corrected,
                idIndex: nowindex
            })

        }
        document.getElementById('markedArea').scrollTop = 0;
        document.getElementById('pagination').scrollTop = 0;

    }
    //保存批改痕迹的方法
    SaveTrace(nowTopic) {
        let newmarkList = [], angle = nowTopic.angle;
        if (nowTopic.markList && nowTopic.markList.length > 0) {
            if (nowTopic.multiple > 1) {
                //图片是否被方大过
                for (let obj of nowTopic.markList) {
                    newmarkList.push({
                        ...obj,
                        x: obj.x / nowTopic.multiple - this.state.nowIcoWidth / 2,
                        y: obj.y / nowTopic.multiple - 27 * (this.state.nowIcoWidth / 40),
                    })
                }
            } else {
                for (let obj of nowTopic.markList) {
                    newmarkList.push({
                        ...obj,
                        x: obj.x - this.state.nowIcoWidth / 2,
                        y: obj.y - 27 * (this.state.nowIcoWidth / 40),
                    })
                }
            }
        }
        if (nowTopic.supMarkList) {
            newmarkList.push(...nowTopic.supMarkList)
        }
        if (nowTopic.contentMarkList) {
            newmarkList.push(...nowTopic.contentMarkList)
        }

        this.props.dispatch({
            type: 'correction/pgMarkCommit',
            payload: {
                pageId: nowTopic.pageId,
                width: this.state.nowImgWidth,
                markList: newmarkList,
                angle,
                commitType: 0,
            },
        })
    }

    //点击完成按钮
    sclickFinish(nowTopic, studentList, uncheck, checked) {
        if (studentList.submitted.length === 0 && studentList.uncommitted.length === 0) {
            message.info('暂无作业')
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
            if (nowTopic.multiple > 1) {
                //图片是否被放大过
                for (let obj of nowTopic.markList) {
                    newmarkList.push({
                        ...obj,
                        x: obj.x / nowTopic.multiple - this.state.nowIcoWidth / 2,
                        y: obj.y / nowTopic.multiple - 27 * (this.state.nowIcoWidth / 40),
                    })
                }
            } else {
                for (let obj of nowTopic.markList) {
                    newmarkList.push({
                        ...obj,
                        x: obj.x - this.state.nowIcoWidth / 2,
                        y: obj.y - 27 * (this.state.nowIcoWidth / 40),
                    })
                }
            }
        }

        if (nowTopic.supMarkList) {
            newmarkList.push(...nowTopic.supMarkList)
        }
        if (nowTopic.contentMarkList) {
            newmarkList.push(...nowTopic.contentMarkList)
        }
        this.props.dispatch({
            type: 'correction/pgMarkCommit',
            payload: {
                pageId: nowTopic.pageId,
                width: this.state.nowImgWidth,
                markList: newmarkList,
                angle,
                commitType: 1
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

                    if (uncheck.length === 1) {
                        //如果批的是最后一个学生待批改学生
                        this.props.dispatch({
                            type: 'correction/pgStudentList',
                            payload: {
                                classId: this.props.state.classId,
                                subjectId: this.props.state.subjectId,
                                workDate: this.props.state.workDate
                            }
                        })
                    } else {
                        this.props.dispatch({
                            //更新学生列表
                            type: 'correction/updateStudentList',
                            payload: {
                                classId: this.props.state.classId,
                                subjectId: this.props.state.subjectId,
                                workDate: this.props.state.workDate
                            }
                        })
                        this.nextStu(uncheck, checked)
                    }

                })
            }

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
            this.props.dispatch({
                type: 'correction/teacherCommit',
                payload: {
                    subjectId: this.props.state.subjectId,
                    studentId: this.state.pitchStuId,
                    classId: this.props.state.classId,
                    workDate: this.props.state.workDate,
                }
            })
        }

    }
    //改变页码
    changePage(i) {
        this.setState({
            nowPage: i
        })
        document.getElementById('markedArea').scrollTop = document.getElementById('markedArea').childNodes[i].offsetTop - 20
    }
    //点击查看详情按钮
    clickDetails() {
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
                userId: this.state.pitchStuId,
            },
        })
        this.setState({
            present: 1,
            nowPage: 0
        })
    }


    //提交或修改评论
    publishOrUpdate(content, common, level, score, isExcellent, or, correctId) {
        if (or) {
            //提交评论
            this.props.dispatch({
                type: 'correction/workCommit',
                payload: {
                    studentId: this.state.pitchStuId,
                    subjectId: this.props.state.subjectId,
                    classId: this.props.state.classId,
                    workDate: this.props.state.workDate,
                    common,
                    content,
                    score,
                    level: level || '',
                    isExcellent
                }
            })
        } else {
            console.log(isExcellent)
            //更新评论
            this.props.dispatch({
                type: 'correction/updateCommit',
                payload: {
                    correctId,
                    common,
                    content,
                    score,
                    level: level || '',
                    isExcellent
                }
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
            if (obj.corrected === 0 || (obj.supplement === 1 && obj.corrected === 2)) {
                uncheck.push(obj)
            } else {
                checked.push(obj)
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
        //教师评语    
        let wtbHomeworkCorrect = null;
        if (this.state.checkinwho === 0 && uncheck.length > 0 && uncheck[this.state.idIndex]) {
            wtbHomeworkCorrect = uncheck[this.state.idIndex].wtbHomeworkCorrect
        } else if (checked.length > 0 && checked[this.state.idIndex]) {
            wtbHomeworkCorrect = checked[this.state.idIndex].wtbHomeworkCorrect
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
                                    onChange={(value, option) => { this.cutSubject(value, option) }}
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

                        <div className={style.correction} style={{ overflow: 'auto' }} id='markedArea'
                            onMouseDown={(e) => {
                                this.agoScrollTop = e.currentTarget.scrollTop;
                            }}
                            onScroll={(e) => {
                                let nowPage = this.state.nowPage, scrollTop = e.currentTarget.scrollTop, childNodes = document.getElementById('markedArea').childNodes;

                                if (scrollTop - this.agoScrollTop > 0 && nowPage < childNodes.length - 1 && scrollTop > childNodes[nowPage].offsetTop + (childNodes[nowPage + 1].offsetTop - childNodes[nowPage].offsetTop) * 0.75) {
                                    nowPage++
                                    this.agoScrollTop = scrollTop;
                                    this.setState({
                                        nowPage
                                    })
                                } else if (scrollTop - this.agoScrollTop < 0 && nowPage > 0 && scrollTop < childNodes[nowPage - 1].offsetTop + (childNodes[nowPage].offsetTop - childNodes[nowPage - 1].offsetTop) * 0.25) {
                                    nowPage--
                                    this.agoScrollTop = scrollTop;
                                    this.setState({
                                        nowPage
                                    })
                                }


                            }}>
                            {this.props.state.isCorrected === 1 ?
                                <Complete
                                    nowImgWidth={this.state.nowImgWidth}
                                    approvedStu={checked.length}
                                    average={Math.round(allcuoti / studentList.submitted.length)}
                                    clickButton={() => { this.clickDetails() }}
                                /> : <>
                                    {this.state.phList.length > 0 ? <>
                                        {this.state.phList.map((item, i) => (
                                            <MarkedArea
                                                key={item.pageId}
                                                wtbHomeworkCorrect={wtbHomeworkCorrect}
                                                pitchStuName={this.state.pitchStuName}
                                                gxphList={() => {
                                                    if (this.state.agoPage === -1) {
                                                        this.setState({
                                                            agoPage: i
                                                        })
                                                    } else if (this.state.agoPage !== i) {
                                                        //切换批改的作业时候，保存上一份的批改痕迹
                                                        this.SaveTrace(this.state.phList[this.state.agoPage])
                                                        this.setState({
                                                            agoPage: i
                                                        })
                                                    }
                                                    this.setState({
                                                        phList: this.state.phList,
                                                        nowPage: i
                                                    })
                                                }}
                                                nowImgWidth={this.state.nowImgWidth}
                                                nowIcoWidth={this.state.nowIcoWidth}
                                                nowTopic={item}
                                                src={`${item.pageUrl}/thumbnail/1000x/interlace/1`}
                                            />
                                        ))}

                                    </> : <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10%', width: `${this.state.nowImgWidth + 15}px` }}>
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
                                </>
                            }
                        </div>
                        <div>
                            <div className={style.pagination} id={'pagination'} style={this.props.state.isCorrected === 1 ? { visibility: 'hidden' } : { visibility: 'visible' }}>
                                <span className={style.text}> 页码</span>
                                {this.state.phList.map((item, i) => {
                                    return (!item.markList && item.status === 0) || (item.markList && item.markList.length === 0) ?
                                        <span key={i} className={this.state.nowPage === i ? `${style.number} ${style.current}` : `${style.number}`} onClick={() => { this.changePage(i) }}> {i + 1}</span> :
                                        <span key={i} className={this.state.nowPage === i ? `${style.number}  ${style.finish} ${style.current}` : `${style.number}  ${style.finish}`} onClick={() => { this.changePage(i) }}> {i + 1}</span>
                                })}
                            </div>
                            <div className={style.anniu}>
                                <div className={style.tishi} onClick={() => {
                                    this.setState({
                                        reminder: true
                                    })
                                }}>
                                    <div style={this.state.reminder ? { display: 'block' } : { display: 'none' }}>
                                        <div className={style.triangle}></div>
                                        <div className={style.howdoit}>
                                            <div className={style.howtitle}>如何批改作业</div>
                                            <div style={{ textAlign: "center" }}>
                                                <img src={'http://homework.mizholdings.com/kacha/kcsj/708c34a7fc00bc05/.jpg'} style={{ width: 250, height: 202 }} />
                                            </div>
                                            鼠标左键单击作业错题，可判错误；再次单击错号，更改为半对错；第三次单击半对错，判对；依次循环<br /><br />

                                            所有页面全部批完点击 <span style={{ color: '#4B8EFF' }}>【完成批改】</span>，可自动切换至下一学生的作业
                                                <div className={style.howbutton} onClick={(e) => {
                                                this.setState({
                                                    reminder: false
                                                })
                                                e.stopPropagation();
                                            }}>我知道了</div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginLeft: 20, }}>
                            <CompleteCorrections
                                whether={this.state.pitchStuId !== '' && this.props.state.isCorrected === 0 && this.props.state.workDate !== ''}
                                wtbHomeworkCorrect={wtbHomeworkCorrect}
                                userId={this.state.pitchStuId}
                                wancheng={(content, common, level, score, isExcellent) => {
                                    let that = this;
                                    if (approvedTopic === this.state.phList.length) {
                                        if (this.state.agoPage === -1) {
                                            that.sclickFinish(this.state.phList[this.state.nowPage], studentList, uncheck, checked)
                                        } else {
                                            that.sclickFinish(this.state.phList[this.state.agoPage], studentList, uncheck, checked)
                                        }
                                        if (wtbHomeworkCorrect && wtbHomeworkCorrect.correctId) {
                                            this.publishOrUpdate(content, common, level, score, isExcellent, false, wtbHomeworkCorrect.correctId)
                                        } else {
                                            this.publishOrUpdate(content, common, level, score, isExcellent, true)
                                        }
                                    } else {
                                        Modal.confirm({
                                            title: '还有页面未批改，是否完成批改',
                                            okText: '确认',
                                            cancelText: '取消',
                                            onOk() {
                                                if (that.state.agoPage === -1) {
                                                    that.sclickFinish(that.state.phList[that.state.nowPage], studentList, uncheck, checked)
                                                } else {
                                                    that.sclickFinish(that.state.phList[that.state.agoPage], studentList, uncheck, checked)
                                                }
                                                if (wtbHomeworkCorrect && wtbHomeworkCorrect.correctId) {
                                                    that.publishOrUpdate(content, common, level, score, isExcellent, false, wtbHomeworkCorrect.correctId)
                                                } else {
                                                    that.publishOrUpdate(content, common, level, score, isExcellent, true)
                                                }
                                            }
                                        });
                                    }
                                }} />
                        </div>

                        {Number(localStorage.getItem('jishu')) < 3 && this.state.meismyong === 0 &&

                            <div className={style.gifBox}>
                                <img src={'http://homework.mizholdings.com/kacha/kcsj/708c34a7fc00bc05/.jpg'} style={{ width: 290 }} />
                                <div>
                                    <p style={{ margin: '25px 0 20px 14px', color: '#000004', fontSize: 16 }}>如何批改作业</p>
                                    <p style={{ margin: 14 }}>1.单击图片任意位置可判错，单击<img src={require('../images/mini-cha.png')} />更改
                            为半对，第三次单击<img src={require('../images/mini-cha.png')} />判对</p>
                                    <p style={{ margin: 14 }}>2. 单击并拖动鼠标可添加矩形框  </p>
                                    <div className={style.guanbi} onClick={() => {
                                        if (localStorage.getItem('jishu')) {
                                            localStorage.setItem('jishu', Number(localStorage.getItem('jishu')) + 1)
                                        } else {
                                            localStorage.setItem('jishu', 1)
                                        }
                                        this.setState({
                                            meismyong: 1
                                        })
                                    }}>
                                        关闭
                                </div>
                                </div>
                            </div>

                        }

                    </Layout>

                </Layout >
            </Content >
        )

    }
    componentDidMount() {
        //根据显示器不同分辨率显示不同情况
        if (window.screen.availWidth === 1920) {
            this.setState({
                minWidth: 1635,
                nowImgWidth: 940,
                nowIcoWidth: 40,
            })
        } else if (window.screen.availWidth < 1920 && window.screen.availWidth >= 1600) {
            this.setState({
                minWidth: 1435,
                nowImgWidth: 740,
                nowIcoWidth: 31,
            })
        } else if (window.screen.availWidth < 1600) {
            this.setState({
                minWidth: 1215,
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