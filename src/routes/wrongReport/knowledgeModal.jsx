import React from 'react';
import {
  Select,Modal,Input,Button,Spin,Popconfirm,Tooltip ,message,Table
} from 'antd';
import { connect } from 'dva';
import GradeSelect from './gradeSelect'
import {QUETYPELIST,GRADELIST,STUDYLIST,SUNJECTLIST} from '../../models/database'
import style from './stuReport/stuReport.less';
//作业中心界面内容
const Option = Select.Option;
class KnowledgeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _zsdKeyword:'',
      knowledes:[],
      queryKnowing:false,
      updateKnowledging:false,
      selectedRowKey:[],
      queryQueGradeInfo:{
        grade:STUDYLIST[0].value,
        class:-1,
        sub:SUNJECTLIST[0].value
      },
    }
    this.knowledgeColum = [
			{
			title: '知识点名称',
			dataIndex: 'knowLedgeName',
			align: 'center',
			editable: true,
			render: (text) => {
				return (
            <span>{text}</span>
          )
        }
		  }
		];

  }
  getZsd=()=>{
    if(!this.state._zsdKeyword.length){
      message.destroy()
      message.warn('请输入要查询知识点的关键字')
      return
    }
    this.setState({
      queryKnowing:true
    })
    let payload={
      knowledgeKeyword:this.state._zsdKeyword,
      gradeId:this.state.queryQueGradeInfo.class>-1?this.state.queryQueGradeInfo.class:0,
      phaseId:this.state.queryQueGradeInfo.grade>-1?this.state.queryQueGradeInfo.grade:0,
      subjectId:this.state.queryQueGradeInfo.sub>-1?this.state.queryQueGradeInfo.sub:0,
      
      // pageNum:1,
      // pageSize:9999
    }
    // if(this.state.queryQueGradeInfo.class>-1)payload.gradeId=this.state.queryQueGradeInfo.class
    // if(this.state.queryQueGradeInfo.grade>-1)payload.phaseId=this.state.queryQueGradeInfo.grade
    // if(this.state.queryQueGradeInfo.sub>-1)payload.subjectId=this.state.queryQueGradeInfo.sub
    this.props.dispatch({
      type:'report/qrKnowledgeInfo',
      payload
    }).then((res)=>{
      console.log('res: ', res);
      this.setState({
        knowledes:res,
        queryKnowing:false
      })
    })
  }
  //更新知识点
  updateKnowledge=()=>{
    if(!this.state.selectedRowKey.length){
      message.destroy()
      message.warn('请选择要更新的知识点')
      return
    }
    this.setState({
      updateKnowledging:true
    })
    setTimeout(() => {
      this.props.dispatch({
        type:'report/questionAddKnowledge',
        payload:{
          questionId:100,
          knowledgeIds:this.state.selectedRowKey
        }
      }).then((res)=>{
        this.setState({
          updateKnowledging:false
        })
        if(true){
          //更新当前题目的知识点，同时重新获取优选错题
          this.props.updateSuccess(res)
        }else{
          message.destroy()
          message.error('知识点更新失败')
        }
        
      })
    }, 1000)
  }
  deleteKnowlede=(knowId)=>{
    this.props.dispatch({
      type:'report/deleteKnowlede',
      payload:{
        knowId,
        uqId:this.props.currentQue.picId.split('-')[1]
      }
    })
  }
  resetKnowModal=()=>{
    this.setState({
      queryKnowing:false,
      updateKnowledging:false,
      selectedRowKey:[],
    })
  }
  render() {
    
    let rowRadioSelection={
			type:'checkbox',
			columnTitle:"选择",
			selectedRowKeys:this.state.selectedRowKey,
			onSelect: (item, checked) => {

        if(checked){
          this.state.selectedRowKey.push(item.knowledgeId)
        }else{
          this.state.selectedRowKey.splice(this.state.selectedRowKey.findIndex(_id => _id === item.knowledgeId), 1)
        }
        this.setState({
          selectedRowKey:this.state.selectedRowKey
        })
        console.log('this.state.selectedRowKey: ', this.state.selectedRowKey);
			}
		}
    let dataSource = this.state.knowledes;
    return (
      <Modal
        zIndex={103}
        maskClosable={false}
        afterClose={()=>this.resetKnowModal()}
        visible={this.props.knowledgeModalVisible}
        destroyOnClose={false}
        footer={null}
        style={{top:50,minWidth:700}}
        bodyStyle={{padding:'10px 24px'}}
        width='700px'
        title='知识点编辑'
        onCancel={()=>{
          this.props.hideModal()
        }}
        >
        <div>
          <div style={{margin:'18px 0'}}>
            <div style={{display:"flex",marginBottom:10,alignItems:'center'}}>
              <span style={{fontSize:14,width:90}}>学段-学科：</span>
              <GradeSelect
                 subChangeHander={
                  (v)=>{
                    console.log('v: ', v);
                    this.setState({
                      queryQueGradeInfo:{
                        ...this.state.queryQueGradeInfo,
                        sub:v,
                      }
                    })
                  }
                }
                classChangeHander={
                  (v)=>{
                    this.setState({
                      queryQueGradeInfo:{
                        ...this.state.queryQueGradeInfo,
                        class:v,
                      }
                    })
                  }
                }
                gradeChangeHander={
                  (v)=>{
                    this.setState({
                      queryQueGradeInfo:{
                        ...this.state.queryQueGradeInfo,
                        grade:v,
                      }
                    })
                  }
                }
              />
            </div>

            <div style={{display:"flex",alignItems:'center'}}>
              <span style={{fontSize:14,width:90}}>知识点： </span>
              <Input style={{width:"200px",marginRight:15}}  defaultValue='数学' placeholder='输入关键字查询知识点' maxLength={15}
                onChange={(e)=>{
                  this.setState({
                    _zsdKeyword:e.target.value
                  })
                }} 
              ></Input> 
              <Button loading={this.state.queryKnowing} onClick={()=>this.getZsd()}>搜索知识点</Button>
            </div>

            <div style={{display:"flex",alignItems:'center',marginTop:10}}>
              <span style={{fontSize:14}}>已选{this.state.selectedRowKey.length}个，建议不超过3个</span>
              <Button style={{marginLeft:14}} loading={this.state.updateKnowledging} type='primary' onClick={()=>this.updateKnowledge()}>更新知识点</Button>
            </div>
          </div>
          <Table
            loading={this.state.queryKnowing}
            rowSelection={rowRadioSelection}
            rowKey={record => record.knowledgeId}
            className={style.scoreDetTable}
            dataSource={dataSource}
            columns={this.knowledgeColum}
            pagination={{pageSize:8}}
            style={{ userSelect: 'text' }}
            rowClassName="editable-row" />
            <div style={{borderTop:'1px solid #ddd',margin:'10px -24px',padding:'0 24px',boxSizing:"border-box",paddingTop:10,boxSizing:'border-box'}}>
              <h3>已有知识点:</h3>
              <div style={{display:'flex',flexWrap:'wrap'}}>
                {
                this.props.currentQue.knowledgeName?
                  <span className={style.know_span}>
                    <span className={style.span_text}>
                      {this.props.currentQue.knowledgeName}
                    </span>
                    <Popconfirm
                      placement="topRight"
                      title='确定要删除该知识点?'
                      onConfirm={()=>this.deleteKnowlede(1)}
                      okText="是"
                      cancelText="否"
                    >
                      <span className={style.span_hander}>x</span>
                    </Popconfirm>
                  </span>:'暂无知识点'
                }
              </div>
            </div>
        </div>
      </Modal>
    )
  }

  componentDidMount() {
    

  }

  componentWillUnmount() {


  }


}

export default connect((state) => ({
  state: {
    ...state.report,
  }
}))(KnowledgeModal);
