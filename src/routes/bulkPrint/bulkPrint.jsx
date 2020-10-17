import React from 'react';
import style from './bulkPrint.less';
import { connect } from 'dva';
import { Layout, InputNumber, DatePicker, Select, Icon, Checkbox, Progress, message,Spin ,Modal,Button} from 'antd';
import { dataCenter, dataCen } from '../../config/dataCenter'
import store from 'store';
import moment from 'moment';
import observer from '../../utils/observer'

const { Content } = Layout;
const modal = Modal.confirm;
const { Option } = Select;
const { RangePicker } = DatePicker;


class bulkPrint extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectTopic: 0,
            soloNum: 20,
            userType: 2,
            selectMonth: 0,
            month: 0,
            start: 0,
            end: 0,
            dates: [],
            printList: [],
            selectStu: [],
            showTitle: [],
            selectShowTitle: [],
            downPlan: -1,
            editableTopic: '',getPrinting:false,printByStudentQueCount:true,printByQueCount:false,printModalShow:true,
            cancelPrinting:false
        };

        observer.addSubscribe('printCut', (subjectId) => {
            this.setState({
                month: 0,
                start: 0,
                end: 0,
                dates: [],
                selectMonth: 0,
                showTitle: [],
                printList: [],
                selectShowTitle: [],
            });
            if (subjectId) {
                this.callInterface(subjectId);
            }
        })

    }

    //过滤题目
    filterTopic(suzu) {
        let allUqid = []
        return suzu.reduce((total, currentValue) => {

            if (Array.isArray(total)) {
                if (allUqid.includes(currentValue.questionId)) {
                    allUqid.push(currentValue.questionId)
                    return total;
                } else {
                    allUqid.push(currentValue.questionId)
                    total.push(currentValue)
                    return total;
                }
            } else {
                allUqid.push(...[total.questionId, currentValue.questionId])
                return [total, currentValue]
            }
        })
    }



    //调用接口
    callInterface(subjectId = this.props.state.subId) {
        if (!subjectId) { return }

        this.setState({
            printList: [],
            selectStu: [],
            selectShowTitle: [],
            showTitle: [],
            getPrinting:true
        });
        let data = {
            classId: this.props.state.classId,
            subjectId,
            num: this.state.soloNum,
            userType: this.state.userType,
            year: this.props.state.years,
        }
        if (this.state.month) {
            data.month = this.state.month
        }
        if (this.state.start) {
            data.start = this.state.start
        }
        if (this.state.end) {
            data.end = this.state.end
        }
        this.props.dispatch({
            type: 'market/printList',
            payload: data
        }).then((res) => {
            let This = this;
            // function addTopic(obj, currentId, storeClassQue) {
            //     // 一次性加题后进行过滤再添加 重复进行
            //     if (obj.papers.length < This.state.soloNum) {
            //         let cun = storeClassQue.splice(0, This.state.soloNum - obj.papers.length);
            //         obj.papers.push(...cun)
            //         //过滤重复题目
            //         obj.papers = This.filterTopic(obj.papers);
            //         if (obj.papers.length < This.state.soloNum && storeClassQue.length > 0) {
            //             addTopic(obj, currentId, storeClassQue)
            //         }

            //     } else {
            //         for (let que of obj.papers) {
            //             que.userId = obj.userId
            //         }
            //         obj.classQue = storeClassQue;
            //         return;
            //     }
            // }
            function addTopic(obj, currentId, storeClassQue) {
                //每加1个错题前判断是否存在
                while (obj.papers.length < This.state.soloNum && storeClassQue.length > 0) {
                    let nowClassQue = storeClassQue.shift();
                    if (!currentId.includes(nowClassQue.questionId)) {
                        nowClassQue.userId = obj.userId;
                        obj.papers.push(nowClassQue)
                    }
                }
                obj.classQue = storeClassQue;
            }

            if (res) {
                res.printList = res.printList || [];
                res.classQue = res.classQue || [];
                for (let obj of res.printList) {
                    let storeClassQue = JSON.parse(JSON.stringify(res.classQue)),
                        currentId = obj.papers.map((item) => item.questionId);

                    addTopic(obj, currentId, storeClassQue)

                    // if (obj.papers.length < this.state.soloNum) {
                    //     let cun = storeClassQue.splice(0, this.state.soloNum - obj.papers.length);
                    //     for (let que of cun) {
                    //         que.userId = obj.userId
                    //     }
                    //     obj.papers.push(...cun)
                    //     obj.classQue = storeClassQue
                    // }
                }
                this.setState({
                    printList: res.printList,
                    getPrinting:false
                })

            }
        })
    }

    clickPrint() {

        let ws = null, This = this;
        if (This.state.selectShowTitle.length === 0 || This.state.downPlan !== -1) { return }
        if ("WebSocket" in window) {
            // 打开一个 web socket
            // let url = process.env.API_ENV === 't' ? `ws://101.132.88.134:81/websocket?userId=${store.get('wrongBookNews').userId}` : dataCen(`/export/websocket?userId=${store.get('wrongBookNews').userId}`);

            ws = new WebSocket(dataCen(`/export/websocket?userId=${store.get('wrongBookNews').userId}`));

            ws.onopen = function () {
                console.log("WebSocket连接成功");
                This.setState({
                    downPlan: 0
                })
            };

            ws.onmessage = function (event) {

                if (event.data.indexOf('/') > 0) {
                    This.setState({
                        downPlan: event.data.split('/')[0] / event.data.split('/')[1] * 100
                    })
                }


                if (event.data === '连接成功') {

                    let cun = [];
                    for (let data of This.state.showTitle) {
                        if (This.state.selectShowTitle.includes(data.uqId)) {
                            let obj = {
                                "uid": store.get('wrongBookNews').userId,
                                "childId": data.userId,
                                "classId": This.props.state.classId,
                                "operationClass": This.props.state.classId,
                                "uqIds": data.uqId,
                                "subjectId": This.props.state.subId,
                                "practise": 1
                            };
                            if (This.state.start) {
                                obj.endDate = This.state.end;
                                obj.beginDate = This.state.start;
                            }
                            if (cun.length > 0 && data.userId === cun[cun.length - 1].childId) {
                                cun[cun.length - 1].uqIds += `,${data.uqId}`
                            } else {
                                cun.push(obj)
                            }

                            if (data.newTitle && cun[cun.length - 1].titleMap) {
                                cun[cun.length - 1].titleMap.push({ uqId: data.uqId, value: data.newTitle })
                            } else if (data.newTitle) {
                                cun[cun.length - 1].titleMap = [{ uqId: data.uqId, value: data.newTitle }]
                            }

                        }
                    }
                    fetch(dataCenter(`/export/pdf/makeBatchPdf`), {
                        body: JSON.stringify(cun),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'post',
                    }).then(resp => resp.blob())
                        .then(blob => { })
                        .catch(err => console.log('error is', err))

                }
                if (event.data.indexOf('-') > 0) {
                    fetch(dataCenter(`/export/pdf/productPdfOfZip?uuid=${event.data}&uid=${store.get('wrongBookNews').userId}&subjectId=${This.props.state.subId}`), {
                        method: 'get',
                    }).then(resp => resp.blob())
                        .then(blob => {
                            This.setState({
                                downPlan: -1
                            })
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `一键打印.zip`;
                            a.click();
                        })
                        .catch(err => console.log('error is', err))
                }


                console.log("数据已接收...\n" + event.data);

            };

            ws.onclose = function () {
                console.log("WebSocket连接关闭");
                This.setState({
                    downPlan: -1
                })
            };
            ws.onerror = function () {
                console.log("WebSocket连接发生错误");
            };
        } else {
            // 浏览器不支持 WebSocket
            alert("您的浏览器不支持 WebSocket!");
        }
    }


    //点击时间全部事件
    alltime() {
        this.setState({
            selectMonth: 0,
            month: 0,
            start: 0,
            end: 0,
            dates: []
        }, () => {
            this.callInterface();
        })
    }
    //点击不同月份的事件
    monthtime(item) {
        this.setState({
            selectMonth: item.k,
            month: item.v,
            start: 0,
            end: 0,
            dates: []
        }, () => {
            this.callInterface();
        })
    }
    //时间框
    quantumtime(dates, dateString) {
        this.setState({
            selectMonth: -1,
            start: dateString[0],
            end: dateString[1],
            dates: dates
        }, () => {
            this.callInterface();
        })
    }


    //选中学生
    selectStuOne(item, e) {
        if (e.target.checked) {
            this.state.selectStu.push(item.userId);
            this.state.showTitle.push(...item.papers);
            this.setState({
                selectStu: this.state.selectStu,
                showTitle: this.state.showTitle
            });
        } else {
            this.state.selectStu.splice(this.state.selectStu.indexOf(item.userId), 1)
            let cun = [], selectShowTitle = [];

            for (let obj of this.state.printList) {
                if (this.state.selectStu.includes(obj.userId)) {
                    cun.push(...obj.papers);
                }
            }
            cun.map((item) => {
                if (this.state.selectShowTitle.includes(item.uqId)) {
                    selectShowTitle.push(item.uqId)
                }
            })


            this.setState({
                selectStu: this.state.selectStu,
                showTitle: cun,
                selectShowTitle
            })
        }
    }
    //全选学生
    selectStuAll(e) {

        if (e.target.checked) {
            let selectStu = this.state.printList.map((item) => item.userId), showTitle = [];
            this.state.printList.map((item) => showTitle.push(...item.papers));

            this.setState({
                selectStu,
                showTitle,
            })

        } else {
            this.setState({
                selectStu: [],
                showTitle: [],
                selectShowTitle:[]
            })
        }
    }

    //题目全选
    selectAll(e) {
        if (e.target.checked) {
            let cun = [];
            for (let obj of this.state.showTitle) {
                cun.push(obj.uqId)
            }
            this.setState({
                selectShowTitle: cun,
            });
        } else {
            this.setState({ selectShowTitle: [] })
        }
    }
    //切换打印对象
    cutUser(value) {
        this.setState({
            userType: value
        }, () => { this.callInterface() })
    }
    //剔除
    getRid(data, item) {
        if (data.classQue.length > 0) {

            let qu = data.classQue.shift();

            if (this.state.selectShowTitle.includes(item.uqId)) {
                this.state.selectShowTitle.splice(this.state.selectShowTitle.indexOf(item.uqId), 1, qu.uqId);
            }

            if (qu.questionId === item.questionId) {
                qu = data.classQue.shift();
            }
            item.uqId = qu.uqId;
            item.title = qu.title;
            item.knowledgeName = qu.knowledgeName;
            item.knowledgeId = qu.knowledgeId;
            item.questionId = qu.questionId;
            item.goodTitle = qu.goodTitle;

        } else {
            console.log(this.state.selectShowTitle, item.uqId)
            if (this.state.selectShowTitle.includes(item.uqId)) {
                this.state.selectShowTitle.splice(this.state.selectShowTitle.indexOf(item.uqId), 1);
            }

            for (let j = 0; j < this.state.showTitle.length; j++) {
                if (this.state.showTitle[j].uqId === item.uqId) {
                    data.papers.splice(j, 1);
                    this.state.showTitle.splice(j, 1);
                    break;
                }
            }
        }



    }
    //换一题
    changeTopic(data, item) {
        console.log(data)
        if (!data.replaceTopic) {
            data.replaceTopic = [...data.classQue];
            if (data.replaceTopic.length > 0) {
                data.replaceTopic.push({ ...item })
                item.title = data.replaceTopic[0].title;
                item.url = data.replaceTopic[0].url;
                item.uqId = data.replaceTopic[0].uqId;
                item.questionId = data.replaceTopic[0].questionId;
                item.goodTitle = data.replaceTopic[0].goodTitle;


                data.replaceTopic = data.replaceTopic.slice(1, data.replaceTopic.length);

                if (this.state.selectShowTitle.includes(item.uqId)) {
                    this.state.selectShowTitle.splice(this.state.selectShowTitle.indexOf(item.uqId), 1, item.uqId)
                }

                this.setState({
                    printList: this.state.printList
                })
            } else {
                message.info('暂无题目可换')
            }

        } else if (data.replaceTopic && data.replaceTopic.length === 0) {
            message.info('暂无题目可换')
        } else if (data.replaceTopic && data.replaceTopic.length > 0) {

            let topic = data.replaceTopic.splice(0, 1);

            data.replaceTopic.push({ ...item })

            item.title = topic[0].title;
            item.url = topic[0].url;
            item.uqId = topic[0].uqId;
            item.questionId = topic[0].questionId;
            item.goodTitle = topic[0].goodTitle;


            if (this.state.selectShowTitle.includes(item.uqId)) {
                this.state.selectShowTitle.splice(this.state.selectShowTitle.indexOf(item.uqId), 1, item.uqId)
            }

            this.setState({
                printList: this.state.printList
            })
        }


    }
    cancelPrint(){
        this.setState({
            printModalShow:false,
            cancelPrinting:true
        })

        //取消长链接..
    }
    render() {
        let { mounthList } = this.props.state;

        return (
            <>
                {/* {this.state.downPlan !== -1 &&
                    <div style={{ position: 'absolute', top: 20, left: '40%', width: 200 }}>
                        <Progress percent={Math.round(this.state.downPlan)} status="active" />
                    </div>} */}
                <Layout>
                    <div className={style.header}>
                        <div>时间：

                        <span key={0} style={this.state.selectMonth === 0 ? { background: '#409EFF', color: '#fff' } : undefined} className={style.month}
                                onClick={this.alltime.bind(this)}>全部</span>

                            {mounthList.data && mounthList.data.map((item, i) => {
                                return (
                                    <span style={this.state.selectMonth === item.k ? { background: '#409EFF', color: '#fff' } : undefined}
                                        className={style.month} key={i} onClick={this.monthtime.bind(this, item)}>  {item.k}   </span>)
                            })}

                            <span style={{marginLeft: 20}}>
                                创建时间：
                                <RangePicker
                                    style={{ width: 240,  }}
                                    format="YYYY-MM-DD"
                                    placeholder={['开始时间', '结束时间']}
                                    value={this.state.dates}
                                    disabledDate={current => current && current > moment().endOf('day') || current < moment().subtract(2, 'year')}
                                    onChange={this.quantumtime.bind(this)} />

                            </span>
                            
                        </div>
                        <div>
                            <span> 打印对象：</span>

                            <Select placeholder="用户类型" style={{ width: 124, marginLeft: 10 }} defaultValue="2" onChange={this.cutUser.bind(this)}>
                                <Option value='0'>普通会员</Option>
                                <Option value='1'>试用用户</Option>
                                <Option value='2'>付费用户</Option>
                            </Select>

      
                            <Checkbox checked={this.state.printByStudentQueCount} style={{marginLeft:30}}
                                onChange={(e)=>{
                                    this.setState({ printByStudentQueCount: e.target.checked,printByQueCount: !e.target.checked })
                                }}
                            >按学生已有错题打印</Checkbox>
                            <span style={{marginLeft:25}}> 
                                <Checkbox checked={this.state.printByQueCount}
                                    onChange={(e)=>{
                                        this.setState({ printByQueCount: e.target.checked,printByStudentQueCount: !e.target.checked })
                                    }}
                                >固定题量：</Checkbox>
                                <InputNumber disabled={this.state.printByStudentQueCount} min={1} value={this.state.soloNum} className={style.danren} max={70} 
                                onChange={(value) => { this.setState({ soloNum: value }) }} onBlur={() => { this.callInterface() }} /> 道 <span style={{marginLeft:8}}>最大70道，如不足班级错题补足</span>
                            </span>
                            
                        </div>
                    </div>

                    <Content style={{ padding: '20px 0 34px' }}>
                        <div className={style.leftBox} >
                            <Spin spinning={this.state.getPrinting}>
                                <div className={`${style.leftHeader} ${style.stumargin}`}>
                                    <span style={{width:95}}>
                                        <Checkbox checked={this.state.selectStu.length&&this.state.selectStu.length === this.state.printList.length}
                                            onClick={this.selectStuAll.bind(this)} >学生 &nbsp;</Checkbox></span>
                                    <span> 帐号</span>
                                    {/* <span style={{ marginRight: -20 }}>已选 <span className={style.displayBox}>{this.state.soloNum}</span> 题</span> */}
                                    <span >已同步错题数</span>
                                </div>

                                <div style={{ height: 'calc(100% - 50px)', overflow: 'auto' }}>
                                    {this.state.printList.map((item, i) => (
                                        <div className={style.stumargin} key={i}>
                                            <span style={{ width: 95, height: 50 }}>
                                                <Checkbox checked={this.state.selectStu.includes(item.userId)}
                                                    style={{
                                                        overflow: 'hidden',
                                                        whiteSpace: 'nowrap',
                                                        textOverflow: 'ellipsis',
                                                        width: '100%'
                                                    }}
                                                    onChange={this.selectStuOne.bind(this, item)}>{item.userName}</Checkbox>
                                            </span>
                                            <span style={{ width: '25%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}> {item.account}</span>
                                            <span>{item.papers.length}道</span>
                                        </div>))}
                                </div>
                            </Spin>

                        </div>
                        <div className={style.topicBox}>
                            <div className={style.topicTop}>
                                <Checkbox onChange={this.selectAll.bind(this)} checked={this.state.selectShowTitle.length&&this.state.showTitle.length === this.state.selectShowTitle.length}>全选</Checkbox>
                                <span>共计 <span style={{ color: '#409EFF' }}>{this.state.showTitle.length}</span> 题</span>
                            </div>

                            <div style={{ height: 'calc(100% - 50px)' }} className={style.topicsBox} >

                                {this.state.printList.map((data) => {

                                    if (this.state.selectStu.includes(data.userId)) {
                                        return (
                                            data.papers.map((item, i) => (
                                                <div className={style.oneTopic} key={i} style={this.state.selectTopic === item ? { border: '1px solid #409EFF' } : undefined}
                                                    onClick={() => { this.setState({ selectTopic: item }) }}>
                                                    {this.state.selectTopic === item &&
                                                        <div className={style.topicChange_box}>

                                                                {this.state.editableTopic === item.uqId ?
                                                                <div className={style.topic_btn}
                                                                    onClick={(e) => {

                                                                        for (let obj of this.state.showTitle) {
                                                                            if (obj.uqId === item.uqId) {
                                                                                obj.newTitle = document.getElementById(item.uqId).innerHTML
                                                                                break;
                                                                            }
                                                                        }
                                                                        // item.newTitle = document.getElementById(item.questionId).innerHTML;

                                                                        this.setState({
                                                                            editableTopic: ''
                                                                        });
                                                                    }}>  确认修改 </div> :
                                                                <div className={style.topic_btn}
                                                                    onClick={(e) => {
                                                                        if (item.title) {
                                                                            this.setState({
                                                                                editableTopic: item.uqId
                                                                            });
                                                                        }

                                                                    }}>  修改题目 </div>}
                                                            <div className={style.topic_btn} 
                                                                onClick={this.changeTopic.bind(this, data, item)} >
                                                                换一题   </div>
                                                        </div>
                                                    }

                                                    <p style={{background:"rgb(249 ,249 ,249)",padding:'15px 10px'}}>
                                                        题目{i + 1} 
                                                        <span style={{marginLeft:10}}>习题册名称：</span>
                                                        <span style={{margin:'0 10px'}}>页码：</span>
                                                        <span>第3道</span>
                                                        <span style={{float:'right'}}>学段-学科：</span>
                                                    </p>
                                                   <div style={{padding:25}}>
                                                    {item.title ?
                                                            < div dangerouslySetInnerHTML={{ __html: item.title }} id={item.uqId} contentEditable={this.state.editableTopic === item.uqId}
                                                                style={{ borderBottom: '1px dashed #E7E7E7', paddingBottom: 20, marginBottom: 20 }} />
                                                            : <img src={item.url} style={{ width: '100%' }} alt='' />}
                                                        <div>【知识点：】{item.knowledgeName}</div>
                                                        <p>优选练习 </p>

                                                        <div dangerouslySetInnerHTML={{ __html: item.goodTitle }} />
                                                   </div>

                                                    <div className={style.topicBottom} >
                                                        <span className={style.delete} onClick={this.getRid.bind(this, data, item)}><Icon type="minus-circle" style={{ marginRight: 5 }} />剔除</span>
                                                        {this.state.selectShowTitle.includes(item.uqId) ?
                                                            <span className={style.selectTopic} style={{ background: '#b8c3d1' }}
                                                                onClick={() => {
                                                                    this.state.selectShowTitle.splice(this.state.selectShowTitle.indexOf(item.uqId), 1)
                                                                    this.setState({
                                                                        selectShowTitle: this.state.selectShowTitle
                                                                    })
                                                                }}>
                                                                <img style={{ marginTop: '-4px', marginRight: '4px' }} alt='' src={require('../images/sp-yc-n.png')} /> 移除  </span>
                                                            :
                                                            <span className={style.selectTopic}
                                                                onClick={() => {
                                                                    this.state.selectShowTitle.push(item.uqId);
                                                                    this.setState({ selectShowTitle: this.state.selectShowTitle })
                                                                }}>
                                                                <img style={{ marginTop: '-4px', marginRight: '4px' }} src={require('../images/sp-xt-n.png')} alt='' />选题 </span>}
                                                    </div>
                                                </div>))
                                        )
                                    }
                                })}
                            </div>
                        </div>

                    </Content>


                    <div className={style.printButton} onClick={
                        ()=>{
                            modal({
                                title: `确定一键打印吗？`,
                                okText: '确认',
                                cancelText: '取消',
                                width: 480,
                                icon: null,
                                onOk:()=> {
                                    this.clickPrint()
                                },
                            });
                        }
                        
                        }>
                        <img src='http://homework.mizholdings.com/kacha/kcsj/562bfef7c9d97ba3/.png' style={{ marginBottom: 10 }} alt='' />
                        一<br />键<br />打<br />印  <span className={style.yuan}> {this.state.selectShowTitle.length} </span>
                    </div>
                
                    <Modal
                        maskClosable={false}
                        keyboard={false}
                        title=""
                        footer={false}
                        closable={false}
                        visible={this.state.printModalShow}
                        >
                        <div style={{display:'flex',justifyContent:'space-around',flexDirection:'column',alignItems:'center',height:170}}>
                            <div>正在生成错题本</div>
                            <div style={{width:300}}><Progress percent={Math.round(this.state.downPlan)} status="active" /></div>
                            <div>请稍候，请勿随意取消生成……</div>
                            <Button loading={this.state.cancelPrinting} style={{marginTop:10}} onClick={()=>{this.cancelPrint()}}>取消生成</Button>
                        </div>
                    </Modal>
                </Layout>
            </>
        )
    }
    componentDidMount() {
        this.callInterface();
    }
}


export default connect((state) => ({
    state: {
        ...state.temp
    }
}))(bulkPrint);
