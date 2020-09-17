import React from 'react';
import {
  Layout, Menu,Spin , Button, message,DatePicker, Select, Popover,Input, Icon, Checkbox,Empty,Modal
} from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './AddWork.less';
import moment from 'moment';
// import { dataCenter } from '../../../config/dataCenter'
import store from 'store';
import Upload from '../Upload/Upload'
import Section from '../Section/Section'
import * as XLSX from 'xlsx';
import observer from '../../../utils/observer'
const { RangePicker } = DatePicker;

//作业中心界面内容
const Option = Select.Option;
const { Sider, Content,
} = Layout;

class WorkManage extends React.Component {
  constructor(props) {
		super(props);
    this.Ref = ref => {
      this.refDom = ref
		};
		this.showCropModel=this.showCropModel.bind(this);
    this.state = {
      nowclassid: '',
      currentSudent:{},
      questions:[],
      file: [],
      uploadFileName: '请选择EXCEL文件导入',
      chechBtnLoaing:false,
      classLoding:true,
      sdate:'',
      edate:'',
      defaultDate:moment().locale('zh-cn').format('YYYY-MM-DD'),
			excelMatching:false,
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
				"height": 3333
			},
			test1:{
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
			showModal:false,
			cpicture:{},
			visible:false,
			scwidth:720,
			cutLeft:0,cutTop:0,cutWidth:100,cutHeight:100,
			showGifTip:false,
			cropIndex:-1,
			cpindex:-1,
			commitWorking:false,
			work:{
				name:'新教育',
				classes:'',
				subjectId:1,
				pages:[]
			}
    }
	}
	cropItemClick (index,e) {
		this.setState({
			cropIndex:index
		})
		console.log('click item', this.state.cpicture.areas[index])
		let area = this.state.cpicture.areas[index].area
		this.toShowCropBox(area.x / 720 * this.state.scwidth, area.y / 720 * this.state.scwidth, area.width / 720 * this.state.scwidth, area.height / 720 * this.state.scwidth)

		this.state.cpicture.areas[index]['selected']=!this.state.cpicture.areas[index]['selected']
		console.log('this.state.cpicture: ', this.state.cpicture);
		if (this.state.showGifTip) {
			this.setState({
				showGifTip:false
			})
		}
		e.stopPropagation()
	}
	_cutTouchStart (e, id) {
		if (!id) return
		let currentX = e.touches[0].clientX
		let currentY = e.touches[0].clientY
		if (id === 4) {
			this._flag_cut_touch = true
			this._flag_img_endtouch = true
			this.CUT_START = {
				width: this.cutWidth,
				height: this.cutHeight,
				x: currentX,
				y: currentY,
				corner: 4
			}
		} else if (id === 3) {
			this._flag_cut_touch = true
			this._flag_img_endtouch = true
			this.CUT_START = {
				width: this.cutWidth,
				height: this.cutHeight,
				x: currentX,
				y: currentY,
				cutTop: this.cutTop,
				cutLeft: this.cutLeft,
				corner: 3
			}
		} else if (id === 2) {
			this._flag_cut_touch = true
			this._flag_img_endtouch = true
			this.CUT_START = {
				width: this.cutWidth,
				height: this.cutHeight,
				cutTop: this.cutTop,
				cutLeft: this.cutLeft,
				x: currentX,
				y: currentY,
				corner: 2
			}
		} else if (id === 1) {
			this._flag_cut_touch = true
			this._flag_img_endtouch = true
			this.CUT_START = {
				width: this.cutWidth,
				height: this.cutHeight,
				cutTop: this.cutTop,
				cutLeft: this.cutLeft,
				x: currentX,
				y: currentY,
				corner: 1
			}
		}
	}
	_rectTouchStart (e) {
		if (e.mp.target.id == 'delete_9527') return
		this.originalPos.mouseX = e.touches[0].clientX
		this.originalPos.mouseY = e.touches[0].clientY
		let _this = this
		// var query = wx.createSelectorQuery()
		// query.select('#rect_item9527').boundingClientRect()
		// query.exec(function (res) {
		//   console.log(e)
		//   _this.originalItemArea.left = res[0].left
		//   _this.originalItemArea.top = res[0].top
		// })
	}
	_cutTouchMove (e, n) {
		let width = this.cutWidth
		let height = this.cutHeight
		let cutTop = this.cutTop
		let cutLeft = this.cutLeft
		height = this.CUT_START.height + ((this.CUT_START.corner > 1 && this.CUT_START.corner < 4 ? 1 : -1) * (this.CUT_START.y - e.touches[0].clientY))
		switch (this.CUT_START.corner) {
			case 1:
				width = this.CUT_START.width + this.CUT_START.x - e.touches[0].clientX
				cutLeft = this.CUT_START.cutLeft - (width - this.CUT_START.width)
				break
			case 2:
				width = this.CUT_START.width + this.CUT_START.x - e.touches[0].clientX
				cutTop = this.CUT_START.cutTop - (height - this.CUT_START.height)
				cutLeft = this.CUT_START.cutLeft - (width - this.CUT_START.width)
				break
			case 3:
				width = this.CUT_START.width - this.CUT_START.x + e.touches[0].clientX
				cutTop = this.CUT_START.cutTop - (height - this.CUT_START.height)
				break
			case 4:
				width = this.CUT_START.width - this.CUT_START.x + e.touches[0].clientX
				break
		}
		if (width < this.rectMinSize) {
			width = this.rectMinSize
		}
		if (height < this.rectMinSize) {
			height = this.rectMinSize
		}
	
		let _height = this.imageData.displayImage.height - this.cutTop
		console.log(height , _height,this.CUT_START.corner)
		if (height >= _height) {
			height = _height
		}
		if (height >= this.imageData.displayImage.height) {
			height = this.imageData.displayImage.height
		}
		let _width = this.imageData.displayImage.width - this.cutLeft
		if (width >= _width) {
			width = _width
		}

		this.cutWidth = width
		this.cutLeft = cutLeft
		this.cutHeight = height
		this.cutTop = cutTop
		
	}
	_rectMove (e, index) {
		// 移动题目框
		let nl =e.touches[0].clientX - (this.originalPos.mouseX - this.originalItemArea.left) - this.imageData.displayImage.left
		let nt =e.touches[0].clientY - (this.originalPos.mouseY - this.originalItemArea.top) - parseInt(this.imageData.displayImage.top)
		let iw = this.imageData.displayImage.width
		let ih = this.imageData.displayImage.height
		const rw = this.cutWidth
		if (rw >= iw) {
			this.cutWidth = iw
		}
		const rh = this.cutHeight
		if (nl <= 0) {
			nl = 0
		}
		if (nt <= 0) {
			nt = 0
		}
		let _l = iw - rw
		if (nl >= _l) {
			nl = _l
		}
		if (nt >= ih - rh) {
			nt = ih - rh
		}

		this.cutLeft = nl
		this.cutTop = nt
	}
	getQnCropUrl () {
		let _width = this.cutWidth / this.imageData.displayImage.width * this.state.cpicture.width
		let _height = this.cutHeight / this.imageData.displayImage.height * this.state.cpicture.height
		let _x = this.cutLeft / this.imageData.displayImage.width * this.state.cpicture.width
		let _y = this.cutTop / this.imageData.displayImage.height * this.state.cpicture.height
		let purl = this.state.cpicture.serUrl || 'noqniu_img'
		let _str = ''
		if (purl.indexOf('?imageMogr2') === -1) {
			_str = '?imageMogr2'
		}
		if (_x < 0) _x = 0
		if (_y < 0) _y = 0
		return `${purl}${_str}/crop/!${_width.toFixed(2)}x${_height.toFixed(2)}a${_x.toFixed(2)}a${_y.toFixed(2)}`
	}
	_deleteCropItem () {
		if (this.state.cpicture.areas[this.cropIndex].addRect) {
			this.state.cpicture.areas.splice(this.cropIndex, 1)
			// 新增题目支持删除
		} else {
			this.state.cpicture.areas[this.cropIndex].selected = false
		}

		this.showCropBox = false
		this.cropIndex = -1
	}
	saveCropItem (callback) {
		if (this.cropIndex < 0) return
		this.showCropBox = false
		let _x = this.cutLeft / this.state.scwidth * 720
		let _y = this.cutTop / this.state.scwidth * 720
		let _width = this.cutWidth / this.state.scwidth * 720
		let _height = this.cutHeight / this.state.scwidth * 720
		let _imgUrl = this.getQnCropUrl()

		let _area = {
			x: _x,
			y: _y,
			height: _height,
			width: _width,
			rotate: 0,
			imgUrl: _imgUrl,
			index: 999
		}

		let _index = this.cropIndex
		this.state.cpicture.areas[_index].area = _area
		this.$set(this.state.cpicture.areas, _index, this.state.cpicture.areas[_index])
		this.cropIndex = -1
		console.log('img crop saved', this.cropIndex, _imgUrl)
		if (callback) callback()
	}
	needSave () {
		return this.cropIndex > -1
	}
	reset () {
		this.cropIndex = -1
		this.showCropBox = false
		this.state.showGifTip = true
	}
	isCropItem (x, y) {
		let index = -1
		let _dism = this.imageData.displayImage
		let _x = x - _dism.left
		let _y = y - _dism.top
		for (let i = 0; i < this.state.cpicture.areas.length; i++) {
			const ele = this.state.cpicture.areas[i].area
			let minx = (ele.x) / 720 * this.state.scwidth
			let maxx = (ele.x + ele.width) / 720 * this.state.scwidth

			let miny = (ele.y) / 720 * this.state.scwidth
			let maxy = (ele.y + ele.height) / 720 * this.state.scwidth
			if (_x >= minx && _x <= maxx && _y >= miny && _y <= maxy) {
				console.log('this click index', i)
				index = i
			}
		}
		return index
	}
	_cropMaskClick (e) {
		this.saveCropItem()
		if (this.state.cpicture.areas.length > 0) {
			let _index = this.isCropItem(e.touches[0].clientX, e.touches[0].clientY)
			if (_index > -1) {
				this.showCropBox = false
				this.cropItemClick(_index)
			}
		}
	}
	AddCropData () {
		let cropSize={
			height: 150,
			width: 150
		}
		let iw=this.imageData.displayImage.width
		let ih=this.imageData.displayImage.height
		if(cropSize.width>iw) cropSize.width=iw
		if(cropSize.height>ih) cropSize.height=ih
		return {
			cx: this.imageData.displayImage.width / 2 - cropSize.width / 2,
			cy: this.imageData.displayImage.height / 2 - cropSize.height / 2,
			cwidth: cropSize.width,
			cheight: cropSize.height
		}
	}
	checkCanAddCrop (_x, _y, _width, _height) {
		if (this.state.cpicture.areas.length === 0) return true
		let lastCrop = this.state.cpicture.areas[this.state.cpicture.areas.length - 1].area
		if (lastCrop.x === _x && lastCrop.y === _y && lastCrop.width === _width && lastCrop.height === _height) {
			// 应该做循环判定？
			return false
		} else {
			return true
		}
	}
	toShowCropBox (cx, cy, cw, ch) {
		this.cutLeft = cx
		this.cutTop = cy
		this.cutWidth = cw
		this.cutHeight = ch
		this.showCropBox = true
	}
	newCropItem () {
		// 还有优化空间...
		if (this.cropIndex > -1) {
			// 先保存上一个框
			this.saveCropItem()
		}
		this.state.showGifTip = false
		const {cx, cy, cwidth, cheight} = this.AddCropData()
		let _x = cx / this.state.scwidth * 720
		let _y = cy / this.state.scwidth * 720
		let _width = cwidth / this.state.scwidth * 720
		let _height = cheight / this.state.scwidth * 720
		if (!this.checkCanAddCrop(_x, _y, _width, _height)) {
			this.toShowCropBox(cx, cy, cwidth, cheight)
			this.cropIndex = this.state.cpicture.areas.length - 1
			return
		}
		// 新增一个框
		this.toShowCropBox(cx, cy, cwidth, cheight)
		this.cropIndex = this.state.cpicture.areas.length

		let _area = {
			x: _x,
			y: _y,
			height: _height,
			width: _width,
			rotate: 0
		}
		this.state.cpicture.areas.push({
			area: _area,
			mark: 0,
			num: this.state.cpicture.areas.length,
			pageid: this.state.cpicture.pageId,
			type: 0,
			selected: true,
			addRect: true
		})

		console.log('new crop', this.cutTop, this.imageData)
	}
  timeHanderChange(dates, dateString) {
    console.log('dateString: ', dateString);
    this.setState({
          sdate: dateString[0],
          edate: dateString[1]
      }, () => {
          // this.callInterface();
      })
  }
  checkQuestions(){
    if(this.state.chechBtnLoaing){
      console.log('this.state.chechBtnLoaing: ', this.state.chechBtnLoaing,'正在提交');
      return 
    }
    this.setState({
      chechBtnLoaing:true
    })
    let _arr=this.props.state.classStudentList
    let prdata=[]
    for (let index = 0; index < _arr.length; index++) {
      const ele = _arr[index]
      let item={
        userId:ele.userId,
        uqIds:[]
      }
      if(this.props.state.saleId&&ele.userId===this.props.state.saleId){
       
        if(ele.qustionlist){
          for (let index = 0; index < ele.qustionlist.length; index++) {
            let picid=ele.qustionlist[index].picId
            // console.log('picid: ', picid);
            if(picid){
              picid=picid.substring(5)
              // console.log('new picid: ', picid);
              item.uqIds.push('')
            }
          }
        }
      }else if(ele&&ele.questionHook){
        for (let key in ele.questionHook) {
          let _keys=key.split('-')
//           let _qid=_arr[parseInt(_keys[0])].qustionlist[parseInt(_keys[1])].questionId||0
          let _qid=_arr[parseInt(_keys[0])].qustionlist[parseInt(_keys[1])].picId
          _qid=_qid.substring(5)
          item.uqIds.push(_qid)
        }
      }
      
      item.uqIds=item.uqIds.toString()
      prdata.push(item)
    }
    console.log('prdata: ', prdata,JSON.stringify(prdata));
    this.props.dispatch({
      type: 'classHome/fetchQuestions',
      payload:  {
        data:prdata
      }
    }).then(()=>{
      this.setState({
        chechBtnLoaing:false
      })
    })
  }
  
  menuClick = (e) => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'homePage/infoClass',
    //   payload: e.key
    // });
    // dispatch({
    //   type: 'classHome/classId',
    //   payload:  e.key
    // })
    this.setState({
      nowclassid: e.key
    })
    dispatch({
      type: 'classModel/checkClassId',
      payload: e.key
    })
    dispatch({
      type: 'classModel/getClassSubjectList',
      payload: {
        classId:e.key,
        year:this.props.state.years
      }
    });
    
    dispatch({
      type: 'classModel/getClassMembers',
      payload: {
        type: 3,
        classId:e.key
      }
    })

  }


  

  
  onEditFinish=()=>{
		this.setState({
			commitWorking:true
		})
		store.set('workdata', this.state.workPages);
		setTimeout(() => {
			console.log('store.getworkdata): ', store.get('workdata'));
			this.props.dispatch(routerRedux.push('/workManage'))
		}, 1000);
    
  }
  selectStudentFun(student){
    this.setState({
      currentSudent:student
    })
  }

  renderSubjectList() {
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
                type:"classModel/classSubjectData",
                payload:{
                  list:subList,
                  value
                }
              })
            }}>
          {children}
        </Select>
      </>
    )
  }
  renderClassList() {
		let classes = this.props.state.workPageClass.list;
		// console.log('classes: ', classes);
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
          placeholder="班级"
          onChange={(value) => {
						console.log('value: ', value);
              this.props.dispatch({
                type:"workManage/workPageClass",
                payload:{
                  list:classes,
                  value
                }
              })
            }}>
          {children}
        </Select>
      </>
    )
  }

  updateClassMembers(_classId){
    this.props.dispatch({
      type: 'homePage/infoClass',
      payload: _classId
    });
    this.setState({
      nowclassid: _classId
    })
    //学科查询是题目查询的先决条件
    this.props.dispatch({
      type: 'classModel/getClassSubjectList',
      payload: {
        classId:_classId,
        year:this.props.state.years
      },
    });
    this.props.dispatch({
      type: 'classModel/getClassMembers',
      payload: {
        type: 3,
        classId:_classId
      }
    });
  }
  initQuestionChecked(data){
		let _tes = this.props.state.classStudentList

    let _length=_tes.length>data.length?data.length:_tes.length
		for (let index = 0; index < _length; index++) {
        const e = data[index]
        for (let j = 0; j < e.length; j++) {
          if(j<e.length-1){
            let key=`${index}-${j}`
            const a = e[j+1]
            if(a===0){
              if(!_tes[index].questionHook){
                _tes[index].questionHook={}
              }
              _tes[index].questionHook[key]=true
            }else{
              if(_tes[index].questionHook)
              delete _tes[index].questionHook[key]
            }
          }
          
        }
    }
    
		this.props.dispatch({
			type: 'classModel/classStudentList',
			payload: _tes
		})
    console.log('excel match data', _tes);
    var f = document.getElementById('file');
    f.value = ''; //重置了file的outerHTML
    message.success('数据导入成功');
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
		console.log('p: ', p);
		this.setState({
			showModal:true,
			cpicture:p,
			cpindex:i
		})
	}
	checkCpicture(){
		this.state.workPages.splice(this.state.cpindex,1,this.state.cpicture)
		console.log('this.state.workPages: ', this.state.workPages);
		this.setState({
			showModal:false
		})
	}
	cancelModel(e){
		this.setState({
			showModal:false
		})
	}
	upSection(){
		this.setState({
			workPages: this.state.workPages,
		})
		console.log('workPages: ', this.state.workPages);
	}

	renderQueArea(){
		return(
			<>
				<div style={{marginTop:32}}>
					{
						// this.state.workPages.map((item, i) => {
						// 	return (
						// 		<div key={i} style={{marginTop:14}} className={style.queitem}>
						// 			<span style={{width:60}} className={style.quelabel}>第{i+1}页</span> {item.areas?item.areas.map((area, j) => {
						// 			return (
						// 			<span key={j} className={style.quespanbtn}>{`${j+1} 选择题`}</span>
						// 							)
						// 				}):''}
						// 		</div>
						// 		)
						// 	})
					}
				</div>

				<div style={{marginTop:20}}>
					{
						this.state.workPages.map((item, i) => {
							return (
								<Section key={i} index={i} section={item} upSectionHander={()=>{
									this.upSection()
								}}></Section>
								)
							})
					}
				</div>
              
			</>
		)
	}
  render() {
    const content = (
      <div>
        <p>{this.state.uploadFileName||'请选择EXCEL文件导入'}</p>
      </div>
    )
      return (
      <>
        <Content className={style._box} style={{ height: '100%',minHeight:500, overflow: 'hidden', position: 'relative',padding:20,background:'#F0F2F5' }} ref='warpper' >
				<div className={style.content} >
                <div style={{display:'flex',flexDirection:'column',alignItems:"center",marginBottom:22}}>
									<h4 style={{fontSize:20}}>
										{this.state.work.name}
										<img className='cup' src={require('../../images/edit.png')} alt=""/>
									</h4>
									<div style={{marginTop:14}}>
										班级：{this.renderClassList()}
										学科：{ 
											this.renderSubjectList()
										}
										</div>
								</div>
								<div>
									<div className='clearfix'>
										{
											this.state.workPages.map((item, i) => {
												return (
													<div key={i}  className={style.uploadbox}>
														<Upload getFun={this.showCropModel} picture={item} index={i+1}></Upload>
													</div>
													)
												})
										}
										
										<div className={style.uploadbox}>
											<div className={[style.uploadBtn,'cup'].join(' ')} onClick={()=>this.addImgBtnClick()}>添加图片</div>
										</div>
									</div>
									{this.state.workPages.length>0?<>{
										this.state.workPages.map((item, i) => {
											return (
												<Section key={item.pageId} index={i} section={item} deleteSectionHander={(index)=>{
														this.state.workPages.splice(index,1)
														this.setState({
															workPages: this.state.workPages,
														})
													}}
													upSectionHander={()=>{
														this.setState({
															workPages: this.state.workPages,
														})
													}}
													addPartHander={(index,data)=>{
														let work=this.state.workPages[index]
														work.sections=data
														this.state.workPages.splice(index,1,work)
														console.log('this.state.workPages: ', this.state.workPages);
														this.setState({
															workPages: this.state.workPages,
														})
													}}
													>

												</Section>
												)
											})
									}</>
									:<div className={style._empty}>请点击左上角添加作业图片</div>}
								
								</div>
						</div>
						<div className={style._footer}>
							<Button>查看原图</Button>
							<Button loading={this.state.commitWorking} onClick={()=>{this.onEditFinish()}} style={{marginLeft:14}} type='primary'>完成作业编辑</Button>
						</div>
						<Modal
							closable={false} keyboard={false} maskClosable={true}
							onCancel={()=>{this.cancelModel()}}
							className="unsetModal"
							visible={this.state.showModal}
							footer={[<div key='1' style={{display:'inline-block',float:'left'}}>备注：<Input key='2' style={{width:'250px'}} type='text'></Input></div>,<Button key='3' onClick={()=>{this.newCropItem}}>手动框题</Button>,<Button key='4'>重新识别</Button>,<Button onClick={()=>{this.checkCpicture()}} key='5' type='primary' >确定</Button>]}
						>
							<div className={style.img_box}>

							<img style={{width:720}}  src={this.state.cpicture.serUrl} alt=""/>
							<div className={style.crop_box}>
						
								{/* <div className={style.crop_content} onClick={(e)=>this._cropMaskClick(e)} v-if='showCropBox'>
									<div className={style.content_top,style.bg_gray} style={{height:this.state.cutTop+'px'}}></div>
									<div className={style.content_middle} style={{height:this.state.cutHeight+'px'}}>
										<div className={style.content_middle_left} style={{width:this.state.cutLeft+'px'}}></div>
										<div id="rect_item9527" onTouchStart={(e)=>this._rectTouchStart(e)}  onTouchMove={(e)=>{this._rectMove(e)}} className={style.content_middle_middle} style={{width:this.state.cutWidth+'px',height:this.state.cutHeight+'px'}}>

											<div className={style.rect_hander,style.rect_hander1} 
												onTouchStart='_cutTouchStart($event,1)' 
												onTouchMove='_cutTouchMove($event)'>
												<div className={style.rect_hander_border}></div>
											</div>
											<div className={style.rect_hander,style.rect_hander2} 
											onTouchStart='_cutTouchStart($event,2)' 
												onTouchMove='_cutTouchMove($event)'>
												<div className={style.rect_hander_border}></div>
											</div>
											<div className={style.rect_hander,style.rect_hander3} 
											onTouchStart='_cutTouchStart($event,3)' 
												onTouchMove='_cutTouchMove($event)'>
												<div className={style.rect_hander_border}></div>
												</div>
											<div className={style.rect_hander,style.rect_hander4} 
											onTouchStart='_cutTouchStart($event,4)' 
												onTouchMove='_cutTouchMove($event)'>
												<div className={style.rect_hander_border}></div>
											</div>
											<div className={style.rect_hander_delete} id='delete_9527' onClick='_deleteCropItem()'>
												<div className='iconfont icon-cuohao'></div>
											</div>
										</div>
										<div className={style.content_middle_right,style.bg_gray}></div>
									</div>
									<div className={style.content_bottom,style.bg_gray} ></div>
							</div> */}
							<div className={style.rect_mask}>
								{
									this.state.cpicture.areas?this.state.cpicture.areas.map((item, i) => {
										return (
											<div className={item.selected?'rect_item_active rect_item':'rect_item'}        
												key={i}  
												style={{
														width:item.area.width/720*this.state.scwidth+'px',
														height:item.area.height/720*this.state.scwidth+'px',
														left:item.area.x/720*this.state.scwidth+'px',
														top:item.area.y/720*this.state.scwidth+'px',
														zIndex:50-i,
												}} 
												onClick={(e)=>{this.cropItemClick(i,e)}} 
											
												>
												<Input  key={i} onClick={(e)=>{e.stopPropagation()}}  className={style.inputnum} defaultValue={i+1}/>
										</div>
											
											)
										}):''
								}
								
							</div>
						</div>
						</div>

						</Modal>
				</Content>
      </>
    )
  }

  componentDidMount() {
		setTimeout(() => {
			// this.addImgBtnClick()
			this.setState({
				workPages:[this.state.test,this.state.test1]
			})
			console.log('works',this.state.workPages)
		}, 800);
    observer.addSubscribe('updateClass', () => {
      console.log('questionFetch page updateClass..',this.props.state.workPageClass.list.length,this.props.state.workPageClass.list);
      if(this.props.state.workPageClass.list.length){

        this.updateClassMembers(this.props.state.checkClassId)
      }
    })
    const { dispatch } = this.props;
    let userNews = store.get('wrongBookNews');
    let data = {
      schoolId: userNews.schoolId,
      year: this.props.state.years
    }
    dispatch({
      type: 'workManage/getWorkPageClass',
      payload: data
    }).then((classlist) => {
      
      if (classlist && classlist.length > 0) {
        let classId=classlist[0].classId||0
        this.updateClassMembers(classId)
      }
    })
    dispatch({
        type: 'workManage/getSchoolSubjectList'
      }).then((res) => {
          console.log('res: ', res);
       
      })

  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'classModel/classSubjectData',
      payload: {
        list:[],
        value:''
      }
    })
  }



}

export default connect((state) => ({
  state: {
    ...state.report,
    ...state.classHome,
    ...state.homePage,
    // ...state.temp,
    workPageClass:state.workManage.workPageClass,
    getClassMembersFinish:state.classModel.getClassMembersFinish,
    classStudentList:state.classModel.classStudentList,
    years: state.temp.years,
    subList: state.temp.subList,
    schoolSubId:state.workManage.schoolSubId,
    checkClassId:state.classModel.checkClassId,
    classSubjectData:state.classModel.classSubjectData,
    schoolSubjectList:state.workManage.schoolSubjectList
  }
}))(WorkManage);
