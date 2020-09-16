import React, { useState, useEffect } from 'react';
import {
	Layout, Table,Input, Modal, Select, Spin, Checkbox, Icon
} from 'antd';
import { connect } from 'dva';
import style from './logContent.less';
import store from 'store';
import moment from 'moment';
import RenderCrop from '../RenderCrop/RenderCrop'
import RenderCropItem from '../RenderCropItem/RenderCropItem'

moment.locale('zh-cn');

const { Content } = Layout;
const Option = Select.Option;
class LogContent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			test:{
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
				"height": 3333
			},
			
			scwidth:720,
			tests:[]
		};
		

	}

	cropItemClick (index,i,pic) {

		pic['areas'][i]['selected']=!pic['areas'][i]['selected']
		// this.state.cpicture.areas[index]['selected']=!this.state.cpicture.areas[index]['selected']
		console.log('this.state.cpicture: ', pic);
	}
	render() {
		let wpages=this.state.tests
		return (
			<div style={{padding:!this.props.state.logType?'20px':''}}>
				{
					wpages.map((picture, j) => {
						let _t=JSON.stringify(picture)
						return (
							<>
								{!this.props.state.logType?<RenderCropItem picture={picture} index={j} key={j}></RenderCropItem>:<RenderCrop picture={JSON.parse(_t)} key={j}></RenderCrop>}
							</>
							
							)
						})
				}
			</div>
		);
	}
	componentDidMount() {
		let _tests=[this.state.test,this.state.test]
		this.setState({
			tests:_tests
		})
	}
	UNSAFE_componentWillMount() {
		
	}

}

export default connect((state) => ({
	state: {
		...state.homePage,
		getClassMembersFinish:state.classModel.getClassMembersFinish,
		classStudentList:state.classModel.classStudentList,
		years: state.temp.years,
		logType:state.workManage.logType
	}
}))(LogContent);
