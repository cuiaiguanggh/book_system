import React from 'react';
import { Layout, Icon, Pagination, Button, Checkbox, Spin ,Select, Input,message,ConfigProvider,Empty,DatePicker } from "antd";
import { connect } from 'dva';
import style from './manageQuestion.less';
import KnowledgeModal from '../wrongReport/knowledgeModal.jsx'
import {QUETYPELIST,GRADELIST,STUDYLIST,SUNJECTLIST} from '../../models/database'
import moment from 'moment';
import TopBar from './topBar'
import zhCN from 'antd/es/locale/zh_CN';
const Option = Select.Option;

const { RangePicker } = DatePicker;
const { Sider, Content } = Layout;


class manageQuestion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            knowledgeModalShow:false,
            nowque:{},
            currentPageIndex:1,
            QUETYPEDATA:{
                list:QUETYPELIST,
                value:QUETYPELIST[0].value
            }
            
        }
    }

    que(){
        let detail= this.props.state.manageQuestionList
        console.log('detail: ', detail);
        return(
            detail.map((item, i) => {
              return (
                <div key={i} className={[style.questionBody,this.props.state.showNoQueTypeOnly&&item.type==0?style._hide:''].join(' ')}>
                  <div className={style.questionTop} >
                    {/* <span style={{ marginRight: '20px' }}>第{i + 1}题</span> */}

                    题ID：{i}

                    <div style={{marginLeft:15}}>
                        <span>题型：</span>
                        <Select
                            allowClear
                            style={{ width: 120 }}
                            placeholder="请选择题型"
                            value={this.state.QUETYPEDATA.value>-1?this.state.QUETYPEDATA.value:'请选择题型'}
                            onChange={(value)=>{
                              this.setState({
                                QUETYPEDATA:{
                                  value,
                                  list:this.state.QUETYPEDATA.list
                                }
                              })
                            }}
                          >
                          {this.state.QUETYPEDATA.list.map(item => (
                            <Option key={item.value} value={item.value}>{item.name}</Option>
                          ))}
                        </Select>
                    </div>
                  </div>
                  <div style={{ padding: '14px', height: '200px', overflow: "hidden",boxSizing:'border-box' }} >
                    {item.title?
                      <div dangerouslySetInnerHTML={{ __html: item.title }} />
                      :
                      <img key={i} style={{ width: '100%' }}
                        src={item.questionUrls[0].split(',')[0].indexOf('?') > 0 ? `${item.questionUrls[0].split(',')[0]}/thumbnail/1000x` : `${item.questionUrls[0].split(',')[0]}?imageMogr2/thumbnail/1000x`} />
                    }
                  </div>
                  <div className={style.know_box} style={{ padding: '14px'}} >
                    <span className={style.know_text}>知识点：{item.knowledgeName?item.knowledgeName:'暂无知识点'}</span>
                    <span style={{color:"#1890ff",marginLeft:20,cursor:'pointer'}} 
                        onClick={()=>{
                        this.setState({
                            nowque:item,
                            knowledgeModalShow:true
                        })
                    }}>编辑</span>
                  </div>
                  <div className={style.time_footer}>
                      <span>创建时间：{item.uploadTime?item.uploadTime:'--'}</span>
                      {
                          item.updateTime?<span>修改时间：{item.updateTime}</span>:""
                      }
                      
                  </div>

                </div>
              )
            })
          
        )
    }
    changePagination=(page,psize)=>{
        console.log('page,psize: ', page,psize);
        this.queryQue(page,psize)
    }

    render() {
        return (
            <Layout style={{padding:14,boxSizing:'border-box'}}>
                <div style={{height:'100%'}}>
                <TopBar

                ></TopBar>
                   
                <div style={{width:'100%',background:"#fff",marginTop:14,height:'calc( 100% - 180px )',boxSizing:'border-box',display:'flex',flexDirection:'column',position:'relative'}}>
                    {
                        this.props.state.manageQuestionList.length>0?<>
                   
                            <div style={{flex:'auto',padding:20,position:'relative',overflowY:'auto'}}>
                                {this.que()}

                            </div>
                            
                            <div className={style._pagination}>
                                <ConfigProvider locale={zhCN}>
                                    <Pagination  
                                        // current={1} 
                                        defaultCurrent={1}
                                        pageSizeOptions={["10","20","50"]}
                                        showQuickJumper ={true}
                                        hideOnSinglePage={false} 
                                        showSizeChanger={true}
                                        onChange={(page,pagesize)=>this.changePagination(page,pagesize)} 
                                        total={100} />
                                </ConfigProvider>
                                
                            </div>
                        </>:<Empty description='暂无题目' style={{marginTop:200}}></Empty>
                    }
                    {this.props.state.queryManageQues?
                    <Spin  className={style._sping}/>:''}
                </div> 


                <KnowledgeModal
                    knowledgeModalVisible={this.state.knowledgeModalShow}
                    currentQue={this.state.nowque}
                    hideModal={()=>{
                        this.setState({
                            knowledgeModalShow:false
                        })
                    }}
                    updateSuccess={(res)=>{
                        console.log('res: ', res);

                    }}
                /> 
                </div>           
            </Layout>
        )
    }
    componentDidMount() {
        // this.props.dispatch({
        //     type: 'report/tree',
        //     payload: {
        //         subjectId: 8,
        //         phaseId: 3
        //     }
        // }).then(data => {
        //     this.setState({
        //         treeStructure: data,
        //         loading: false
        //     })
        // })
    }
}


export default connect((state) => ({
    state: {
        ...state.manageQuestion
      }
}))(manageQuestion);