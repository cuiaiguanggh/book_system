import React from 'react';
import {
  Select
} from 'antd';
import { connect } from 'dva';
import style from './stuReport/stuReport.less';
import {GRADELIST,STUDYLIST,SUNJECTLIST} from '../../models/database'
//作业中心界面内容
const Option = Select.Option;
class GradeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      GRADEDATA:{
        value:-1,
        list:[]
      },
      STUDYDATA:{
        value:STUDYLIST[0].value,
        list:STUDYLIST
      },
      SUBJECTDATA:{
        value:SUNJECTLIST[0].value,
        list:SUNJECTLIST
      }
    }
  }

  render() {
    let {STUDYDATA,GRADEDATA,SUBJECTDATA}=this.state
    return (
      <div className={style.grade_info_container}>
          <Select
            allowClear
            style={{ width: 90 }}
            placeholder="选择学段"
            value={STUDYDATA.value>-1?STUDYDATA.value:'选择学段'}
            onChange={(value)=>{
              
              this.setState({
                STUDYDATA:{
                  value,
                  list:STUDYDATA.list
                }
              })
              if(!this.props.linkage){
                this.setState({
                  GRADEDATA:{
                    value:-1,
                    list:GRADEDATA.list
                  }
                })
              }else{
                if(value){
                  let _classes=STUDYDATA.list.find((v)=>{return v.value==value}).classList
                  console.log('_classes: ', _classes);
                  this.setState({
                    GRADEDATA:{
                      value:_classes[0].value,
                      list:_classes
                    }
                  })
                }
                
              }
              this.props.gradeChangeHander(value==undefined?-1:value)
            }}
          >
          {STUDYDATA.list.map(item => (
            <Option key={item.value} value={item.value}>{item.name}</Option>
          ))}
         </Select>

         <Select
            allowClear
            style={{ width: 100,margin:'0 14px' }}
            placeholder="选择年级"
            value={GRADEDATA.value>-1?GRADEDATA.value:'选择年级'}
            onChange={(value)=>{
              this.setState({
                GRADEDATA:{
                  value,
                  list:GRADEDATA.list
                }
              })
              this.props.classChangeHander(value==undefined?-1:value)
            }}
          >
          {GRADEDATA.list.map(item => (
            <Option key={item.value} value={item.value}>{item.name}</Option>
          ))}
         </Select>

         <Select
            allowClear
            style={{ width: 70 }}
            placeholder="选择学科"
            value={SUBJECTDATA.value>-1?SUBJECTDATA.value:'选择学科'}
            onChange={(value)=>{
              console.log('value: ', value);
              this.setState({
                SUBJECTDATA:{
                  value,
                  list:SUBJECTDATA.list
                }
              })
              this.props.subChangeHander(value==undefined?-1:value)
            }}
          >
          {SUBJECTDATA.list.map(item => (
            <Option key={item.value} value={item.value}>{item.name}</Option>
          ))}
         </Select>
      </div>
    )
  }

  componentDidMount() {
    // this.props.dispatch({
    //   type: 'report/getGradedata',
    //   payload: { }
    // }).then((data)=>{
    //   this.setState({
    //     STUDYDATA:data
    //   })
    // })
    // this.props.dispatch({
    //   type: 'report/getClassData',
    //   payload: { }
    // }).then((data)=>{
    //   this.setState({
    //     GRADEDATA:data
    //   })
    // })
    // this.props.dispatch({
    //   type: 'report/getSubjectData',
    //   payload: { }
    // }).then((data)=>{
    //   this.setState({
    //     SUBJECTDATA:data
    //   })
    // })
    if(!this.props.linkage){
      this.setState({
        GRADEDATA:{
          value:-1,
          list:GRADELIST
        }
      })
    }else{
      let _classes=STUDYLIST[0].classList
      console.log('_classes: ', _classes);
      this.setState({
        GRADEDATA:{
          value:_classes[0].value,
          list:_classes
        }
      })
    }
  }

  componentWillUnmount() {


  }


}

export default connect((state) => ({
  state: {
    ...state.report,
  }
}))(GradeSelect);
