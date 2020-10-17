import React from 'react';
import {
	Layout, Table, Modal, Select, Spin, Checkbox, Button,DatePicker, message, Empty,InputNumber 
} from 'antd';
import { connect } from 'dva';
import style from './studentList.less';
import store from 'store';
import observer from '../../../utils/observer'
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
moment.locale('zh-cn');
const { Content } = Layout;
const Option = Select.Option;
let queryPage=1
let _quecontainerScrollHeight=200
let pageSize=50
class HomeworkCenter extends React.Component {

	constructor(props) {
		super(props);
		this.Ref = ref => {
			this.questionContainerRef = ref
		};
		this.state = {
			selectUser: '',
			queModalVisible:false,
			chilDName:'',
			getQuestioning:true,
			studentLoadingIndex:-1,
			hasNextPage:true,
			quering:false,
			currentChild:{},
			_currentDateIndex:0,
			updateQuenuming:false
		};
		this.studentColum = [
			{
				title: '序号',
				align: 'center',
				render: (record) => record.index // 显示每一行的序号
			},
			{
			title: '姓名',
			dataIndex: 'userName',
			width:100,
			align: 'center',
			editable: true,
			render: (text, record) => {
				return (
					<span className={style.name_span}
						onClick={()=>{
							let msg=''
							if(!this.props.state.subId){
								msg='请选择学科'
							}
							if(!this.props.sdate){
								msg='请选择时间'
							}
							if(msg){
								message.destroy()
								message.warn(msg)
								return
							}
							this.setState({
								getQuestioning:true,
								currentChild:record,
								_currentDateIndex:0
							})
							queryPage=1


							let prdata={
								subjectId: this.props.state.subId,
								startTime: this.props.sdate,
								childId: record.userId,
								pageSize,
								page: queryPage
							}
							if(this.props.edate){
								prdata.endTime=this.props.edate
							}
							prdata={
								subjectId: 2,
								startTime: "2020-09-15",
								childId: 7093,
								pageSize: 50,
								page: 1,
								endTime: "2020-10-14"
							}
							prdata.startTime="2020-09-15"

							this.props.dispatch({
								type: 'homePage/doQueryChilQuestions',
								payload: prdata
							}).then((ques) => {
								this.setState({
									getQuestioning:false
								})
							})
							this.setState({
								queModalVisible:true,
								chilDName:record.userName
							})
						}}
					>{text}</span>
				)
			}
		}, {
			title: '账号',
			dataIndex: 'account',
			align: 'center',
			editable: true,
			render: (text) => (text)
		}, {
			title: <div >修改题目顺序</div>,
			dataIndex: 'parentPhones',
			align: 'center',
			editable: false,
			className:'thphone',
			render: ( record,index) => {
				return(
					<Button 
						loading={this.state.studentLoadingIndex===index}
						onClick={()=>{
							const key='loadingModel'
							this.setState({
								studentLoadingIndex:index
							})
							message.destroy()
							message.loading({content:`正在修改【${record.userName}】的题目排序`,key})

							this.props.dispatch({
								type: 'homePage/_updateQuestionsNum',
								payload: {
									userId:record.userId,
									start:moment(this.props.sdate).unix()||"1601256270000"
								}
							}).then(res=>{
								if(res&&res.data.success){
									message.success({content:`【${record.userName}】的题目排序修改成功`,duration:2,key})
								}else{
									message.error({content:`【${record.userName}】的题目排序修改失败`,duration:2,key})
								}
	
								
								this.setState({
									studentLoadingIndex:-1
								})

							})


						}}>
					修改</Button>
				)
			}
		 },
		  {
			title: <div >请勾选一个学生按照时间查询错题</div>,
			align: 'left',
			render: (record) => {
				return record.qustionlist?record.qustionlist.map((item,i) => {
					return (
						<Checkbox
							key={`${i}${record.index}`}
							checked={(record.userId&&this.props.state.saleId===record.userId)||(record.questionHook&&record.questionHook[`${record.index-1}-${i}`])}
							disabled={record.userId&&this.props.state.saleId===record.userId}
							onChange={() => {
								this.onChangeCheck(record,i)
							}}
						>
						{i+1}
					</Checkbox>
					)
				}) :''
			}
		 },
		];

	}
	onChangeCheck=(ele,i)=>{
		const index=ele.index-1
		let qh=ele.questionHook||{}
		if(qh[`${index}-${i}`]){
			delete qh[`${index}-${i}`]
		}else{
			qh[`${index}-${i}`]=true
		}
		
		let _pageHomeworkDetiles = this.props.state.classStudentList;
		// let _index=ele.index-1
		// _pageHomeworkDetiles[_index].qustionlist[i].selected=e.target.checked
		_pageHomeworkDetiles[index].questionHook=qh
		
		this.props.dispatch({
			type: 'classModel/classStudentList',
			payload: _pageHomeworkDetiles
		})
	}
	onOkTime(item,index,value) {
		const key='changetime'
		message.loading({content:'正在修改时间...',key})
		let newDate=moment(value).format('YYYY-MM-DD HH:mm:ss')
		this.props.dispatch({
			type:'homePage/_updatePageDate',
			payload:{
				pageId:item.page,
				date:newDate
			}
		}).then(res=>{
			this.props.dispatch({
				type:'homePage/updateChangeDateSuccess',
				payload:{
					questions:this.props.state.childQuestionData.questions,
					oldDate:item.uploadTime,
					newDate
				}
			}).then(()=>{
				if(res.data.result===0){
					message.success({content:'修改成功',key})
				}else{
					message.error({content:'修改失败',key})
				}
			})
			
		})
	}

  //滚动加载错题
	qustionsContainerScroll(e) {
		console.log('滚到底部?',_quecontainerScrollHeight < e.target.scrollTop + e.target.clientHeight)
		if (_quecontainerScrollHeight< e.target.scrollTop + e.target.clientHeight&&this.state.hasNextPage&&!this.state.quering) {
			  queryPage++
				this.setState({
					quering:true
				})
				let prdata={
					subjectId: this.props.state.subId,
					startTime: this.props.sdate,
					childId: this.state.currentChild.userId,
					pageSize,
					page: queryPage
				}
				if(this.props.edate){
					prdata.endTime=this.props.edate
				}
				this.props.dispatch({
					type: 'homePage/doQueryChilQuestionsNext',
					payload: prdata
				}).then((res) => {
					if(res.data.result===0&&res.data.data.list){
						this.setState({
							hasNextPage:res.data.data.list.length>=pageSize
						})
					}else{
						this.setState({
							hasNextPage:false
						})
						queryPage=1
					}
					setTimeout(() => {
						this.setState({
							quering:false
						})
					}, 300);
				})
		}
	}

	confirmTimeModal=()=>{
		this.setState({
			updateQuenuming:true
		})
		let r=[]
		let _update=false
		for (let index = 0; index < this.props.state.childQuestionData.questions.length; index++) {
			const element = this.props.state.childQuestionData.questions[index]
			if(element.newnum){
				_update=true
			}
			r.push({
				questionId: element.wrongId,
				num: element.newnum||element.trueNum,
			})
		}
		if(!_update){
			this.setState({
				updateQuenuming:false,
				queModalVisible:false
			})
			return
		}
		this.props.dispatch({
			type:'homePage/quesort',
			payload:{
				questions:r
			}
		}).then((res)=>{
			this.setState({
				queModalVisible:res.data.result!=0,
				updateQuenuming:false
			})
		})
		
	}
	render() {
		let state = this.props.state;
		let dataSource = state.classStudentList;
		let rowRadioSelection={
			type:'radio',
			columnTitle:"选择",
			selectedRowKeys:this.props.state._selectedRowkey,
			onSelect: (selectedRowKeys, selectedRows) => {
				this.props.dispatch({
					type: 'homePage/_selectedRowkey',
					payload: [selectedRowKeys.userId]
				})
				this.props.selectStudentHander(selectedRowKeys,selectedRows)
				this.props.dispatch({
					type: 'homePage/setSaleId',
					payload: selectedRowKeys.userId
				})
			}
		}


		let sublist = this.props.state.sublist;
		const children = [];
		if (sublist.data) {
			for (let i = 0; i < sublist.data.length; i++) {
				let data = sublist.data[i]
				children.push(<Option key={data.k}>{data.v}</Option>);
			}
		}
		

		return (
			<>
				<Layout style={{
							overflow: 'auto',
							maxHeight:'calc( 100% - 50px )'
					}}>
					<Content style={{ background:"#fff" }}>
						<div className={style.gradeboder} >
							<div style={{position:'relative'}}>
							<div className={style.table}>
								<Table
									loading={!this.props.state.getClassMembersFinish}
									rowSelection={rowRadioSelection}
									key={record => record.index}
									rowKey={record => record.userId}
									className={style.scoreDetTable}
									dataSource={dataSource}
									columns={this.studentColum}
									pagination={true}
									style={{ userSelect: 'text' }}
									rowClassName="editable-row" />

							</div>
							</div>
						</div>
					</Content>
				</Layout >

				<Modal
            zIndex={102}
            maskClosable={false}
            afterClose={()=>{
							this.props.dispatch({
								type:'homePage/childQuestionData',
								payload:{
									questions:[],
									times:[]
								}
							})
            }}
            visible={this.state.queModalVisible}
            destroyOnClose={true}
            style={{top:30,minWidth:950}}
            width='950px'
						title={`修改时间-${this.state.chilDName}`}
						okText='确定'
						cancelText='取消'
            onCancel={()=>{
              this.setState({
                queModalVisible: false
              })
						}}
						okButtonProps={{loading:this.state.updateQuenuming}}
						onOk={()=>{
							this.confirmTimeModal()
						}}
            >
						<Spin spinning={this.state.getQuestioning}>
							<div style={{display:'flex',minHeight:150}}>
								{
										this.props.state.childQuestionData.times.length<=0&&this.props.state.childQuestionData.questions.length<=0?<Empty className={style.noclass} description='暂无数据' style={{ position: 'relative', top: 80, transform: 'translate(0, -50%)',margin:"auto" }} />:
										<>
											<div className={style._modal_time} style={{padding:0,minHeight:400,overflow:'auto',maxHeight:750}}>
													{
														this.props.state.childQuestionData.times.map((time,qj)=>{
															return(
																<div key={`${qj}`} style={{width:'100%',marginBottom:10}}
																	onClick={()=>{
																		this.setState({
																			_currentDateIndex:qj
																		})
																		document.getElementById('question_con').scrollTop = document.getElementById(time).offsetTop
																	}}
																>
																	<span className={this.state._currentDateIndex===qj?style.currentIndexTime:''}>{time}</span>
																</div>
															)
														})
													}
											</div>
											<div style={{flex:"auto",paddingLeft:10}}>
													<div 
														id="question_con"
														style={{padding:0,minHeight:400,overflow:'auto',maxHeight:750}}
														ref={this.Ref}
														onScroll={(e)=>this.qustionsContainerScroll(e)}
														onWheel={(e) => {
															const { scrollHeight } = this.questionContainerRef;
															_quecontainerScrollHeight = scrollHeight;
														}}
													>
														<div
															className={style.clearfix}
														
														>
															{console.log('_ques:',this.props.state.childQuestionData.questions)}
															{
																this.props.state.childQuestionData.questions.map((que,qi)=>{
																	return(
																		<div key={`${qi}${que.questionId}`} style={{marginBottom:15}}>
																			{
																				que.showAddTime?<div className='_flex _ver_align_center'>
																					<div>习题册名称：{que._name?que._name:'未知'}</div>
																					<div style={{marginLeft:20}}>共计：12题</div>
																				</div>:''
																			}
																			<div className={style.time_item} id={que.uploadTime} style={{marginBottom:10,fontSize:15}}
																				>
																				{
																					que.showAddTime?
																						<div style={{display:'flex',alignItems:'center'}}>
																							<span style={{marginRight:14}}>
																								{que.uploadTime}
																							</span>
																							<div>
																								<DatePicker  
																									disabledDate={current => current && current > moment().endOf('day') || current < moment().subtract(30, 'day')}
																									format="YYYY-MM-DD HH:mm:ss" 
																									width={200} panelRender={'选择时间修改'} 
																									locale={locale} showTime 
																									onOk={this.onOkTime.bind(this,que,qi)}  
																									/>
																							</div>
																						</div>
																					:<div></div>
																				}

																			
																				<div style={{display:'flex',alignItems:'center'}}>
																						<span>页码：{que._name?que._name:'未知'}</span>
																						<span style={{margin:'0 20px'}}>题号：{que._name?que._name:<span style={{color:'red'}}>ID{que.num}</span>}</span>
																						<div>
																							排序：
																							<InputNumber min={1} style={{width:60}} defaultValue={que.trueNum!=undefined?que.trueNum:0} placeholder='序号' 
																								onChange={(v)=>{
																									if(v){
																										this.props.state.childQuestionData.questions[qi].newnum=parseInt(v.toString().replace(/[^0-9]/ig,""))
																									}
																									
																								}}
																								formatter={value => value.replace(/[^0-9]/ig,"")}
																							></InputNumber>
																						</div>
																				</div>
																			</div>
																			<div style={{position:'relative'}}>
																				<img style={{width:'100%',border:'1px solid #ddd'}} src={que.questionUrls} alt=""/>
																				{
																					que._isimg?<span style={{position:'absolute',right:0,top:0,padding:4,background:'rgba(0,0,0,.6)',color:'#fff'}}>按原图打印</span>:''
																				}
																			</div>
																		</div>
																	)
																})
															}
																{/* 后期加入加载提示 */}

															</div>
														</div>
												
													</div>
										</>
								}

								
							</div>
							
						</Spin>
            </Modal>
			</>
		);
	}
	componentDidMount() {
		
	}
	UNSAFE_componentWillMount() {

	}
	componentWillUnmount(){
		this.props.dispatch({
			type: 'homePage/_selectedRowkey',
			payload: []
		})
		this.props.dispatch({
			type: 'homePage/setSaleId',
			payload: 0
		})
	}

}

export default connect((state) => ({
	state: {
		...state.homePage,
		getClassMembersFinish:state.classModel.getClassMembersFinish,
		classStudentList:state.classModel.classStudentList,
		subId:state.temp.subId,
	}
}))(HomeworkCenter);
