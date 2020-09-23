import React from 'react';
import {
  Layout, Menu,Spin , Button, message,DatePicker,Select, Popover,Input, Icon, Popconfirm,Empty,Modal, Checkbox
} from 'antd';
import {ImageUploader,putb64,uploadBase64} from '../../../utils/ImageUploader'
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
    
			test:{
				"questions": [
					{
					"num": 0,
					"pageid": 344215,
					"question":{
						"title": "工业上用电解氧化铝的方法制取单质铝的化学方程式为：2Al\n<sub>2</sub>O\n<sub>3</sub>═4Al+3O\n<sub>2</sub>↑．对于电解&nbsp;10t&nbsp;氧化铝可产生多少吨铝？小丽和小明两位同学分别采用了两种不同的方法．\n<br>\n<img src=\"http://qimg.afanti100.com/data/image/question_image/3/8c12c72d8dfe0e9ab16a4a039b555989.png\" style=\"vertical-align: middle;\">\n<br>请你回答下列问题：\n<br>（1）你认为他们的解题思路和方法都正确吗？\n<br>（2）对“34g&nbsp;过氧化氢完全分解（化学方程式为：2H\n<sub>2</sub>O\n<sub>2</sub>\n<span dealflag=\"1\" class=\"AFanMath\" mathtag=\"math\" style=\"whiteSpace:nowrap;wordSpacing:normal;wordWrap:normal\">\n <table cellpadding=\"-1\" cellspacing=\"-1\" style=\"margin-right:1px\">\n  <tbody>\n   <tr>\n    <td style=\"border-bottom:1px solid black;padding-bottom:1px;font-size:90%\">\n     <table style=\"margin-right:1px\" cellspacing=\"-1\" cellpadding=\"-1\">\n      <tbody>\n       <tr>\n        <td>&nbsp;Mn<span><span>O</span><span style=\"vertical-align:sub;font-size:90%\">2</span></span>&nbsp;</td>\n       </tr>\n       <tr>\n        <td style=\"font-size:90%\">\n         <div style=\"border-top:1px solid black;line-height:1px\">\n          .\n         </div></td>\n       </tr>\n      </tbody>\n     </table></td>\n   </tr>\n   <tr>\n    <td>&nbsp;</td>\n   </tr>\n  </tbody>\n </table></span>2H\n<sub>2</sub>O+O\n<sub>2</sub>↑）产生氧气的质量为多少克？”一题，你认为也能用上述两种方法解答吗？试试看，请把能用的解法过程写出来．\n<br>（3）你认为在什么情况下，小丽和小明同学的解法都能使用？",
					"parse": "解：（1）他们的解题思路和方法都正确．因为小丽用的是“根据化学方程式的计算”，小明用的是根据元素的质量分数的计算；\n<br>（2）本题不能用小明的方法解答，因为过氧化氢完全分解后，氧元素没有都在氧气中，还有一部分在H\n<sub>2</sub>O中存在．\n<br>设产生氧气的质量为x，\n<br>2H\n<sub>2</sub>O\n<sub>2</sub>\n<span dealflag=\"1\" class=\"AFanMath\" mathtag=\"math\" style=\"whiteSpace:nowrap;wordSpacing:normal;wordWrap:normal\">\n <table cellpadding=\"-1\" cellspacing=\"-1\" style=\"margin-right:1px\">\n  <tbody>\n   <tr>\n    <td style=\"border-bottom:1px solid black;padding-bottom:1px;font-size:90%\">\n     <table style=\"margin-right:1px\" cellspacing=\"-1\" cellpadding=\"-1\">\n      <tbody>\n       <tr>\n        <td>&nbsp;Mn<span><span>O</span><span style=\"vertical-align:sub;font-size:90%\">2</span></span>&nbsp;</td>\n       </tr>\n       <tr>\n        <td style=\"font-size:90%\">\n         <div style=\"border-top:1px solid black;line-height:1px\">\n          .\n         </div></td>\n       </tr>\n      </tbody>\n     </table></td>\n   </tr>\n   <tr>\n    <td>&nbsp;</td>\n   </tr>\n  </tbody>\n </table></span>2H\n<sub>2</sub>O+O\n<sub>2</sub>↑\n<br>68&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 32\n<br>34g&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; x\n<br>\n<span class=\"AFanMath\" mathtag=\"math\" style=\"whiteSpace:nowrap;wordSpacing:normal;wordWrap:normal\">\n <table cellpadding=\"-1\" cellspacing=\"-1\" style=\"margin-right:1px\">\n  <tbody>\n   <tr>\n    <td style=\"border-bottom:1px solid black\">68</td>\n   </tr>\n   <tr>\n    <td>34g</td>\n   </tr>\n  </tbody>\n </table>=\n <table cellpadding=\"-1\" cellspacing=\"-1\" style=\"margin-right:1px\">\n  <tbody>\n   <tr>\n    <td style=\"border-bottom:1px solid black\">32</td>\n   </tr>\n   <tr>\n    <td>x</td>\n   </tr>\n  </tbody>\n </table></span>\n<br>解之得：x=16g．\n<br>答：产生氧气的质量为16g．\n<br>（3）根据质量守恒定律，小丽同学的解法在任何情况下都能使用；而只有在化合物分解后，要求的元素的质量没有被分解到两种物质中时才能使用小明同学的解法．\n<br>答案：\n<br>（1）他们的解题思路和方法都正确；\n<br>（2）产生氧气的质量为16g；\n<br>（3）根据质量守恒定律，小丽同学的解法在任何情况下都能使用；而只有在化合物分解后，要求的元素的质量没有被分解到两种物质中时才能使用小明同学的解法．",
					"knowledgeName": "根据化学反应方程式的计算",
					},
					"area": {
						"imgUrl": "https://homework.mizholdings.com/kacha/xcx/page/4645964827397120.5041112551802880.1600164913791.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/-0.0/crop/!1070.991947907834x449.173828125a139.9599609375a117.17578125",
						"x": 40,
						"y": 33,
						"width": 308,
						"height": 129,
						"rotate": 0,
					},
					"selected": false
					}, {
					"num": 1,
					"areas": [{
						"imgUrl": "https://homework.mizholdings.com/kacha/xcx/page/4645964827397120.5041112551802880.1600164913791.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/-0.0/crop/!1070.991947907834x608.6630859375a139.9599609375a566.349609375",
						"x": 40,
						"y": 163,
						"width": 308,
						"height": 175,
						"rotate": 0
					}],
					"answer_areas": [
						[248, 267, 292, 267]
					],
					"mark": 1,
					"choiceAnswer": "B",
					"type": 4,
					"pageid": 344215,
					"area": {
						"imgUrl": "https://homework.mizholdings.com/kacha/xcx/page/4645964827397120.5041112551802880.1600164913791.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/-0.0/crop/!1070.991947907834x608.6630859375a139.9599609375a566.349609375",
						"x": 40,
						"y": 163,
						"width": 308,
						"height": 175,
						"rotate": 0
					},
					"selected": true
				}, {
					"num": 2,
					"areas": [{
						"imgUrl": "https://homework.mizholdings.com/kacha/xcx/page/4645964827397120.5041112551802880.1600164913791.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/-0.0/crop/!1070.991947907834x602.1621172288169a139.9599609375a1175.0126953125",
						"x": 40,
						"y": 338,
						"width": 308,
						"height": 173,
						"rotate": 0
					}],
					"answer_areas": [
						[409, 315, 454, 315],
						[485, 337, 512, 337]
					],
					"mark": 0,
					"choiceAnswer": "A",
					"type": 4,
					"pageid": 344215,
					"area": {
						"imgUrl": "https://homework.mizholdings.com/kacha/xcx/page/4645964827397120.5041112551802880.1600164913791.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/-0.0/crop/!1070.991947907834x602.1621172288169a139.9599609375a1175.0126953125",
						"x": 40,
						"y": 338,
						"width": 308,
						"height": 173,
						"rotate": 0
					},
					"selected": false
				}, {
					"num": 3,
					"areas": [{
						"imgUrl": "https://homework.mizholdings.com/kacha/xcx/page/4645964827397120.5041112551802880.1600164913791.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/-0.0/crop/!1070.991947907834x1432.1484375a143.21484375a1777.166015625",
						"x": 41,
						"y": 511,
						"width": 308,
						"height": 412,
						"rotate": 0
					}],
					"answer_areas": [
						[703, 323, 823, 323]
					],
					"mark": 1,
					"choiceAnswer": "A",
					"type": 4,
					"pageid": 344215,
					"area": {
						"imgUrl": "https://homework.mizholdings.com/kacha/xcx/page/4645964827397120.5041112551802880.1600164913791.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/-0.0/crop/!1070.991947907834x1432.1484375a143.21484375a1777.166015625",
						"x": 41,
						"y": 511,
						"width": 308,
						"height": 412,
						"rotate": 0
					},
					"selected": true
				}, {
					"num": 4,
					"areas": [{
						"imgUrl": "https://homework.mizholdings.com/kacha/xcx/page/4645964827397120.5041112551802880.1600164913791.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/-0.0/crop/!1039.919101751976x2935.904296875a1298.6982421875a273.41015625",
						"x": 373,
						"y": 78,
						"width": 299,
						"height": 845,
						"rotate": 0
					}],
					"answer_areas": [
						[437, 461, 570, 461]
					],
					"mark": 1,
					"choiceAnswer": "B",
					"type": 4,
					"pageid": 344215,
					"area": {
						"imgUrl": "https://homework.mizholdings.com/kacha/xcx/page/4645964827397120.5041112551802880.1600164913791.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/-0.0/crop/!1039.919101751976x2935.904296875a1298.6982421875a273.41015625",
						"x": 373,
						"y": 78,
						"width": 299,
						"height": 845,
						"rotate": 0
					},
					"selected": true
				}],
				"sections":[
					{"name":'测测',areas:[],id:0}
				],
				"url": "https://homework.mizholdings.com/kacha/xcx/page/4645964827397120.5041112551802880.1600164913791.jpg?imageMogr2/auto-orient",
				"serUrl": "https://homework.mizholdings.com/kacha/xcx/page/4645964827397120.5041112551802880.1600164913791.jpg?imageMogr2/auto-orient",
				"photoScore": 77,
				"rotate": "",
				"angle": 0,
				"needCompress": false,
				"_uploadSate": 0,
				"_time": 0,
				"_displayImage": {
					"width": 375,
					"height": 499.95,
					"left": 0,
					"top": 1.5250000000000057
				},
				"pageId": 344215,
				"_pageId": 344215,
				"count": 5,
				"width": 2500,
				"height": 3333,
				"name":''
			},
			test1:{
				"name":'',
				"questions": [{
					"num": 0,
					"areas": [{
						"imgUrl": "https://homework.mizholdings.com/kacha/xcx/page/4645964827397120.5041112551802880.1600164913791.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/-0.0/crop/!1070.991947907834x449.173828125a139.9599609375a117.17578125",
						"x": 40,
						"y": 33,
						"width": 308,
						"height": 129,
						"rotate": 0
					}],
					"answer_areas": [
						[66, 372, 115, 372]
					],
					"mark": 0,
					"choiceAnswer": "A",
					"type": 4,
					"pageid": 344215,
					"area": {
						"imgUrl": "https://homework.mizholdings.com/kacha/xcx/page/4645964827397120.5041112551802880.1600164913791.jpg?imageMogr2/auto-orient/gravity/NorthWest/rotate/-0.0/crop/!1070.991947907834x449.173828125a139.9599609375a117.17578125",
						"x": 40,
						"y": 33,
						"width": 308,
						"height": 129,
						"rotate": 0,
						"question":{
								"title": "工业上用电解氧化铝的方法制取单质铝的化学方程式为：2Al\n<sub>2</sub>O\n<sub>3</sub>═4Al+3O\n<sub>2</sub>↑．对于电解&nbsp;10t&nbsp;氧化铝可产生多少吨铝？小丽和小明两位同学分别采用了两种不同的方法．\n<br>\n<img src=\"http://qimg.afanti100.com/data/image/question_image/3/8c12c72d8dfe0e9ab16a4a039b555989.png\" style=\"vertical-align: middle;\">\n<br>请你回答下列问题：\n<br>（1）你认为他们的解题思路和方法都正确吗？\n<br>（2）对“34g&nbsp;过氧化氢完全分解（化学方程式为：2H\n<sub>2</sub>O\n<sub>2</sub>\n<span dealflag=\"1\" class=\"AFanMath\" mathtag=\"math\" style=\"whiteSpace:nowrap;wordSpacing:normal;wordWrap:normal\">\n <table cellpadding=\"-1\" cellspacing=\"-1\" style=\"margin-right:1px\">\n  <tbody>\n   <tr>\n    <td style=\"border-bottom:1px solid black;padding-bottom:1px;font-size:90%\">\n     <table style=\"margin-right:1px\" cellspacing=\"-1\" cellpadding=\"-1\">\n      <tbody>\n       <tr>\n        <td>&nbsp;Mn<span><span>O</span><span style=\"vertical-align:sub;font-size:90%\">2</span></span>&nbsp;</td>\n       </tr>\n       <tr>\n        <td style=\"font-size:90%\">\n         <div style=\"border-top:1px solid black;line-height:1px\">\n          .\n         </div></td>\n       </tr>\n      </tbody>\n     </table></td>\n   </tr>\n   <tr>\n    <td>&nbsp;</td>\n   </tr>\n  </tbody>\n </table></span>2H\n<sub>2</sub>O+O\n<sub>2</sub>↑）产生氧气的质量为多少克？”一题，你认为也能用上述两种方法解答吗？试试看，请把能用的解法过程写出来．\n<br>（3）你认为在什么情况下，小丽和小明同学的解法都能使用？",
							"parse": "解：（1）他们的解题思路和方法都正确．因为小丽用的是“根据化学方程式的计算”，小明用的是根据元素的质量分数的计算；\n<br>（2）本题不能用小明的方法解答，因为过氧化氢完全分解后，氧元素没有都在氧气中，还有一部分在H\n<sub>2</sub>O中存在．\n<br>设产生氧气的质量为x，\n<br>2H\n<sub>2</sub>O\n<sub>2</sub>\n<span dealflag=\"1\" class=\"AFanMath\" mathtag=\"math\" style=\"whiteSpace:nowrap;wordSpacing:normal;wordWrap:normal\">\n <table cellpadding=\"-1\" cellspacing=\"-1\" style=\"margin-right:1px\">\n  <tbody>\n   <tr>\n    <td style=\"border-bottom:1px solid black;padding-bottom:1px;font-size:90%\">\n     <table style=\"margin-right:1px\" cellspacing=\"-1\" cellpadding=\"-1\">\n      <tbody>\n       <tr>\n        <td>&nbsp;Mn<span><span>O</span><span style=\"vertical-align:sub;font-size:90%\">2</span></span>&nbsp;</td>\n       </tr>\n       <tr>\n        <td style=\"font-size:90%\">\n         <div style=\"border-top:1px solid black;line-height:1px\">\n          .\n         </div></td>\n       </tr>\n      </tbody>\n     </table></td>\n   </tr>\n   <tr>\n    <td>&nbsp;</td>\n   </tr>\n  </tbody>\n </table></span>2H\n<sub>2</sub>O+O\n<sub>2</sub>↑\n<br>68&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 32\n<br>34g&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; x\n<br>\n<span class=\"AFanMath\" mathtag=\"math\" style=\"whiteSpace:nowrap;wordSpacing:normal;wordWrap:normal\">\n <table cellpadding=\"-1\" cellspacing=\"-1\" style=\"margin-right:1px\">\n  <tbody>\n   <tr>\n    <td style=\"border-bottom:1px solid black\">68</td>\n   </tr>\n   <tr>\n    <td>34g</td>\n   </tr>\n  </tbody>\n </table>=\n <table cellpadding=\"-1\" cellspacing=\"-1\" style=\"margin-right:1px\">\n  <tbody>\n   <tr>\n    <td style=\"border-bottom:1px solid black\">32</td>\n   </tr>\n   <tr>\n    <td>x</td>\n   </tr>\n  </tbody>\n </table></span>\n<br>解之得：x=16g．\n<br>答：产生氧气的质量为16g．\n<br>（3）根据质量守恒定律，小丽同学的解法在任何情况下都能使用；而只有在化合物分解后，要求的元素的质量没有被分解到两种物质中时才能使用小明同学的解法．\n<br>答案：\n<br>（1）他们的解题思路和方法都正确；\n<br>（2）产生氧气的质量为16g；\n<br>（3）根据质量守恒定律，小丽同学的解法在任何情况下都能使用；而只有在化合物分解后，要求的元素的质量没有被分解到两种物质中时才能使用小明同学的解法．",
							"knowledgeName": "根据化学反应方程式的计算",
						}
					},
					"selected": false
				}],
				"sections":[
				],
				"url": "http://tmp/wx9dd6bc8b32ac2723.o6zAJsytZ1_Wx-i4ldA6Hut1PwjM.ufgRn85AjFnI8f549d68a9e9abb2ff85744b03a659b9.jpg",
				"serUrl": "https://homework.mizholdings.com/kacha/xcx/page/4645964827397120.5041112551802880.1600164913791.jpg?imageMogr2/auto-orient",
				"photoScore": 77,
				"rotate": "",
				"angle": 0,
				"needCompress": false,
				"_uploadSate": 0,
				"_time": 0,
				"_displayImage": {
					"width": 375,
					"height": 499.95,
					"left": 0,
					"top": 1.5250000000000057
				},
				"pageId": 344219,
				"count": 5,
				"width": 2500,
				"height": 3333
			},
			workPages:[
			],
				 
			showEditPictureModal:false,
			cpicture:{},
			visible:false,
			
			cpindex:0,
			commitWorking:false,
			saveWorking:false,
			work:{
				name:'未命名作业',
				classes:[],
				subjectId:1,
				pages:[],
				time:''
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
			uploadToken:'',
			fileKey:'',
			iscreateWOrk:false,
			createWorking:false,
			_work:{}
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
			const children = [];
		for (let i = 0; i < classes.length; i++) {
		let item = classes[i]
		children.push(	<Option key={i} value={item.classId}>{item.className}</Option>);
		}
			return (
		<>
			<Select
						mode="multiple"
			style={{ width: 200,marginRight:20 }}
			suffixIcon={<Icon type="caret-down" style={{ color: "#646464", fontSize: 10 }} />}
						optionFilterProp="children"
						value={this.props.state.workPageClass.value}
			placeholder="请选择班级"
			onChange={(value) => {
							console.log('value: ', value);
				this.props.dispatch({
					type:"workManage/workPageClass",
					payload:{
					list:classes,
					value
					}
								})
								this.state.work.classes=value
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
		let _index=this.state.workPages.findIndex((value)=>value._pageId==pitem._pageId)


		let _ImageUploader=new ImageUploader()
		let partUrl=await _ImageUploader.uploadToQiniu(file)
		console.log('imgurl: ', partUrl);
		if(!partUrl) return 
		let option={
			examId:10,
			partName:pitem.partName,
			remark:pitem.partName,
			partUrl
		}

		let res=await _ImageUploader.createPartAndDiscover(option)
		console.log('upload res: ', res.data);
		let _newdata={
			...this.state.workPages[_index]
		}
		if(res.code===0||res.code===2){
			_newdata={
				..._newdata,
				...res.data
			}
		}else{
			
		}
		_newdata.resCode=res.code
		this.state.workPages.splice(_index,1,_newdata)
		this.setState({
			workPages:this.state.workPages
		})
		console.log('this.state.workPages: ', this.state.workPages);
	}
	addImgBtnClick = e => {
		var reader = new FileReader();
		const { files } = e.target
		if(!files||files.length==0) return
		reader.readAsDataURL(files[0]);
		reader.onload = ()=>{
			
			let _arr=this.state.workPages
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
				workPages:_arr
			})

			this.uploadImage(files[0],pitem)
		}

		//



	}
// 	uploadImg(file){
// 		return new Promise((resolve,reject)=>{
// 				let {token} = window.localStorage;
// 				let params = {
// 						token,
// 						fileType : 1 
// 				}
// 				getUpToken(params).then((res)=>{
// 						let {uptoken} = res.data.data;
// 						let uploadParams = {
// 								token : uptoken,
// 								key : uuid() + file.name.replace(/[^\u4e00-\u9fa5a-zA-Z\d]+/g,''),
// 								filename : file.name,
// 								size : file.size,
// 								file : file
// 						}
// 						uploadQiniu.post('/',uploadParams).then((res)=>{
// 								console.log(res.data);
// 								resolve('http://images.mizholdings.com/' + res.data.key);
// 						}).catch(reject)
// 				})
// 		})
		
// }
	showCropModel(p,i){
		this.setState({
			cpicture:p,
			showEditPictureModal:true,
			cpindex:i
		})
		console.log('22',this.state.cpicture,p,i)
	}
	checkCpicture(){
		let _pic=this.state.workPages[this.state.cpindex]
		this.state.workPages.splice(this.state.cpindex,1,this.state.cpicture)
		this.setState({
			showEditPictureModal:false,
			workPages:this.state.workPages
		})
		console.log('this.state.cpindex,1,this.state.cpicture: ', this.state.cpindex,1,this.state.cpicture);
		console.log('this.state.workPages: ', this.state.workPages,this.state.cpicture);
	}
	cancelModel(e){
		this.state.workPages.splice(this.state.cpindex,1,this.state.cpicture)
		this.state.cpicture.marks=''
		this.setState({
			cpicture:this.state.cpicture,
			workPages:this.state.workPages,
			showEditPictureModal:false
		})
		console.log('e: ', e,this.state.cpicture,this.state.workPages);
	}

	initWorkName(subjectData){
		var date = new Date();
		var year = (date.getFullYear())
		var moun = (date.getMonth()+1)
		let day = date.getDate()
		if(moun<10) moun='0'+moun
		if(day<10) day='0'+day
		this.setState({
				work:{
					...this.state.work,
					name:`${year}年${moun}月${day}日${subjectData.v}作业`,
					time:`${year}-${moun}-${day}`,
					displayTime:`${year}年${moun}月${day}日`,
					subjectId:subjectData.k
				}
			}
		)
	}
	addExamGroup(){
		this.props.dispatch({
			type:"workManage/addOrUpdateExamGroup",
			payload:{
				groupName:`题组${this.state.partQuestions.part.length+1}`,
				examId:10
			}
		})
		// this.state.partQuestions.part.push(
		// 		{name:`题组${this.state.partQuestions.part.length+1}`,
		// 		questions:[]
		// 	}
		// )
		// this.setState({
		// 	partQuestions:this.state.partQuestions
		// })
	}


	deletePictureBonfirm(p,index) {
		console.log('(p,index: ', p,index)
		// this.state.workPages.splice(index,1)
		// this.setState({
		// 	workPages:this.state.workPages
		// })
		this.props.dispatch({
			type:"workManage/delPart",
			payload:{
				examId:p.examId,
				partId:p.partId
			}
		})
	}
	dragOver(e,_partIndex){
		this.setState({
			partActiveIndex:_partIndex
		})
		e.preventDefault();
	}
	questionGroupDrop(e,to){
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

	// onEditFinish=()=>{
	// 	this.state.work.pages=this.state.workPages
	// 	this.state.work.partQuestions=this.state.partQuestions
	// 	this.setState({
	// 		work:this.state.work
	// 	})
	// 	console.log('this.state.work',this.state.work,this.state.partQuestions,this.state.workPages)
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
		if(!this.state.work.subjectId) {
			msg='请选择一个学科！'
		}
		if(!this.state.work.classes||!this.state.work.classes.length) {
			msg='请选择一个班级！'
		}
		if(msg){
			message.destroy()
			message.warn(msg)
		}
		return msg
	}
	updateWork=(type)=>{
		this.state.work.pages=this.state.workPages
		this.state.work.partQuestions=this.state.partQuestions
		this.setState({
			work:this.state.work
		})
		console.log('this.state.work',this.state.work,this.state.partQuestions,this.state.workPages)
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
		let _w=document.querySelector('#kacha_side').offsetWidth
		let  scrollTop = e.currentTarget.scrollTop, 
		elm =  document.querySelector('#_action_bar');
		let _bool=(scrollTop>=elm.offsetTop)
		this.setState({
			hideTopContainer:_bool,
			fixedWidth:_bool?`calc( 100% - ${_w}px )`:`100%`,
			_boxWidth:_bool?`calc( 100% - 200px )`:''
		})
		
	}
	fetchUploadToken = () => {
		const { dispatch } = this.props;
		// dispatch({
		//   type: 'blog/getUploadToken',
		//   payload: {
		//   },
		//   callback: (res) => {
			
		//   }
		// });
		this.setState({
			uploadToken: '',
			fileKey: Date.now() + Math.floor(Math.random()*(999999-100000)+100000)+1
		  })
	  }
	  getUploadToken = () => {
		return {
		  token : 'q_Za3hpOf8elLvd3scwkkC9-_UCm-mKrHcszjPGW:YP06068Mfaq-GtwAmVaTE1xjCTk=:eyJzY29wZSI6ImhvbWV3b3JrIiwiZGVhZGxpbmUiOjE2MDA1ODIzNzV9',//this.state.uploadToken,
		  key : Date.now() + Math.floor(Math.random()*(999999-100000)+100000)+1
		}
	  }
	  beforeUpload(file) {
		return true;
	  }
	  createWork(){
			let msg=''
		  if(!this.state.work.subjectId) {
			  msg='请选择一个学科！'
		  }
		  if(!this.state.work.classes||!this.state.work.classes.length) {
			  msg='请选择一个班级！'
			}
			if(!store.get('wrongBookNews').schoolId){
				msg='没有学校！'
			}
		  if(msg){
			  message.destroy()
			  message.warn(msg)
			  return
			}
			this.setState({
				createWorking:true
			})
			const {name,subjectId,classes,time}=this.state.work
			let data={
				examName:name,
				subjectId,
				classId:classes.join(','),
				schoolId:store.get('wrongBookNews').schoolId,
				workTime:time
			}
			console.log('data: ', data);
			this.props.dispatch({
				type:"workManage/createWork",
				payload:data
			}).then((res)=>{
				this.setState({
					createWorking:true
				})
				if(res.data.result===0){
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
		let pparts=this.state.partQuestions.part
		return (
		<div className={[style.page_box,this.state.hideTopContainer?"_position":""].join(" ")}
			onScroll={this.containetScroll.bind(this)}
		>
			<div>
				<div style={{display:'flex',flexDirection:'column',alignItems:"center",marginBottom:22}}>
						<h4 style={{fontSize:20,height:40}} >
							{
								!this.state.editWorkName?
								<>
									{this.state.work.name}
									<img style={{marginLeft:10}} className='cup' onClick={()=>{this.setState({editWorkName:true})}} src={require('../../images/edit.png')} alt=""/>
								</>
								:
								<>
									<Input autoFocus={true} type='text' 
											onBlur={(e)=>{

												if(!e.target.value.toString().length){
													this.setState({workNameFail:true})
												}else{
													this.setState({
														work:{
															...this.state.work,
															name:e.target.value
														},
														editWorkName:false,workNameFail:false
													})
													
												}
											}} 
											style={{width:250}}
											defaultValue={this.state.work.name} 
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
				<div >

					{
						this.state.iscreateWOrk?
							<div style={{display:'flex',justifyContent:'center',marginTop:40}}>
								<Button loading={this.state.createWorking} type='primary' onClick={()=>this.createWork()}>添加作业</Button>
							</div>
						:
						<>
						<div className={style.top_box}>
						<div className='clearfix'>
								{
									this.state.workPages.map((item, i) => {
										return (
											<div key={item._pageId}  className={style.uploadbox}>
												<UploadItem lookPicture={this.showCropModel}  picture={item} index={i}
													deletePictureHander={(p,index)=>{
															console.log('p,index: ', p,index);
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
									this.state.workPages.map((item, i) => {
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
						
						{this.state.workPages.length==0?<div className={style._empty}>请点击左上角添加作业图片</div>:
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
										<Button loading={this.state.commitWorking} onClick={()=>{this.updateWork('updateWork')}} >
											保存作业
										</Button>
										<Button loading={this.state.saveWorking} className={style.saveworkbtn} onClick={()=>{this.updateWork('pulishWork')}} style={{marginLeft:14}} type='primary'>
											发布作业
										</Button>
									</div>
									
								</div>
								<div style={{width:'100%',boxSizing:'border-box',background:"#fff"}}>
								<div className={style.sider} style={{height: 'calc( 100% - 50px )'}}>
									<div className={style.sider_in}>
										<div style={{color:"#84888E",fontSize:14,marginBottom:14}}>
											拖动题目调整分组
										</div>
										<div className={style.que_group}>
												{
													pparts&&pparts.length?pparts.map((_part,p)=>{
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
																			this.state.partQuestions.part[p].name=e.target.value
																			this.setState({
																				editPartNameIndex:-1,
																				editPartName:false,
																				partQuestions:this.state.partQuestions
																			})
																			
																			}} 

																			defaultValue={_part.name}
																	/>
																	:
																	<div key={p} className={[style._part_title,p===this.state.partActiveIndex?style._active:''].join(' ')}>
																		{_part.name}
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
																_part.questions&&_part.questions.length?
																
																	<div style={{width:"100%",marginTop:15}}>
																	{_part.questions.map((area, k) => {
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
								<div className={style._box} style={{width: 'calc( 100% - 200px )',display:'inline-block'}}>
									<div className={style.content}>
										{
											pparts&&pparts.length?pparts.map((_part,p)=>{
												return(
													<div  className={style.group_box} key={p}>
														<div style={{marginBottom:10}} > {_part.name}</div>
														
														{
														_part.questions&&_part.questions.length?
														<div style={{width:"100%",marginBottom:15,background:'#efefef',padding:'20px 20px'}}>
														{
															_part.questions.map((item, k) => {
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
																			this.state.workPages.splice(index,1)
																			this.setState({
																				workPages: this.state.workPages,
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
																	this.state.workPages.splice(index,1)
																	this.setState({
																		workPages: this.state.workPages,
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
										this.state.workPages.splice(this.state.cpindex,1)
										this.setState({
											workPages:this.state.workPages,
											showEditPictureModal:false
										})
										console.log('this.state.workPages',this.state.workPages)
									}}
								></EditPageModal>
						
						</>
					}
						</>
					}

				</div>
			</div>
			
		</div>
    )
  }

  componentDidMount() {
		console.log('this.props.location.query',this.props.location.query)
		let aa={
			classId: "2935",
			className: "",
			createTime: "2020-09-21 18:33:19",
			createUserId: 4361471476795392,
			examId: 10,
			examName: "2020年09月21日科学作业-1",
			schoolId: 8256,
			status: 0,
			subjectId: 10,
			subjectName: "",
			workTime: "2020-09-21 00:00:00",
			_index: 1
		}

		let partQuestions=this.state.partQuestions
		setTimeout(() => {
			let array=[this.state.test,this.state.test1]
			// this.setState({
			// 	workPages:[this.state.test,this.state.test1]
			// })
			this.setState({
					workPages:[this.state.test]
			})
			return
			console.log('works',this.state.workPages)
			let _arr=[
				this.state.test
			]
			for (let index = 0; index < array.length; index++) {
				const element = array[index]
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
		console.log('partQuestions: ', this.state.partQuestions);
	}, 100);
    
    const { dispatch } = this.props;
    let userNews = store.get('wrongBookNews');
    let data = {
      schoolId: userNews.schoolId,
      year: this.props.state.years
		}
		
		let {classId,examName,examId,subjectId}=aa
    dispatch({
      type: 'workManage/getWorkPageClass',
      payload: data
    }).then((classData) => {
			this.setState({
				work:{
					...this.state.work,
					classes:classData.value
				}
			})

			console.log('classlist',classData,this.state.work)
			dispatch({
				type: 'workManage/getSchoolSubjectList'
			}).then((subs) => {
				console.log('subs: ', subs);
				if(subs.length){
					this.initWorkName(subs[0])
					
					this.setState({
						work:{
							...this.state.work,
							name:examName,
							classes:classId,
							subjectId
						}
					})
	
					dispatch({
						type:"workManage/schoolSubId",
						payload:subjectId
					})
					console.log('22',classId.split(","))
					dispatch({
						type:"workManage/workPageClass",
						payload:{
							list:classData.list,
							value:this.getClasses(classId)
						}
					})
				}
			})
    })
		
		dispatch({
			type:"workManage/getExamInfo",
			payload:{
				examId
			}
		}).then(workdata=>{
			console.log('workdata: ', workdata);
			//调用partinfo接口
			this.setState({
				_work:workdata
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
