import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { message, Layout, Icon, Modal, Button } from 'antd';
import style from './workCorrection.less';
import * as XLSX from 'xlsx';
import store from 'store';


const { Sider } = Layout;

function SiderNavigation(props) {
    const [dianji, setDianji] = useState(false);

    const [visible, setVisible] = useState(false);
    const [excellentId, setExcellentId] = useState([]);


    useEffect(() => {
        let studentId = [];
        for (let obj of props.checked) {
            if (obj.wtbHomeworkCorrect && obj.wtbHomeworkCorrect.isExcellent === 1) {
                studentId.push(obj.wtbHomeworkCorrect.studentId)
            }
        }
        setExcellentId(studentId)
    }, [props.checked]);

    //一键提醒
    function keyRemind(studentList) {
        //限制连续点击
        if (dianji) {
            setTimeout(() => {
                setDianji(false)
            }, 180000);
            message.info('请勿重复点击，请三分钟后再试')
            return;
        }
        setDianji(true)
        if (studentList.uncommitted.length === 0) {
            message.info('学生已经全部提交')
            return false;
        }
        let userId = [];
        for (let obj of studentList.uncommitted) {
            userId.push(obj.userId)
        }
        props.dispatch({
            type: 'correction/remind',
            payload: {
                classId: props.state.classId,
                subjectId: props.state.subjectId,
                workDate: props.state.workDate,
                userId
            }
        })
    }

    // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
    function sheet2blob(sheet, sheetName) {
        sheetName = sheetName || 'sheet1';
        var workbook = {
            SheetNames: [sheetName],
            Sheets: {}
        };
        workbook.Sheets[sheetName] = sheet;
        // 生成excel的配置项
        var wopts = {
            bookType: 'xlsx', // 要生成的文件类型
            bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
            type: 'binary'
        };
        var wbout = XLSX.write(workbook, wopts);
        var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
        // 字符串转ArrayBuffer
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        return blob;
    }
    function openDownloadDialog(url, saveName) {
        if (typeof url == 'object' && url instanceof Blob) {
            url = URL.createObjectURL(url); // 创建blob地址
        }
        var aLink = document.createElement('a');
        aLink.href = url;
        aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
        var event;
        if (window.MouseEvent) event = new MouseEvent('click');
        else {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        aLink.dispatchEvent(event);
    }

    function daochu() {

        let title = `${store.get('wrongBookNews').schoolName} ${props.state.className} ${props.state.subjectName} ${props.state.workDate}情况统计`;

        let cishu = 0, excel = [
            [`                  ${title}`, null, null, null, null],
            [`未提交(${props.studentList.uncommitted.length}人)`, `未批改(${props.uncheck.length}人)`, `已批改(${props.checked.length}人)`, `得分`, `错题`]
        ];

        if (props.checked.length > props.uncheck.length && props.checked.length > props.studentList.uncommitted.length) {
            cishu = props.checked.length;
        } else if (props.uncheck.length > props.checked.length && props.uncheck.length > props.studentList.uncommitted.length) {
            cishu = props.uncheck.length;
        } else if (props.studentList.uncommitted.length > props.uncheck.length && props.studentList.uncommitted.length > props.checked.length) {
            cishu = props.studentList.uncommitted.length;
        }

        for (let i = 0; i < cishu; i++) {
            let cun = [];
            if (props.studentList.uncommitted.length > i) {
                cun.push(props.studentList.uncommitted[i].name)
            } else {
                cun.push(null)
            }

            if (props.uncheck.length > i) {
                cun.push(props.uncheck[i].name)
            } else {
                cun.push(null)
            }
            if (props.checked.length > i) {
                cun.push(props.checked[i].name)
                if (props.checked[i].wtbHomeworkCorrect) {
                    cun.push(props.checked[i].wtbHomeworkCorrect.score)
                } else {
                    cun.push(null)
                }
                cun.push(props.checked[i].wrongNum)
            } else {
                cun.push(null)
                cun.push(null)
                cun.push(null)

            }
            excel.push(cun);
        }

        let sheet = XLSX.utils.aoa_to_sheet(excel);
        sheet['!merges'] = [
            // 设置A1-C1的单元格合并
            { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }
        ];
        sheet["!cols"] = [
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 10 },
        ];
        sheet["!rows"] = [
            { hpt: 25 },
            { hpt: 20 },
        ];
        openDownloadDialog(sheet2blob(sheet), `${title}.xlsx`);

    }

    return (
        <Sider className={style.left}>
            <div className={style.dataDisplay}>
                <div>已批：<span style={{ color: '#409EFF' }}>{props.checked.length}/{props.studentList.submitted.length}人</span></div>
            </div>
            <div className={style.submitBox} onClick={(e) => {
                props.changePresent(Number(e.target.getAttribute('data-state')))
            }}>
                <div data-state={1} className={props.present === 1 ? `${style.refer} ${style.pitchButt}` : style.refer}>已提交</div>
                <div data-state={0} className={props.present === 0 ? `${style.norefer} ${style.pitchButt}` : style.norefer}>未提交</div>
            </div>

            {props.present === 0 ? <>
                <div className={style.leftTop} id='uncommittedTop'>
                    <img src={require('../images/orangeSubmit.png')} />
                    <span className={style.text} >  未提交
                <span className={style.remind}
                            onClick={() => { keyRemind(props.studentList) }}>一键提醒</span>
                    </span>
                </div>
                <div style={{ overflow: 'auto', maxHeight: 'calc(100% - 245px)' }}>
                    {props.studentList.uncommitted.map((item, i) => (
                        item.commited === 0 && <div key={i} className={style.stu}> {item.name} </div>
                    ))}
                </div></> : <>
                    {props.uncheck.length > 0 ? <>
                        <div className={style.leftTop} >
                            <img src={require('../images/blueSubmit.png')} />
                            <span className={style.text}>  待批改学生({props.uncheck.length})</span>
                        </div>
                        <div style={{ overflow: 'auto', maxHeight: 'calc(100% - 245px)' }}>
                            {props.uncheck.map((item, i) => (
                                <div key={i} onClick={() => { props.clickStu(item, i); props.checkinwho(0) }}
                                    className={props.pitchStuId == item.userId ? `${style.stu} ${style.pitch} ${style.xuanzhong}` : `${style.stu} ${style.pitch}`} >
                                    <span className={style.stuname}>{item.name} {item.supplement === 1 && <span className={style.resubmissions}>补交</span>}</span>
                                </div>
                            ))}
                            <div className={style.leftTop} >
                                <img src={require('../images/greenSubmit.png')} />
                                <span className={style.text}>已批改学生({props.checked.length})</span>
                            </div>
                            <div>
                                {props.checked.map((item, i) => (
                                    <div key={i} onClick={() => { props.clickStu(item, i); props.checkinwho(1) }}
                                        className={`${style.stu} ${style.pitch} ${item.corrected === 1 && style.already} ${props.state.isCorrected === 0 && props.pitchStuId == item.userId && style.xuanzhong}`} >
                                        <span className={style.stuname} >
                                            <span style={{ overflow: 'hidden', width: 85, display: 'inline-flex' }}>{item.name}</span>
                                            {item.wtbHomeworkCorrect && item.wtbHomeworkCorrect.isExcellent === 1 && <img src={require('../images/fiveStar.png')} style={{ position: 'absolute', top: 12, left: '-20px' }} />}
                                        </span>

                                        {item.wtbHomeworkCorrect &&
                                            <span style={{ width: 50, textAlign: 'center', display: 'inline-block' }}>
                                                {item.wtbHomeworkCorrect.score !== null ? `${item.wtbHomeworkCorrect.score}分` : item.wtbHomeworkCorrect.level}
                                            </span>}
                                        <span style={{ float: 'right' }}>错{item.wrongNum}题</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </> : <>
                            <div className={style.leftTop} style={{ zIndex: 5, position: 'relative', background: '#fff' }}>
                                <img src={require('../images/greenSubmit.png')} />
                                <span className={style.text}>已批改学生({props.checked.length})</span>
                            </div>
                            <div style={{ overflow: 'auto', maxHeight: 'calc(100% - 245px)' }}>
                                {props.checked.map((item, i) => (
                                    <div key={i} onClick={() => { props.clickStu(item, i); props.checkinwho(1) }}
                                        className={`${style.stu} ${style.pitch} ${item.corrected === 1 && style.already} ${props.state.isCorrected === 0 && props.pitchStuId == item.userId && style.xuanzhong}`} >
                                        <span className={style.stuname}>

                                            <span style={{ overflow: 'hidden', width: 85, display: 'inline-flex' }}>{item.name}</span>

                                            {item.wtbHomeworkCorrect && item.wtbHomeworkCorrect.isExcellent === 1 && <img src={require('../images/fiveStar.png')} style={{ position: 'absolute', top: 12, left: '-20px' }} />}

                                        </span>
                                        {item.wtbHomeworkCorrect &&
                                            <span style={{ width: 50, textAlign: 'center', display: 'inline-block' }}>
                                                {item.wtbHomeworkCorrect.score !== null ? `${item.wtbHomeworkCorrect.score}分` : item.wtbHomeworkCorrect.level}
                                            </span>
                                        }
                                        <span style={{ float: 'right' }}>错{item.wrongNum}题</span>
                                    </div>
                                ))}
                            </div>
                        </>}
                </>}
            <div className={`${style.daochu} ${excellentId.length === 0 && style.noClick}`} style={{ bottom: 59 }}
                onClick={() => {
                    if (excellentId.length === 0) { return }
                    setVisible(true)
                }}>  优秀作业分享  </div>

            <div className={`${style.daochu} ${(props.studentList.uncommitted.length === 0 && props.studentList.submitted.length === 0) && style.noClick} `}
                onClick={() => {
                    if (props.studentList.uncommitted.length === 0 && props.studentList.submitted.length === 0) { return }

                    daochu()

                }}>  导出名单表  </div>
            <Modal
                visible={visible}
                width={950}
                footer={null}
                onCancel={() => { setVisible(false) }}>
                <p style={{ color: '#333333', fontSize: 18, marginBottom: 40 }}>优秀作业分享</p>

                <p style={{ marginBottom: 25 }} > 优秀作业：
                <span style={{ color: '#409EFF' }}>
                        {props.checked.map((item, i) => (
                            item.wtbHomeworkCorrect && item.wtbHomeworkCorrect.isExcellent === 1 &&
                            `${item.name}${props.checked.length - 1 === i ? '' : '，'}`
                        ))}
                    </span>
                </p>

                <p style={{ color: '#333333', marginBottom: 55 }}>确定分享以上同学的优秀作业吗？</p>
                <p style={{ textAlign: "right", margin: 0 }}>
                    <Button onClick={() => { setVisible(false) }} style={{
                        width: 74,
                        height: 40,
                    }}>取消</Button>
                    <Button onClick={() => {
                        console.log(excellentId)
                        if (excellentId.length > 0) {
                            setVisible(false);
                            props.dispatch({
                                type: 'correction/share',
                                payload: {
                                    classId: props.state.classId,
                                    subjectId: props.state.subjectId,
                                    workDate: props.state.workDate.split('作业')[0],
                                    studentId: excellentId,
                                }
                            })
                        }

                    }} type="primary"
                        style={{ background: '#409EFF', marginLeft: 15, width: 74, height: 40 }} >分享</Button>
                </p>

            </Modal>
        </Sider>

    );
}

export default connect((state) => ({
    state: {
        classId: state.temp.classId,
        className: state.temp.className,
        isCorrected: state.correction.isCorrected,
        workDate: state.correction.workDate,
        subjectId: state.correction.subjectId,
        subjectName: state.correction.subjectName,

    }
}))(SiderNavigation);