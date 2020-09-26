import React from 'react';
import {
  Layout, Menu,Spin , Button, message,DatePicker,Select, Popover,Input, Icon, Popconfirm,Empty,Modal, Checkbox
} from 'antd';
import {ImageUploader} from '../../../utils/ImageUploader'
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import style from './AddWork.less';
import moment from 'moment';
import store from 'store';
import UploadItem from '../Upload/Upload'
import Section from '../Section/Section'
import EditPageModal from '../EditPageModal/EditPageModal'

//作业中心界面内容
const Option = Select.Option;
const { Sider, Content,
} = Layout;

class WorkManage extends React.Component {
  constructor(props) {
	super(props);
		this.showCropModel=this.showCropModel.bind(this);
    	this.state = {

			test22:{
				"groupList": [],
				"partList": [
								{
					"createTime": "2020-09-25 15:10:46",
					"createUserId": 4361471476795392,
					"examId": 10,
					"orderBy": 1,
					"pageId": 0,
					"partAngle": 0,
					"partHeight": 0,
					"partId": 111,
					"partName": "图片2",
					"partUrl": "https://homework.mizholdings.com/kacha/xcx/page/1601017845881.jpg",
					"partWidth": 0,
					"questions": [{
						"aftId": "",
						"analysis": "B",
						"areaList": [{
							"areaHeight": 246,
							"areaId": 494,
							"areaUrl": "https://homework.mizholdings.com/kacha/xcx/page/1601017845881.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/0.0/crop/!515.136943852049x369.84375a52.03125a53.4375",
							"areaWidth": 343,
							"pointX": 34,
							"pointY": 35,
							"qusId": 0
						}],
						"createTime": "2020-09-25 15:10:46",
						"createUserId": 4361471476795392,
						"examId": 10,
						"groupId": 0,
						"groupNum": 0,
						"kachaPageId": 0,
						"kachaQuestionId": 0,
						"knowledgeIds": "",
						"knowledgeNames": "",
						"orderBy": 1,
						"partId": 111,
						"qusAnswer": "B",
						"qusContent": "",
						"qusId": 499,
						"qusScore": 0,
						"qusTitle": "0",
						"qusType": "4",
						"remark": "图片2",
						"status": 0,
						"subjectId": 0
					}, {
						"aftId": "",
						"analysis": "D",
						"areaList": [{
							"areaHeight": 197,
							"areaId": 495,
							"areaUrl": "https://homework.mizholdings.com/kacha/xcx/page/1601017845881.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/-0.0/crop/!515.136943852049x296.71875a50.625a423.28125",
							"areaWidth": 343,
							"pointX": 33,
							"pointY": 282,
							"qusId": 0
						}],
						"createTime": "2020-09-25 15:10:46",
						"createUserId": 4361471476795392,
						"examId": 10,
						"groupId": 0,
						"groupNum": 0,
						"kachaPageId": 0,
						"kachaQuestionId": 0,
						"knowledgeIds": "",
						"knowledgeNames": "",
						"orderBy": 1,
						"partId": 111,
						"qusAnswer": "D",
						"qusContent": "",
						"qusId": 500,
						"qusScore": 0,
						"qusTitle": "1",
						"qusType": "4",
						"remark": "图片2",
						"status": 0,
						"subjectId": 0
					}, {
						"aftId": "",
						"analysis": "",
						"areaList": [{
							"areaHeight": 155,
							"areaId": 496,
							"areaUrl": "https://homework.mizholdings.com/kacha/xcx/page/1601017845881.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/-0.0/crop/!515.136943852049x233.4375a49.21875a720.0",
							"areaWidth": 343,
							"pointX": 32,
							"pointY": 480,
							"qusId": 0
						}],
						"createTime": "2020-09-25 15:10:46",
						"createUserId": 4361471476795392,
						"examId": 10,
						"groupId": 0,
						"groupNum": 0,
						"kachaPageId": 0,
						"kachaQuestionId": 0,
						"knowledgeIds": "",
						"knowledgeNames": "",
						"orderBy": 1,
						"partId": 111,
						"qusAnswer": "",
						"qusContent": "",
						"qusId": 501,
						"qusScore": 0,
						"qusTitle": "2",
						"qusType": "0",
						"remark": "图片2",
						"status": 0,
						"subjectId": 0
					}, {
						"aftId": "",
						"analysis": "A",
						"areaList": [{
							"areaHeight": 236,
							"areaId": 497,
							"areaUrl": "https://homework.mizholdings.com/kacha/xcx/page/1601017845881.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/-0.0/crop/!515.136943852049x355.78125a45.0a953.4375",
							"areaWidth": 343,
							"pointX": 30,
							"pointY": 635,
							"qusId": 0
						}],
						"createTime": "2020-09-25 15:10:46",
						"createUserId": 4361471476795392,
						"examId": 10,
						"groupId": 0,
						"groupNum": 0,
						"kachaPageId": 0,
						"kachaQuestionId": 0,
						"knowledgeIds": "",
						"knowledgeNames": "",
						"orderBy": 1,
						"partId": 111,
						"qusAnswer": "A",
						"qusContent": "",
						"qusId": 502,
						"qusScore": 0,
						"qusTitle": "3",
						"qusType": "4",
						"remark": "图片2",
						"status": 0,
						"subjectId": 0
					}, {
						"aftId": "",
						"analysis": "",
						"areaList": [{
							"areaHeight": 100,
							"areaId": 498,
							"areaUrl": "https://homework.mizholdings.com/kacha/xcx/page/1601017845881.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/-0.0/crop/!515.136943852049x150.3903609157642a45.0a1309.21875",
							"areaWidth": 343,
							"pointX": 30,
							"pointY": 872,
							"qusId": 0
						}],
						"createTime": "2020-09-25 15:10:46",
						"createUserId": 4361471476795392,
						"examId": 10,
						"groupId": 0,
						"groupNum": 0,
						"kachaPageId": 0,
						"kachaQuestionId": 0,
						"knowledgeIds": "",
						"knowledgeNames": "",
						"orderBy": 1,
						"partId": 111,
						"qusAnswer": "",
						"qusContent": "",
						"qusId": 503,
						"qusScore": 0,
						"qusTitle": "4",
						"qusType": "0",
						"remark": "图片2",
						"status": 0,
						"subjectId": 0
					}, {
						"aftId": "",
						"analysis": "A",
						"areaList": [{
							"areaHeight": 80,
							"areaId": 499,
							"areaUrl": "https://homework.mizholdings.com/kacha/xcx/page/1601017845881.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/-0.0/crop/!458.6800846733504x120.9375a575.15625a73.125",
							"areaWidth": 305,
							"pointX": 383,
							"pointY": 48,
							"qusId": 0
						}],
						"createTime": "2020-09-25 15:10:46",
						"createUserId": 4361471476795392,
						"examId": 10,
						"groupId": 0,
						"groupNum": 0,
						"kachaPageId": 0,
						"kachaQuestionId": 0,
						"knowledgeIds": "",
						"knowledgeNames": "",
						"orderBy": 1,
						"partId": 111,
						"qusAnswer": "A",
						"qusContent": "",
						"qusId": 504,
						"qusScore": 0,
						"qusTitle": "5",
						"qusType": "4",
						"remark": "图片2",
						"status": 0,
						"subjectId": 0
					}, {
						"aftId": "",
						"analysis": "B",
						"areaList": [{
							"areaHeight": 97,
							"areaId": 500,
							"areaUrl": "https://homework.mizholdings.com/kacha/xcx/page/1601017845881.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/-0.0/crop/!458.6800846733504x146.25676066104597a575.15625a194.0625",
							"areaWidth": 305,
							"pointX": 383,
							"pointY": 129,
							"qusId": 0
						}],
						"createTime": "2020-09-25 15:10:46",
						"createUserId": 4361471476795392,
						"examId": 10,
						"groupId": 0,
						"groupNum": 0,
						"kachaPageId": 0,
						"kachaQuestionId": 0,
						"knowledgeIds": "",
						"knowledgeNames": "",
						"orderBy": 1,
						"partId": 111,
						"qusAnswer": "B",
						"qusContent": "",
						"qusId": 505,
						"qusScore": 0,
						"qusTitle": "6",
						"qusType": "4",
						"remark": "图片2",
						"status": 0,
						"subjectId": 0
					}, {
						"aftId": "",
						"analysis": "B",
						"areaList": [{
							"areaHeight": 324,
							"areaId": 501,
							"areaUrl": "https://homework.mizholdings.com/kacha/xcx/page/1601017845881.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/0/crop/!458.6800846733504x486.8083284341101a576.5625a340.3125",
							"areaWidth": 305,
							"pointX": 384,
							"pointY": 226,
							"qusId": 0
						}],
						"createTime": "2020-09-25 15:10:46",
						"createUserId": 4361471476795392,
						"examId": 10,
						"groupId": 0,
						"groupNum": 0,
						"kachaPageId": 0,
						"kachaQuestionId": 0,
						"knowledgeIds": "",
						"knowledgeNames": "",
						"orderBy": 1,
						"partId": 111,
						"qusAnswer": "B",
						"qusContent": "",
						"qusId": 506,
						"qusScore": 0,
						"qusTitle": "7",
						"qusType": "4",
						"remark": "图片2",
						"status": 0,
						"subjectId": 0
					}, {
						"aftId": "",
						"analysis": "",
						"areaList": [{
							"areaHeight": 197,
							"areaId": 502,
							"areaUrl": "https://homework.mizholdings.com/kacha/xcx/page/1601017845881.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/-0.0/crop/!448.59375x296.8386902137464a592.03125a826.875",
							"areaWidth": 298,
							"pointX": 394,
							"pointY": 550,
							"qusId": 0
						}],
						"createTime": "2020-09-25 15:10:46",
						"createUserId": 4361471476795392,
						"examId": 10,
						"groupId": 0,
						"groupNum": 0,
						"kachaPageId": 0,
						"kachaQuestionId": 0,
						"knowledgeIds": "",
						"knowledgeNames": "",
						"orderBy": 1,
						"partId": 111,
						"qusAnswer": "",
						"qusContent": "",
						"qusId": 507,
						"qusScore": 0,
						"qusTitle": "8",
						"qusType": "0",
						"remark": "图片2",
						"status": 0,
						"subjectId": 0
					}, {
						"aftId": "",
						"analysis": "",
						"areaList": [{
							"areaHeight": 190,
							"areaId": 503,
							"areaUrl": "https://homework.mizholdings.com/kacha/xcx/page/1601017845881.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/-0.0/crop/!448.59375x285.91566093895176a600.46875a1123.59375",
							"areaWidth": 298,
							"pointX": 400,
							"pointY": 748,
							"qusId": 0
						}],
						"createTime": "2020-09-25 15:10:46",
						"createUserId": 4361471476795392,
						"examId": 10,
						"groupId": 0,
						"groupNum": 0,
						"kachaPageId": 0,
						"kachaQuestionId": 0,
						"knowledgeIds": "",
						"knowledgeNames": "",
						"orderBy": 1,
						"partId": 111,
						"qusAnswer": "",
						"qusContent": "",
						"qusId": 508,
						"qusScore": 0,
						"qusTitle": "9",
						"qusType": "0",
						"remark": "图片2",
						"status": 0,
						"subjectId": 0
					}],
					"remark": "图片2",
					"status": 0
				}],
				"info": {
					"classId": ",2935,",
					"className": "",
					"createTime": "2020-09-21 18:33:19",
					"createUserId": 4361471476795392,
					"createUserName": "",
					"examId": 10,
					"examName": "2020年09月21日科学作业-1",
					"schoolId": 8256,
					"status": 9,
					"subjectId": 10,
					"subjectName": "",
					"workTime": "2020-09-23 00:00:00",
					"years": 0
				}
			},
			_partList:[
			],
				 
			showEditPictureModal:false,
			cpicture:{},
			visible:false,
			
			cpindex:0,
			commitWorking:false,
			saveWorking:false,
			work:{
				info:{
					examName:'未命名作业',
					className:'',
					classId:[], //classess
					subjectId:1,
					pages:[],
					workTime:''//time
				},
				groupList:[],
				partList:[]
			
			},
			editWorkName:false,
			editWorkName:false,
			workNameFail:false,
			lookQuestion:false,
			partQuestions:{
				part:[
					// { name:'',
					// 	questions:[]
					// } //每一个章节
				],
				questions:[
					
				]
			},
			selectQuestions:[],
			editPartNameIndex:-1,
			editPartName:false,
			ischecked:false,
			drapQuetionIndex:[],
			partActiveIndex:-1,
			mouseIsDown:false,
			hideTopContainer:false,
			fixedWidth:'100%',
			_boxWidth:'',
			picture:{
				"questions": [],
				"url": "https://homework.mizholdings.com/kacha/xcx/page/4645964827397120.5041112551802880.1600164913791.jpg?imageMogr2/auto-orient",
				"serUrl": "https://homework.mizholdings.com/kacha/xcx/page/4645964827397120.5041112551802880.1600164913791.jpg?imageMogr2/auto-orient",
				"_displayImage": {
					"width": 720,
					"height": 499.95,
					"left": 0,
					"top": 0
				},
				resCode:-1
			},
			iscreateWork:true,
			createWorking:false,
			_editWorkClassList:[]
    }
	}

	
	
  
  

	renderSchoolSubjectList() {
		let subList = this.props.state.schoolSubjectList;
		const children = [];
		for (let i = 0; i < subList.length; i++) {
		let item = subList[i]
		children.push(	<Option key={i} value={item.k}>{item.v}</Option>);
		}
			return (
		<>
			<Select
			style={{ width: 90,marginRight:20 }}
			suffixIcon={<Icon type="caret-down" style={{ color: "#646464", fontSize: 10 }} />}
			optionFilterProp="children"
			placeholder="请选择学科"
			defaultValue='学科'
			value={this.props.state.schoolSubId}
			onPopupScroll={(e)=>{
				e.stopPropagation()
			}}
			onChange={(value) => {
				this.props.dispatch({
					type:"workManage/schoolSubId",
					payload:value
				})
				let item=subList.find((va)=>{return va.k==value})

				this.initWorkName(item)
				}}>
			{children}
			</Select>
		</>
		)
	}
	renderClassList() {
			let classes = this.props.state.workPageClass.list;
			let _value=this.props.state.workPageClass.value
			if(false&&!this.state.createWork){
				_value=this.state._editWorkClassList
			}
			console.log('value',_value)
			const children = [];
			for (let i = 0; i < classes.length; i++) {
			let item = classes[i]
			//要根据编辑和创建动态处理
			children.push(	<Option key={i} value={item.classId}>{item.className}</Option>);
			}
				return (
			<>
			<Select
						mode="multiple"
						style={{ width: 200,marginRight:20 }}
						suffixIcon={<Icon type="caret-down" style={{ color: "#646464", fontSize: 10 }} />}
						optionFilterProp="children"
						value={_value}
						placeholder="请选择班级"
						onPopupScroll={(e)=>{
							e.stopPropagation()
						}}
						onChange={(value) => {
								console.log('value: ', value);
								this.props.dispatch({
									type:"workManage/workPageClass",
									payload:{
										list:classes,
										value
									}
								})
								this.state.work.info.classId=value
								this.setState({
									work:this.state.work
								})
								console.log(this.state.work)
						}}>
					{children}
			</Select>
		</>
		)
	}
	async uploadImage(file,pitem){
		// let imgStr=base64img.substring(base64img.indexOf(',/')+1)
		let _index=this.state._partList.findIndex((value)=>value._pageId==pitem._pageId)


		let _ImageUploader=new ImageUploader()
		let partUrl=await _ImageUploader.uploadToQiniu(file)
		if(!partUrl) return 
		let option={
			examId:this.state.work.info.examId,
			partName:pitem.partName,
			remark:pitem.partName,
			partUrl
		}

		let res=await _ImageUploader.createPartAndDiscover(option)
		console.log('upload res: ', res.data);
		let _newdata={
			...this.state._partList[_index]
		}
		if(res.code===0||res.code===2){
			_newdata={
				..._newdata,
				...res.data
			}
		}else{
			
		}
		_newdata.resCode=res.code
		console.log('_newdata: ', _newdata);
		this.state._partList.splice(_index,1,_newdata)
		this.setState({
			_partList:this.state._partList
		})
		console.log('this.state._partList: ', this.state._partList);
		this.getWorkData()
	}

	getWorkData(){
		let partQuestions=this.state.partQuestions
		this.props.dispatch({
			type:"workManage/getExamInfo",
			payload:{
				examId:this.props.location.examId||10
			}
		}).then(workdata=>{
			console.log('workdata: ', workdata);
			if(!workdata){
				message.destroy()
				message.warn('作业没有数据')
				return
			}
			let _classids=workdata.info.classId.split(',')
			let classarr=[]
			for (let index = 0; index < _classids.length; index++) {
				const classid = _classids[index];
				if(classid) classarr.push(parseInt(classid))
			}
			//编辑作业的情况
			
			this.setState({
				work:{
					...workdata
				},
				_editWorkClassList:classarr
			})


			let _arr=[]
			for (let index = 0; index < workdata.partList.length; index++) {
				const element = workdata.partList[index]
				if(element.questions.length){
				
					for (let j = 0; j < element.questions.length; j++) {
						_arr.push(element.questions[j])
						
					}
				}
			}
			partQuestions.questions=_arr

			this.setState({
				partQuestions:partQuestions
			})
		})
	}
	addImgBtnClick = e => {
		var reader = new FileReader();
		const { files } = e.target
		if(!files||files.length==0) return
		reader.readAsDataURL(files[0]);
		reader.onload = ()=>{
			
			let _arr=this.state._partList
			let _pid=`_id:${new Date().getTime()}`
			let _num=_arr.length+1
			let pitem={
				...this.state.picture,
				url:reader.result,
				_pageId:_pid,
				partName:'图片'+_num,
				remark:'图片'+_num,
			}
			_arr.push(pitem)
			this.setState({
				_partList:_arr
			})

			this.uploadImage(files[0],pitem)
		}

		//



	}

	showCropModel(p,i){
		this.setState({
			cpicture:p,
			showEditPictureModal:true,
			cpindex:i
		})
		console.log('22',this.state.cpicture,p,i)
	}
	checkCpicture(){
		let _pic=this.state._partList[this.state.cpindex]
		this.state._partList.splice(this.state.cpindex,1,this.state.cpicture)
		this.setState({
			showEditPictureModal:false,
			_partList:this.state._partList
		})
		console.log('this.state.cpindex,1,this.state.cpicture: ', this.state.cpindex,1,this.state.cpicture);
		console.log('this.state._partList: ', this.state._partList,this.state.cpicture);
	}
	cancelModel(e){
		this.state._partList.splice(this.state.cpindex,1,this.state.cpicture)
		this.state.cpicture.marks=''
		this.setState({
			cpicture:this.state.cpicture,
			_partList:this.state._partList,
			showEditPictureModal:false
		})
		console.log('e: ', e,this.state.cpicture,this.state._partList);
	}

	initWorkName(subjectData){
		var date = new Date();
		var year = (date.getFullYear())
		var moun = (date.getMonth()+1)
		let day = date.getDate()
		if(moun<10) moun='0'+moun
		if(day<10) day='0'+day
		this.state.work.info.examName=`${year}年${moun}月${day}日${subjectData.v}作业`,
		this.state.work.info.workTime=`${year}-${moun}-${day}`,
		this.state.work.info.displayTime=`${year}年${moun}月${day}日`,
		this.state.work.info.subjectId=subjectData.k
		this.setState({
				work:this.state.work
			}
		)
	}
	getWorkNameAndSubName(classidArr,subid){
		this.props.state.workPageClass.value
		this.props.state.schoolSubId

		let _subdata=this.props.state.schoolSubjectList.find((v)=>{return v.k===this.props.state.schoolSubId})
		let _cnameArr=[]
		this.props.state.workPageClass.list.map((item,i)=>{
			if(this.props.state.workPageClass.value.includes(item.classId)){
				console.log('11')
				_cnameArr.push(item.className)
			}
		})

		console.log('22',_cnameArr,_subdata)
		return {
			_cnameArr,
			_subdata
		}
	}
	addExamGroup(){
		// this.props.dispatch({
		// 	type:"workManage/addOrUpdateExamGroup",
		// 	payload:[
		// 		{groupName:`题组${this.state.partQuestions.part.length+1}`,
		// 		examId:10,
		// 		quesIds:""}
		// 	]
		// })
		this.state.partQuestions.part.push(
				{name:`题组${this.state.partQuestions.part.length+1}`,
				questions:[]
			}
		)
		this.state.work.groupList=this.state.partQuestions
		// this.setState({
		// 	partQuestions:this.state.partQuestions
		// })
		this.setState({
			work:this.state.work
		})
	}


	deletePictureBonfirm(p,index) {
		console.log('(p,index: ', p,index)
		// this.state._partList.splice(index,1)
		// this.setState({
		// 	_partList:this.state._partList
		// })
		this.props.dispatch({
			type:"workManage/delPart",
			payload:{
				examId:p.examId,
				partId:p.partId
			}
		}).then((res)=>{
			this.getWorkData()
		})
	}
	dragOver(e,_partIndex){
		this.setState({
			partActiveIndex:_partIndex
		})
		e.preventDefault();
	}
	questionGroupDrop0(e,to){
		let _from=this.state.drapQuetionIndex
		if(_from.length>1){
			//从组拖拽
			this.state.partQuestions.part[to].questions.push(this.state.partQuestions.part[_from[0]].questions[_from[1]])
			this.state.partQuestions.part[_from[0]].questions.splice(_from[1],1)
			
		}else{
			//从组外拖拽
			this.state.partQuestions.part[to].questions.push(this.state.partQuestions.questions[_from[0]])
			this.state.partQuestions.questions.splice(_from[0],1)//
		}
		this.setState({
			partQuestions:this.state.partQuestions,
			partActiveIndex:-1
		})
		console.log("questionGroupDrop -> this.state.partQuestions", this.state.partQuestions)
	}
	questionGroupDrop(e,to){
		let _from=this.state.drapQuetionIndex

		// let dtagQue=this.state.partQuestions.questions[_from[0]]
		

		// console.log('dtagQue: ', dtagQue);
		// this.toRequestDrag(dtagQue,to)
		// return
		if(_from.length>1){
			//从组内拖拽
			this.state.partQuestions.part[to].questions.push(this.state.partQuestions.part[_from[0]].questions[_from[1]])
			this.state.partQuestions.part[_from[0]].questions.splice(_from[1],1)
			
		}else{
			//从组外拖拽
			this.state.partQuestions.part[to].questions.push(this.state.partQuestions.questions[_from[0]].qusId)
			this.state.partQuestions.questions.splice(_from[0],1)//
		}
		this.setState({
			// partQuestions:this.state.partQuestions,
			partActiveIndex:-1
		})
		console.log("questionGroupDrop -> this.state.partQuestions", this.state.partQuestions)
		this.toUpdateGroupList(this.state.partQuestions.part)
	}
	toUpdateGroupList(allpart){


		let requestDroupList=[]
		for (let index = 0; index < allpart.length; index++) {
			const part = allpart[index]
			if(part.questions.length){
				
				requestDroupList.push({
					groupName:part.name,
					examId:18||this.state.work.info.examId||10,
					quesIds:part.questions.join(',')
				})
			}
			
		}
		console.log('curgroup:,requestDroupList ',this.state.partQuestions,requestDroupList);
		//return
		// let qidArr=curgroup.questions
		// qidArr.push(dragque.qusId)
		// console.log('allGroup: ', allGroup);
		// //return
		this.props.dispatch({
			type:"workManage/addOrUpdateExamGroup",
			payload:requestDroupList
		}).then(res=>{
			
			
			this.props.dispatch({
				type:"workManage/getExamInfo",
				payload:{
					examId:18||this.props.location.examId||18
				}
			}).then(newWorkData=>{
				console.log('newWorkData: ', newWorkData);
				this.setState({
					work:newWorkData
				})
			})
		})
	}
	toRequestDrag(dragque,groupIndex){
		let curgroup=this.state.partQuestions.part[groupIndex]
		let data={
			
		}
		let allGroup=this.state.partQuestions
		this.state.partQuestions.part[groupIndex].questions.push(dragque.qusId)
		let requestDroupList=[]
		for (let index = 0; index < this.state.partQuestions.part.length; index++) {
			const part = this.state.partQuestions.part[index]
			if(part.questions.length){
				requestDroupList.push(part)
			}
			
		}
		console.log('curgroup: ',this.state.partQuestions,requestDroupList);
		return
		// let qidArr=curgroup.questions
		// qidArr.push(dragque.qusId)
		// console.log('allGroup: ', allGroup);
		// //return
		// this.props.dispatch({
		// 	type:"workManage/addOrUpdateExamGroup",
		// 	payload:[
		// 		{groupName:curgroup.name,
		// 		examId:10,
		// 		quesIds:qidArr.join(',')
		// 		}
		// 	]
		// })
	}
	// onEditFinish=()=>{
	// 	this.state.work.pages=this.state._partList
	// 	this.state.work.partQuestions=this.state.partQuestions
	// 	this.setState({
	// 		work:this.state.work
	// 	})
	// 	console.log('this.state.work',this.state.work,this.state.partQuestions,this.state._partList)
	// 	let msg=''
	// 	  if(!this.state.work.subjectId) {
	// 		  msg='请选择一个学科！'
	// 	  }
	// 	  if(!this.state.work.classes||!this.state.work.classes.length) {
	// 		  msg='请选择一个班级！'
	// 	  }
	// 	  if(msg){
	// 		  message.destroy()
	// 		  message.warn(msg)
	// 		  return
	// 	  }
	// 	  this.setState({
	// 	  	commitWorking:true
	// 	  })
	// 	  setTimeout(() => {
	// 		  this.props.dispatch({
	// 				type:"workManage/publishWork",
	// 				payload:{
	// 					examId:10
	// 				}
	// 			}).then(res=>{
	// 				message.destroy()
	// 				if(res.data.result===0){
	// 					message.success('作业发布成功')
	// 				}else{
	// 					message.error('作业发布失败')
	// 				}
	// 				this.setState({
	// 					commitWorking:false
	// 				})
	// 			})
				
	// 		}, 200);
			
	  
	// }
	checkWorkValue(){
		let msg=''

		if(!this.state.work.info.subjectId) {
			msg='请选择一个学科！'
		}
		if(!this.state.work.info.classId||!this.state.work.info.classId.length) {
			msg='请选择一个班级！'
		}
		if(!store.get('wrongBookNews').schoolId){
			msg='没有学校！'
		}
		if(msg){
			message.destroy()
			message.warn(msg)
		}
		return msg
	}
	updateWork=(type)=>{
		this.state.work.pages=this.state._partList
		this.state.work.partQuestions=this.state.partQuestions
		this.setState({
			work:this.state.work
		})
		console.log('this.state.work',this.state.work,this.state.partQuestions,this.state._partList)
		if(this.checkWorkValue())return
		(type=='updateWork')?this.setState({saveWorking:true}):this.setState({
			commitWorking:true
		})
		const {name,subjectId,classes,time}=this.state.work
		let prdata={
			examName:name,
			subjectId,
			classId:Array.isArray(classes)?classes.join(','):classes,
			schoolId:store.get('wrongBookNews').schoolId,
			workTime:time,
			examId:10
		}
		setTimeout(() => {
			this.props.dispatch({
				type:`workManage/${type}`,
				payload:prdata
			}).then(res=>{
				message.destroy()
				if(res.data.result===0){
					message.success('作业保存成功')
				}else{
					message.error('作业保存失败'+res.data.msg)
				}
				(type=='updateWork')?this.setState({saveWorking:false}):this.setState({
					commitWorking:false
				})
			})
			
		}, 200);
	}
	containetScroll(e) {

		if(!document.querySelector('#kacha_side')) return
		let _w=document.querySelector('#kacha_side').offsetWidth
		let  scrollTop = e.currentTarget.scrollTop, 
		elm =  document.querySelector('#_action_bar');
		if(!elm)return
		let _bool=(scrollTop>=elm.offsetTop)
		// if(_bool&&this.state.hideTopContainer)return
		this.setState({
			hideTopContainer:_bool,
			fixedWidth:_bool?`calc( 100% - ${_w}px )`:`100%`,
			_boxWidth:_bool?`calc( 100% - 200px )`:''
		})
		
	}

createWork=()=>{
	let msg=this.checkWorkValue()
	let workInfo=this.state.work.info
	console.log('workInfo: ', workInfo);

	if(msg)return
	this.setState({
		createWorking:true
	})

	let {_cnameArr,
		_subdata} =this.getWorkNameAndSubName()
	//return
	const {examName,subjectId,classId,workTime}=workInfo
	let data={
		examName:examName,
		subjectId,
		className:_cnameArr.length?_cnameArr.join(','):'',
		subjectName:_subdata?_subdata.v:'',
		classId:classId.join(','),
		schoolId:store.get('wrongBookNews').schoolId,
		workTime:workTime
	}
	console.log('data: ', data);
	this.props.dispatch({
		type:"workManage/createWork",
		payload:data
	}).then((res)=>{
		this.setState({
			createWorking:true
		})
		if(res&&res.data.result===0){
			message.success('作业创建成功')
			setTimeout(() => {
				this.props.dispatch(routerRedux.push('/workManage'))
			}, 500)
		}else{
			message.warn('作业创建失败：'+res.data.msg)
		}
	})
}
getClasses(classIdStr){
	let _arr=[]
	let cids=classIdStr.split(",")
	return _arr=cids.map((item,i)=>{
		if(item){
			return parseInt(item)
		}
	})
}

	render() {
		let pquestions=this.state.partQuestions.questions
		// let groupList=this.state.partQuestions.part
		// let partList=this.state.work.partList
		let partList=this.state._partList
		let groupList=this.state.work.groupList
		console.log('groupList: ', groupList);
		return (
		<div id='con_work' className={[style.page_box,this.state.hideTopContainer?"_position":""].join(" ")}
			onScroll={(e)=>{
				e.stopPropagation()
				this.containetScroll(e)
			}}
		>
			<div>
				<div className='work_name_area' style={{display:'flex',flexDirection:'column',alignItems:"center",marginBottom:22,marginTop:10}}>
						<h4 style={{fontSize:20,height:40}} >
							{
								!this.state.editWorkName?
								<>
									{this.state.work.info.examName}
									<img style={{marginLeft:10}} className='cup' onClick={()=>{this.setState({editWorkName:true})}} src={require('../../images/edit.png')} alt=""/>
								</>
								:
								<>
									<Input autoFocus={true} type='text' 
											onBlur={(e)=>{

												if(!e.target.value.toString().length){
													this.setState({workNameFail:true})
												}else{
													this.state.work.info.examName=e.target.value
													this.setState({
														work:this.state.work,
														editWorkName:false,workNameFail:false
													})
													
												}
											}} 
											style={{width:250}}
											defaultValue={this.state.work.info.examName} 
											onKeyUp={(e)=>{
												this.setState({workNameFail:e.target.value.toString().length?false:true})
											}}
										/>
										{this.state.workNameFail?<div style={{color:'red',fontSize:12}}>作业名称不能为空.</div>:''}
								</>

							}
						</h4>
						<div style={{marginTop:14}}>
							班级：{this.renderClassList()}
							学科：{this.renderSchoolSubjectList()}
						</div>
				</div>
				<div className='work_con_area'>

					{
						this.state.iscreateWork?
							<div style={{display:'flex',justifyContent:'center',marginTop:40}}>
								<Button loading={this.state.createWorking} type='primary' onClick={()=>this.createWork()}>添加作业</Button>
							</div>
						:
						<>
						<div className={style.top_box}>
						<div className='clearfix work_part_area'>
								{
									partList.map((item, i) => {
										return (
											<div key={`${i}-${i}`}  className={style.uploadbox}>
												<UploadItem lookPicture={this.showCropModel}  picture={item} index={i}
													deletePictureHander={(p,index)=>{
															this.deletePictureBonfirm(p,index)
														}
													}
												></UploadItem>
											</div>
											)
										})
								}
							
							<div className={style.uploadbox}>
								<div className={[style.uploadBtn,'cup'].join(' ')} 
		
								>
								<input
									type='file'
									className={style._file}
									accept='image/*'
									title=''
									onChange={this.addImgBtnClick}             
								></input>
									添加图片
								</div>
							</div>
						</div>

						<div style={{marginTop:32}}>
								{
									this.state._partList.map((item, i) => {
										return (
											<div key={i} style={{marginTop:14}} className={style.queitem}>
												<div style={{width:60,minWidth:40,lineHeight:"30px"}} className={style.quelabel}>图片{i+1}</div> 
												{
													<div>
														{item.questions?item.questions.map((area, j) => {
														return (
														<span key={j} className={style.quespanbtn}>{`${j+1} 选择题`}</span>
																		)
															}):''}
													</div>
												}
											</div>
											)
										})
								}
						</div>

						</div>
						
						{partList.length==0?<div className={style._empty}>请点击左上角添加作业图片</div>:
						<>
							<div className={style.question_content} >
								<div id='_action_bar'></div>
								<div className={style._action_bar}  style={{width:this.state.fixedWidth}}>
										<Checkbox checked={this.state.lookQuestion}
											onClick={()=>{
												this.setState({
													lookQuestion:!this.state.lookQuestion
												})
											}}
									>显示试题</Checkbox>

									<div className={style.btn_box}>
										<Button loading={this.state.saveWorking} onClick={()=>{this.updateWork('updateWork')}} >
											保存作业
										</Button>
										<Button loading={this.state.commitWorking} className={style.saveworkbtn} onClick={()=>{this.updateWork('publishWork')}} style={{marginLeft:14}} type='primary'>
											发布作业
										</Button>
									</div>
									
								</div>

								{/* 作业题目部分 */}
								<div  style={{width:'100%',boxSizing:'border-box',background:"#fff"}}>
								<div className={style.sider} style={{height: 'calc( 100% - 50px )'}}>
									<div className={style.sider_in}>
										<div style={{color:"#84888E",fontSize:14,marginBottom:14}}>
											拖动题目调整分组
										</div>
										<div className={style.que_group}>
												{
													groupList&&groupList.length?groupList.map((group,p)=>{
														return(
															<div style={{marginTop:10}}  className={style.group_box} key={p} 
																onDropCapture={(e)=>{this.questionGroupDrop(e,p)}} 
																onDragLeave={(e)=>{
																	this.setState({
																		partActiveIndex:-1
																	})
																}}
																onDragOver={(e)=>{this.dragOver(e,p)}}>
																{this.state.editPartNameIndex===p&&this.state.editPartName?
																	<Input autoFocus={this.state.editPartNameIndex===p&&this.state.editPartName} 
																		style={{width:100}} 
																		onBlur={(e)=>{
																			// this.state.partQuestions.part[p].name=e.target.value
																				this.state.work.groupList[p].groupName=e.target.value
																				this.setState({
																					editPartNameIndex:-1,
																					editPartName:false,
																					partQuestions:this.state.partQuestions,
																					work:this.state.work
																				}, () => {

																					this.toUpdateGroupList(this.state.work.groupList)
																		
																				})
																			
																			}} 

																			defaultValue={group.groupName}
																	/>
																	:
																	<div key={p} className={[style._part_title,p===this.state.partActiveIndex?style._active:''].join(' ')}>
																		{group.groupName}
																		<img style={{marginLeft:8}}  className='cup' src={require('../../images/edit.png')} alt=""
																			onClick={(e)=>{
																				this.setState({
																					editPartNameIndex:p,
																					editPartName:true
																				})
																			}}
																	/>
																	<Popconfirm placement="top" 
																			title={'确定要删除该题组吗？'} 
																			onConfirm={(e)=>{
																				this.state.partQuestions.part.splice(p,1)
																				this.setState({
																					partQuestions:this.state.partQuestions
																				})
																			}} 
																			okText="确定" 		
																			cancelText="取消"
																		>
																		<div style={{position:'absolute',right:5,
																			color:" #84888E",fontSize:12}}>删除</div>
																	</Popconfirm>
																	
																</div>
															}
															{
																group.quesList&&group.quesList.length?
																
																	<div style={{width:"100%",marginTop:15}}>
																	{group.quesList.map((area, k) => {
																		return(
																		<span key={k} className={style.que_span}>{k+1}</span>
																		)
																	})}
																</div>
																

																:''
															}
														</div>
														)
													}):''
												} 
										</div>
										<Button type='primary'
											style={{marginTop:15,height:32,lineHeight:'32px',minHeight:32}}
											onClick={()=>{
												this.addExamGroup()
											}}
											>添加题组	
										</Button>
									</div>
								</div>
								{/* 题目部分 */}
								<div className={style._box} style={{width: 'calc( 100% - 200px )',display:'inline-block'}}>
									<div className={style.content}>
										{
											groupList&&groupList.length?groupList.map((group,p)=>{
												return(
													<div  className={style.group_box} key={p}>
														<div style={{marginBottom:10}} > {group.name}</div>
														
														{
														group.quesList&&group.quesList.length?
														<div style={{width:"100%",marginBottom:15,background:'#efefef',padding:'20px 20px'}}>
														{
															group.quesList.map((item, k) => {
																return(
																	<div
																		key={k}
																		className={[style.section_box,this.state.drapQuetionIndex.length?'drap_cursor':''].join(' ')}
																		draggable="true" 
																		
																		onDragStart={(e)=>{
																			this.setState({
																				drapQuetionIndex:[p,k]
																			})
																			console.log('_key,_index: ', 'start');
																		}}
												
																		>
																		<Section ischecked={this.state.ischecked} showQuestion={this.state.lookQuestion} 
																		index={k} question={item} 
																		key={`${item.pageid}${k}`} 

																		deleteSectionHander={(index)=>{
																			this.state._partList.splice(index,1)
																			this.setState({
																				_partList: this.state._partList,
																			})
																		}}

																		>

																</Section>
													
																	</div>
																	
																)
															})
														}
													</div>
														:
														''
													}

												</div>
												)
											}):''
										} 
										{pquestions&&pquestions.length>0?<>{
											pquestions.map((item, i) => {
													return (
														<div 
															key={i}
															className={style.section_box}
															draggable="true" 
															
															onDragStart={(e)=>{
																this.setState({
																	drapQuetionIndex:[i]
																})
															}}
															>
															<Section   showQuestion={this.state.lookQuestion} 
																index={i} question={item} 
																key={`${item.pageid}${i}`} 
																deleteSectionHander={(index)=>{
																	this.state._partList.splice(index,1)
																	this.setState({
																		_partList: this.state._partList,
																	})
																}}


																>

														</Section>
														
														</div>
														)
											})
										}</>
										:''}
									</div>
								</div>
							
								</div>
							</div>
							
							<EditPageModal 
									hideModalHander={()=>{this.setState({showEditPictureModal:false})}} 
									cpicture={this.state.cpicture} visible={this.state.showEditPictureModal}
									confirmPicture={(p)=>{
										this.state._partList.splice(this.state.cpindex,1)
										this.setState({
											_partList:this.state._partList,
											showEditPictureModal:false
										})
										console.log('this.state._partList',this.state._partList)
									}}
									_confirmAreaHander={(index)=>{
										let _area=this.state.cpicture.questions[index]
										console.log('_area: ', _area,this.state.cpicture);
										// this.state._partList.splice(this.state.cpindex,1)

										let _areaData={
											partId:this.state.cpicture.partId,	
											examId:this.state.cpicture.examId||10,	
											qusImgUrl:_area.area.imgUrl,	
											pointX:_area.area.x,	
											pointY:_area.area.y,	
											areaWidth:_area.area.width,		
											areaHeight:_area.area.height,	
											num:_area.num||10||_area.orderBy
										}
										console.log('_areaData: ', _areaData);
										// this.setState({
										// 	// _partList:this.state._partList,
										// 	showEditPictureModal:false
										// })
										this.props.dispatch({
											type:'workManage/areaDiscern',
											payload:_areaData
										})
										console.log('this.state._partList',this.state._partList)
									}}
									_deleteCropItemHander={(index)=>{
										this.props.dispatch({
											type:'workManage/doQuesDelete',
											payload:{
												qusId:this.state.cpicture.questions[index].qusId,
												partId:this.state.cpicture.partId
											}
										})
									}}
								></EditPageModal>
						
						</>
					}
						</>
					}

				</div>
			</div>
			{this.state.hideTopContainer?
				<div className={style.back_top}  onClick={() => {
					document.getElementById('con_work').scrollTop = 0;
					}}>
					<Icon type="up" />
				</div>
			:''}

		</div>
    )
  }

  componentDidMount() {
		console.log('this.props.location.query',this.props.location.isCreate)
		let iscreateWork=this.props.location.isCreate
		this.setState({
			iscreateWork
		})

		let partQuestions=this.state.partQuestions
		const { dispatch } = this.props;
		let userNews = store.get('wrongBookNews');
		let data = {
			schoolId: userNews.schoolId,
			year: this.props.state.years
		}
		
		// let {classId,examName,examId,subjectId}=aa
		//编辑和新建的情况都要获取学科和班级的
		dispatch({
			type: 'workManage/getWorkPageClass',
			payload: data
		}).then((classData) => {
			
			if(iscreateWork) {
				console.log('classData: ', classData);
				this.state.work.info.classId=classData.value
				this.setState({
					work:this.state.work
				})
			}
		})
		dispatch({
			type: 'workManage/getSchoolSubjectList'
		}).then((subs) => {
			if(subs.length){
				if(iscreateWork) {
					this.initWorkName(subs[0])
				}
				
				// this.setState({
				// 	work:{
				// 		...this.state.work,
				// 		name:examName,
				// 		classes:classId,
				// 		subjectId
				// 	}
				// })

				// dispatch({
				// 	type:"workManage/schoolSubId",
				// 	payload:subjectId
				// })
				// console.log('22',classId.split(","))
				// dispatch({
				// 	type:"workManage/workPageClass",
				// 	payload:{
				// 		list:classData.list,
				// 		value:this.getClasses(classId)
				// 	}
				// })
			}
		})


		console.log('this.props.location.examId: ', this.props.location.examId);
		if(!iscreateWork){
			console.log('编辑作业...')

			this.getWorkData()
			return
			this.props.dispatch({
				type:"workManage/getExamInfo",
				payload:{
					examId:18||this.props.location.examId||18
				}
			}).then(workdata=>{
				console.log('workdata: ', workdata);
				if(!workdata){
					message.destroy()
					message.warn('作业没有数据')
					return
				}
				//  let workdata=this.state.test22
				console.log('workdata: ', workdata);
				let _classids=workdata.info.classId.split(',')
				let classarr=[]
				for (let index = 0; index < _classids.length; index++) {
					const classid = _classids[index];
					if(classid) classarr.push(parseInt(classid))
				}
				//编辑作业的情况
				
				this.setState({
					work:{
						...workdata
					},
					_editWorkClassList:classarr
				})
	
	
				let _arr=[]
				for (let index = 0; index < workdata.partList.length; index++) {
					const element = workdata.partList[index]
					if(element.questions.length){
					
						for (let j = 0; j < element.questions.length; j++) {
							_arr.push(element.questions[j])
							
						}
					}
				}
				partQuestions.questions=_arr
	
				this.setState({
					partQuestions:partQuestions
				})
			
				this.setState({
					_partList:workdata.partList
				})
				console.log('this.state.test22',this.state.work)
			})
		}

		
  }

  componentWillUnmount() {
  }



}

export default connect((state) => ({
  state: {
    workPageClass:state.workManage.workPageClass,
    years: state.temp.years,
    schoolSubId:state.workManage.schoolSubId,
    schoolSubjectList:state.workManage.schoolSubjectList
  }
}))(WorkManage);
