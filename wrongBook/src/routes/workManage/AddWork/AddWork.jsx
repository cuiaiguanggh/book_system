import React from 'react';
import {
  Layout, Menu,Spin , Button, message,DatePicker, Select, Popover,Input, Icon, Popconfirm,Empty,Modal, Checkbox
} from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import style from './AddWork.less';
import moment from 'moment';
import store from 'store';
import Upload from '../Upload/Upload'
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
				"areas": [
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
				"pageId": 344215,
				"count": 5,
				"width": 2500,
				"height": 3333,
				"name":''
			},
			test1:{
				"name":'',
				"areas": [{
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
			work:{
				name:'未命名作业',
				classes:[],
				subjectId:1,
				pages:[],
				
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
			mouseIsDown:false
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
			placeholder="学科"
			value={this.props.state.schoolSubId}
			onChange={(value) => {
				this.props.dispatch({
					type:"workManage/schoolSubId",
					payload:value
				})
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


	addImgBtnClick(){
		let _arr=this.state.workPages
		_arr.push(this.state.test)
		this.setState({
			workPages:_arr
		})
		console.log('workPages: ', this.state.workPages);
	}
	showCropModel(p,i){
		this.setState({
			cpicture:p,
			showEditPictureModal:true,
			cpindex:i
		})
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

	initWorkName(subname){
		var date = new Date();
		var year = (date.getFullYear())
		var moun = (date.getMonth()+1)
		let day = date.getDate()
		if(moun<10) moun='0'+moun
		if(day<10) day='0'+day
		this.setState({
				work:{
					...this.state.work,
					name:`${year}年${moun}月${day}日${subname}作业`
				}
			}
		)
	}
	addPart(){
		this.state.partQuestions.part.push(
				{name:`题组${this.state.partQuestions.part.length+1}`,
				questions:[]
			}
		)
		this.setState({
			partQuestions:this.state.partQuestions
		})
	}


	deletePictureBonfirm(p,index) {
		this.state.workPages.splice(index,1)
		this.setState({
			workPages:this.state.workPages
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

	onEditFinish=()=>{
		this.state.work.pages=this.state.workPages
		this.state.work.partQuestions=this.state.partQuestions
		this.setState({
			work:this.state.work
		})
		console.log('this.state.work',this.state.work,this.state.partQuestions,this.state.workPages)
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
			  return
		  }
		  // this.setState({
		  // 	commitWorking:true
		  // })
		  return
		  store.set('workdata', this.state.workPages);
		  setTimeout(() => {
			  console.log('store.getworkdata): ', store.get('workdata'));
			  this.props.dispatch(routerRedux.push('/workManage'))
		  }, 1000);
	  
	}
  	render() {

		let pquestions=this.state.partQuestions.questions
		let pparts=this.state.partQuestions.part
		// console.log('pparts: ', pparts,this.state.partQuestions);
		return (
		<div className={[style.page_box,"_position"].join(" ")}>
					<div className={style.top_box}>
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
						<div>
						<div className='clearfix'>
								{
									this.state.workPages.map((item, i) => {
										return (
											<div key={item.pageId}  className={style.uploadbox}>
												<Upload lookPicture={this.showCropModel}  picture={item} index={i}
													deletePictureHander={(p,index)=>{
														console.log('p,index: ', p,index);
														this.deletePictureBonfirm(p,index)
													}}
												></Upload>
											</div>
											)
										})
								}
							
							<div className={style.uploadbox}>
								<div className={[style.uploadBtn,'cup'].join(' ')} onClick={()=>this.addImgBtnClick()}>添加图片</div>
							</div>
						</div>
							<div style={{marginTop:32}}>
								{
									this.state.workPages.map((item, i) => {
										return (
											<div key={i} style={{marginTop:14}} className={style.queitem}>
												<span style={{width:60}} className={style.quelabel}>图片{i+1}</span> {item.areas?item.areas.map((area, j) => {
												return (
												<span key={j} className={style.quespanbtn}>{`${j+1} 选择题`}</span>
																)
													}):''}
											</div>
											)
										})
								}
							</div>
					</div>
				</div>
				<div className={style.question_content}>
					<div className={style._action_bar}>
							<Checkbox checked={this.state.lookQuestion}
								onClick={()=>{
									this.setState({
										lookQuestion:!this.state.lookQuestion
									})
								}}
						>显示试题</Checkbox>
						<Button loading={this.state.commitWorking} onClick={()=>{this.onEditFinish()}} style={{marginLeft:14,position:'absolute'}} type='primary'>
							发布作业
						</Button>

					</div>
					<Layout style={{width:'100%',boxSizing:'border-box',background:"#fff"}}>
					<Sider className={style.sider} style={{height: 'calc( 100% - 50px )'}}>
						<div className={style.sider_in}>
							<div style={{color:"#84888E",fontSize:14,marginBottom:14}}>
								拖动题目调整顺序
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
									this.addPart()
								}}
								>添加题组	
							</Button>
						</div>
					</Sider>
					<Content className={style._box} style={{ position: 'relative',padding:'20px',background:'#fff' }}  >
							<div className={style.content} >
								<div>
								{/* <div> 
									<Popover placement="right"  trigger="hover" content={
											pparts&&pparts.length?pparts.map((pt,n)=>{
												return (
														<Button className={style.partp} key={n} onClick={()=>{
															this.removeQuestions(n)
														}}>{pt.name}</Button>
													)
												}):'没有可选题组'
											}>
										<Button type='primary'>移动到题组</Button>
									</Popover>
		
								</div> */}
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
													<Section  ischecked={this.state.ischecked} showQuestion={this.state.lookQuestion} 
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
									:<div className={style._empty}>请点击左上角添加作业图片</div>}
								
								</div>
						</div>
					</Content>
				</Layout>
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
				</div>
    )
  }

  componentDidMount() {
	setTimeout(() => {
		let partQuestions=this.state.partQuestions
		let array=[this.state.test,this.state.test1]
		// this.setState({
		// 	workPages:[this.state.test,this.state.test1]
		// })
		this.setState({
				workPages:[this.state.test]
			})
		console.log('works',this.state.workPages)
		let _arr=[
			
		]
		for (let index = 0; index < array.length; index++) {
			const element = array[index]
			if(element.areas.length){
			
				for (let j = 0; j < element.areas.length; j++) {
					_arr.push(element.areas[j])
					
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
    })
    dispatch({
			type: 'workManage/getSchoolSubjectList'
		}).then((subs) => {
			console.log('subs: ', subs);
			if(subs.length){
				this.initWorkName(subs[0].v)
			}
		})

  }

  componentWillUnmount() {
  }



}

export default connect((state) => ({
  state: {
    ...state.report,
    ...state.classHome,
    ...state.homePage,
    workPageClass:state.workManage.workPageClass,
    years: state.temp.years,
    schoolSubId:state.workManage.schoolSubId,
    classSubjectData:state.classModel.classSubjectData,
    schoolSubjectList:state.workManage.schoolSubjectList
  }
}))(WorkManage);
