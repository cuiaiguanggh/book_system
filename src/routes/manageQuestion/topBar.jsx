import React from 'react';
import { Layout, Icon, Pagination, Button, Checkbox, Spin ,Select, Input,message,ConfigProvider,Empty,DatePicker } from "antd";
import { connect } from 'dva';
import style from './manageQuestion.less';
import KnowledgeModal from '../wrongReport/knowledgeModal.jsx'
import {QUETYPELIST,GRADELIST,STUDYLIST,SUNJECTLIST} from '../../models/database'
import moment from 'moment';
import zhCN from 'antd/es/locale/zh_CN';
const Option = Select.Option;

const { RangePicker } = DatePicker;
const { Sider, Content } = Layout;


class TopBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            queringSchool:true,
            queryBtnLoading:false
        }
    }

    timeHanderChange(dates, dateString) {
        this.props.dispatch({
            type:'manageQuestion/sdate',
            payload:dateString[0]
        })
        this.props.dispatch({
            type:'manageQuestion/edate',
            payload:dateString[1]
        })
    }

    handleChange = value => {

        this.props.dispatch({
            type:'manageQuestion/schoolValue',
            payload:value
        })
        // this.props.dispatch({
        //     type:'manageQuestion/schoolId',
        //     payload:value
        // })
    }
    fetchSchool = value => {
        this.props.dispatch({
            type:'manageQuestion/schools',
            payload:[]
        })
        let schools=this.props.state.allSchools.filter(item=>item.schoolName.indexOf(value)>-1)
        this.props.dispatch({
            type:'manageQuestion/schools',
            payload:schools
        })
    }
   
    queryQue=(page,psize)=>{
        this.setState({
            queryBtnLoading:true
        })
        this.props.dispatch({
            type:'manageQuestion/queryManageQues',
            payload:true
        })
        this.props.dispatch({
            type:'manageQuestion/getManageQuestions',
            payload:{
                pageNum:page,
                pageSize:psize
            }
        }).then((res)=>{
            this.props.dispatch({
                type:'manageQuestion/queryManageQues',
                payload:false
            })
            this.setState({
                queryBtnLoading:false
            })

        })
    }
    render() {
        const {STUDYEDATA,SUBJECTDATA,QUETYPEDATA,defaultDate,schoolValue,schools}=this.props.state
        console.log('GRADEDATA,SUBJECTDATA,: ', schools);
        return (
            <Spin spinning={this.state.queringSchool}>
                <div style={{width:'100%',background:"#fff",padding:20,height:164,boxSizing:'border-box'}}>
                    <div style={{display:'flex'}}>
                        <div style={{display:"flex",alignItems:'center'}}>
                            <span style={{fontSize:14}}>学段：</span>
                            <Select
                                allowClear
                                style={{ width: 100 }}
                                placeholder="选择学段"
                                value={STUDYEDATA.value>-1?STUDYEDATA.value:'选择学段'}
                                onChange={(value)=>{
                                this.props.dispatch({
                                    type:'manageQuestion/GRADEDATA',
                                    payload:{
                                        value,
                                        list:STUDYEDATA.list
                                        }
                                    })
                                }}
                            >
                            {STUDYEDATA.list.map(item => (
                                <Option key={item.value} value={item.value}>{item.name}</Option>
                            ))}
                            </Select>
                            
                        </div>
                        <div style={{display:"flex",margin:'0 20px',alignItems:'center'}}>
                            <span style={{fontSize:14}}>学科：</span>
                            <Select
                                allowClear
                                style={{ width: 100 }}
                                placeholder="选择学科"
                                value={SUBJECTDATA.value>-1?SUBJECTDATA.value:'选择学科'}
                                onChange={(value)=>{
                                    this.props.dispatch({
                                        type:'manageQuestion/SUBJECTDATA',
                                        payload:{
                                            value,
                                            list:SUBJECTDATA.list
                                            }
                                        })
                                    
                                }}
                            >
                            {SUBJECTDATA.list.map(item => (
                                <Option key={item.value} value={item.value}>{item.name}</Option>
                            ))}
                            </Select>
                            
                        </div>
                        <div style={{display:"flex",alignItems:'center'}}>
                            <span style={{fontSize:14}}>收集时间：</span>
                            <RangePicker
                                style={{ width: 240, marginLeft: 10 }}
                                format="YYYY-MM-DD"
                                placeholder={[defaultDate,defaultDate]}
                                disabledDate={current => current && current > moment().endOf('day') || current < moment().subtract(30, 'day')}
                                onChange={this.timeHanderChange.bind(this)} />
                            
                        </div>
                    </div>
                    <div style={{display:'flex',margin:'14px 0'}}>
                        <div style={{display:"flex",alignItems:'center'}}>
                            <div style={{fontSize:14}}>题目关键字：</div>
                            <Input type='text' allowClear maxLength={15} style={{ width:160 }} placeholder='请输入关键字'
                                onChange={(v)=>{
                                    this.props.dispatch({
                                        type:'manageQuestion/queKeyStr',
                                        payload:v.target.value
                                    })
                                    
                                }}
                            ></Input>
                            
                        </div>
                        <div style={{display:"flex",margin:'0 20px',alignItems:'center'}}>
                            <span style={{fontSize:14}}>题型：</span>
                            <Select
                                allowClear
                                style={{ width:140 }}
                                placeholder="选择题型"
                                value={QUETYPEDATA.value>-1?QUETYPEDATA.value:'选择题型'}
                                onChange={(value)=>{
                                    this.props.dispatch({
                                        type:'manageQuestion/QUETYPEDATA',
                                        payload:{
                                            value,
                                            list:QUETYPEDATA.list
                                        }
                                    })
                                }}
                            >
                            {QUETYPEDATA.list.map(item => (
                                <Option key={item.value} value={item.value}>{item.name}</Option>
                            ))}
                            </Select>
                            
                        </div>
                        <div style={{display:"flex",alignItems:'center'}}>
                            <span style={{fontSize:14}}>题ID：</span>
                            <Input type='number' allowClear style={{ width:100 }} placeholder='数字'
                                 onChange={(v)=>{
                                    this.props.dispatch({
                                        type:'manageQuestion/queId',
                                        payload:v.target.value
                                    })
                                }}
                            ></Input>
                        </div>
                    </div>

                    <div style={{display:"flex",alignItems:'center'}}>
                        <div style={{display:"flex",alignItems:'center'}}>
                            <span style={{fontSize:14}}>学校列表：</span>
                            <Select
                                showSearch
                                allowClear
                                style={{ width:150 }}
                                placeholder="请选择学校"
                                filterOption={false}
                                value={schoolValue?schoolValue:'请选择学校'}
                                filterOption={false}
                                onSearch={this.fetchSchool}
                                onChange={this.handleChange}
                            >
                            {schools.map(item => (
                                <Option key={item.schoolId} >{item.schoolName}</Option>
                            ))}
                            </Select>
                            
                        </div>
                        <div style={{display:"flex",margin:'0 20px',alignItems:'center'}}>
                            <span style={{fontSize:14}}>账号名：</span>
                            <Input type='text' allowClear style={{width:140}} placeholder='账号'
                                onChange={(v)=>{
                                    this.props.dispatch({
                                        type:'manageQuestion/accountName',
                                        payload:v.target.value
                                    })
                                }}
                            ></Input>
                            
                        </div>
                        <Button loading={this.state.queryBtnLoading} type='primary' loading={this.props.state.queryManageQues} onClick={()=>{
                            this.queryQue()
                        }}
                        >搜索</Button>

                        <Checkbox style={{marginLeft:20}}
                            checked={this.props.state.showNoQueTypeOnly}
                            onChange={v=>{
                                this.props.dispatch({
                                    type:"manageQuestion/showNoQueTypeOnly",
                                    payload:v.target.checked
                                })
                            }}
                        >仅显示无题型</Checkbox>
                   </div>
                </div>
              
            </Spin>
              
        )
    }
    componentDidMount() {
        this.props.dispatch({
            type: 'homePage/pageRelevantSchool',
            payload: {
                pageNum: 1,
                pageSize: 10
            }
        }).then(res => {
            if(res.data.result===0&&res.data&&res.data.data.list){
                this.props.dispatch({
                    type:'manageQuestion/schools',
                    payload:res.data.data.list.slice(0,res.data.data.list.length>=100?100:res.data.data.list.length)
                })
                this.props.dispatch({
                    type:'manageQuestion/allSchools',
                    payload:res.data.data.list
                })
            }
            this.setState({
                queringSchool: false
            })
        })
    }
}


export default connect((state) => ({
    state: {
        ...state.manageQuestion
      }
}))(TopBar);