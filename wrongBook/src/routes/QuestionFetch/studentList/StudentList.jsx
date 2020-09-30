import React from 'react';
import {
	Layout, Table, Modal, Select, Spin, Checkbox, Button,DatePicker, message, Empty
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
			currentChild:{}
		};
		this.studentColum = [
			{
				title: '序号',
				align: 'center',
				render: (text, record, index) => `${index + 1}` // 显示每一行的序号
			},
			{
			title: '姓名',
			dataIndex: 'userName',
			align: 'center',
			editable: true,
			render: (text, record) => {
				return (
					<span className={style.name_span}
						onClick={()=>{
							let msg=''
							console.log('->',this.props.state.subId,this.props.sdate)
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
								currentChild:record
							})
							queryPage=1
							this.props.dispatch({
								type: 'homePage/doQueryChilQuestions',
								payload: {
									subjectId: this.props.state.subId,
									startTime: this.props.sdate,
									childId: record.userId,
									pageSize,
									page: 1
								}
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
			render: (text, record) => (text)
		}, {
			title: <div >修改题目顺序</div>,
			dataIndex: 'parentPhones',
			align: 'center',
			editable: false,
			className:'thphone',
			render: (text, record,index) => {
				return(
					<Button 
						loading={this.state.studentLoadingIndex===index}
						onClick={()=>{
							const key='loadingModel'
							this.setState({
								studentLoadingIndex:index
							})
							message.destroy()
							message.loading({content:`正在修改【${record.userName}】的题目排序`,duration:1,key})

							setTimeout(() => {
								message.success({content:`【${record.userName}】的题目排序修改成功`,duration:1,key})
								this.setState({
									studentLoadingIndex:-1
								})
							}, 1000);
							console.log('record: ', record);

						}}>
					修改</Button>
				)
			}
		}, {
			title: <div >请勾选一个学生按照时间查询错题</div>,
			align: 'center',
			editable: false,
			render: (text, record,index) => {
				return record.qustionlist?record.qustionlist.map((item, i) => {
					return (
						<Checkbox
							key={i}
							checked={(record.userId&&this.props.state.saleId===record.userId)||(record.questionHook&&record.questionHook[`${index}-${i}`])}
							disabled={record.userId&&this.props.state.saleId===record.userId}
							onClick={(e) => {
								e.preventDefault()
								e.stopPropagation()
								this.onChangeCheck(index,i,record)
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
	onChangeCheck(index,i,ele){
        console.log("HomeworkCenter -> onChangeCheck -> index,i,ele", index,i,ele)
		let qh=ele.questionHook||{}
        console.log("HomeworkCenter -> onChangeCheck -> qh", qh)
		if(qh[`${index}-${i}`]){
			delete qh[`${index}-${i}`]
		}else{
			qh[`${index}-${i}`]=true
		}
		let _pageHomeworkDetiles = this.props.state.classStudentList;
		_pageHomeworkDetiles[index].questionHook=qh
		this.props.dispatch({
			type: 'classModel/classStudentList',
			payload: _pageHomeworkDetiles
		})
	}
	onOkTime(item,index,value) {
		console.log('item,index,value: ', item,index,value);
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
			})
			if(res.data.result===0){
				message.success({content:'修改成功',key})
			}else{
				message.error({content:'修改失败',key})
			}
		})
	}

  //滚动加载错题
	qustionsContainerScroll(e) {
		if (_quecontainerScrollHeight-200 < e.target.scrollTop + e.target.clientHeight&&this.state.hasNextPage&&!this.state.quering) {
			  queryPage++
				this.setState({
					quering:true
				})
				this.props.dispatch({
					type: 'homePage/doQueryChilQuestionsNext',
					payload: {
						subjectId: this.props.state.subId,
						startTime: this.props.sdate,
						childId: this.state.currentChild.userId,
						pageSize,
						page: queryPage
					}
				}).then((res) => {
					console.log('cuerrent ques: ', res);
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
				console.log(selectedRowKeys, selectedRows)
				this.props.selectStudentHander(selectedRowKeys,selectedRows)
				this.props.dispatch({
					type: 'homePage/setSaleId',
					payload: selectedRowKeys.userId
				})
			}
		}

		let columns = this.studentColum;

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
								<Spin spinning={!this.props.state.getClassMembersFinish} style={{height:'100%'}}> 
									<div className={style.table}>
										<Table
											rowSelection={rowRadioSelection}
											rowKey={record => record.userId}
											className={style.scoreDetTable}
											dataSource={dataSource}
											columns={columns}
											pagination={false}
											style={{ userSelect: 'text' }}
											rowClassName="editable-row" />

									</div>
								</Spin>
							</div>
						</div>
					</Content>
				</Layout >

				<Modal
            zIndex={102}
            maskClosable={false}
            afterClose={()=>{
              console.log('hide')
            }}
            visible={this.state.queModalVisible}
            destroyOnClose={true}
            footer={null}
            style={{top:50,minWidth:950}}
            width='950px'
            title={`修改时间-${this.state.chilDName}`}
            onCancel={()=>{
              this.setState({
                queModalVisible: false
              })
            }}
            >
						<Spin spinning={this.state.getQuestioning}>
							<div style={{display:'flex',minHeight:150}}>
								{
										this.props.state.childQuestionData.times.length<=0&&this.props.state.childQuestionData.questions.length<=0?<Empty className={style.noclass} description='暂无数据' style={{ position: 'relative', top: 80, transform: 'translate(0, -50%)',margin:"auto" }} />:
										<>
											<div className={style._modal_time} style={{padding:0,minHeight:400,overflow:'auto',maxHeight:800}}>
													{
														this.props.state.childQuestionData.times.map((time,qj)=>{
															return(
																<div key={`${qj}`} style={{width:'100%',marginBottom:10}}>
																	<div>{time}</div>
																</div>
															)
														})
													}
											</div>
											<div style={{flex:"auto",paddingLeft:10}}>
													<div 
														style={{padding:0,minHeight:400,overflow:'auto',maxHeight:800}}
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
															{
																this.props.state.childQuestionData.questions.map((que,qi)=>{
																	return(
																		<div key={`${qi}`} style={{marginBottom:15}}>
																			{que.showAddTime?
																				<div className={style.time_item} style={{marginBottom:10,fontSize:15}}
																				>
																					<span>
																						{que.uploadTime}
																					</span>
																					<div>
																						<DatePicker  format="YYYY-MM-DD HH:mm" width={200} panelRender={'选择时间修改'} locale={locale} showTime onOk={this.onOkTime.bind(this,que,qi)}  />
																					</div>
																				</div>:''
																				}
																			<img style={{width:'100%'}} src={que.questionUrls} alt=""/>
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
		// this.props.dispatch({
		// 	type: 'homePage/getGrade',
		// 	payload: { schoolId: store.get('wrongBookNews').schoolId }
		// })

		// this.props.dispatch({
		// 	type: 'homePage/subjectNodeList',
		// 	payload: {}
		// })
	}
	UNSAFE_componentWillMount() {
		// this.props.dispatch({
		// 	type: 'homePage/tealist',
		// 	payload: []
		// });
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
