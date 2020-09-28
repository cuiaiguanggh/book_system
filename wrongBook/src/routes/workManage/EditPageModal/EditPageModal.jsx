import React from 'react';
import {
  Button,Input,message,Modal,Spin
} from 'antd';
import { connect } from 'dva';
import style from './EditPageModal.less';

class EditPageModal extends React.Component {
  constructor(props) {
		super(props);
    	this.state = {
			// _currentPicture:props._currentPicture,
			scwidth:720,
			cutLeft:0,cutTop:0,cutWidth:100,cutHeight:100,
			originalPos:{
				mouseX:0,
				mouseY:0
			},
			rectMinSize:10,
			cropIndex:-1,
			
			imageData:{
				displayImage:{
					"width": 720,
					"height": 959.5,
					"left": 0,
					"top": 0,
					
				},
				originWidth:1200,
				originHeight:800
			},
			originalItemArea: {
				left: 0,
				top: 0
			  },
			mouseIsDown:false,
			hideBar:false,
			imgSpingData:{
				text:'正在处理...',
				isShow:false
			}
    }
	}

	cropItemClick (index,e) {
		this.setState({
			cropIndex:index
		})
		console.log('click item', this.props._currentPicture.questions[index])
		let area = this.props._currentPicture.questions[index].area
		this.toShowCropBox(area.x / 720 * this.state.scwidth, area.y / 720 * this.state.scwidth, area.width / 720 * this.state.scwidth, area.height / 720 * this.state.scwidth)
		// this.props._currentPicture.questions[index]['selected']=!this.props._currentPicture.questions[index]['selected']
	}
	_handerStart (e, id) {
		this.setState({
			mouseIsDown:true
		})
		if (!id) return
		let currentX = e.clientX
		let currentY = e.clientY
		if (id === 4) {
			this._flag_cut_touch = true
			this._flag_img_endtouch = true
			this.CUT_START = {
				width: this.state.cutWidth,
				height: this.state.cutHeight,
				x: currentX,
				y: currentY,
				corner: 4
			}
		} else if (id === 3) {
			this._flag_cut_touch = true
			this._flag_img_endtouch = true
			this.CUT_START = {
				width: this.state.cutWidth,
				height: this.state.cutHeight,
				x: currentX,
				y: currentY,
				cutTop: this.state.cutTop,
				cutLeft: this.state.cutLeft,
				corner: 3
			}
		} else if (id === 2) {
			this._flag_cut_touch = true
			this._flag_img_endtouch = true
			this.CUT_START = {
				width: this.state.cutWidth,
				height: this.state.cutHeight,
				cutTop: this.state.cutTop,
				cutLeft: this.state.cutLeft,
				x: currentX,
				y: currentY,
				corner: 2
			}
		} else if (id === 1) {
			this._flag_cut_touch = true
			this._flag_img_endtouch = true
			this.CUT_START = {
				width: this.state.cutWidth,
				height: this.state.cutHeight,
				cutTop: this.state.cutTop,
				cutLeft: this.state.cutLeft,
				x: currentX,
				y: currentY,
				corner: 1
			}
		}
		e.stopPropagation()
	}
	_rectTouchStart (e) {
		if (e.target.id == 'delete_9527') return
		this.CUT_START = {
			corner: 0
		}
		this.setState({mouseIsDown:true})
        var elm = document.querySelector('#rect_item9527');
		console.log(elm.offsetLeft, elm.offsetTop);
		this.setState({
			originalPos:{
				mouseX : e.clientX,
				mouseY : e.clientY
			},
			originalItemArea:{
				left:elm.offsetLeft,
				top:elm.offsetTop
			}
		})
	}
	_handerMove (e, n) {
		
		if(!this.state.mouseIsDown)return 
		this.setState({
			hideBar:true
		})
		if(this.CUT_START.corner===0){
			return this._rectMove(e)
		}
		let width = this.state.cutWidth
		let height = this.state.cutHeight
		let cutTop = this.state.cutTop
		let cutLeft = this.state.cutLeft
		height = this.CUT_START.height + ((this.CUT_START.corner > 1 && this.CUT_START.corner < 4 ? 1 : -1) * (this.CUT_START.y - e.clientY))
		switch (this.CUT_START.corner) {
			case 1:
				width = this.CUT_START.width + this.CUT_START.x - e.clientX
				cutLeft = this.CUT_START.cutLeft - (width - this.CUT_START.width)
				break
			case 2:
				width = this.CUT_START.width + this.CUT_START.x - e.clientX
				cutTop = this.CUT_START.cutTop - (height - this.CUT_START.height)
				cutLeft = this.CUT_START.cutLeft - (width - this.CUT_START.width)
				break
			case 3:
				width = this.CUT_START.width - this.CUT_START.x + e.clientX
				cutTop = this.CUT_START.cutTop - (height - this.CUT_START.height)
				break
			case 4:
				width = this.CUT_START.width - this.CUT_START.x + e.clientX
				break
		}
		if (width < this.state.rectMinSize) {
			width = this.state.rectMinSize
		}
		if (height < this.state.rectMinSize) {
			height = this.state.rectMinSize
		}
	
		let _height = this.state.imageData.displayImage.height - this.state.cutTop
		if (height >= _height) {
			height = _height
		}
		if (height >= this.state.imageData.displayImage.height) {
			height = this.state.imageData.displayImage.height
		}
		let _width = this.state.imageData.displayImage.width - this.state.cutLeft
		if (width >= _width) {
			width = _width
		}

	
		this.setState({
			cutWidth : width,
			cutLeft : cutLeft,
			cutHeight : height,
			cutTop : cutTop
		})
		
	}
	_rectMove (e, index) {
		// 移动题目框
		if(!this.state.mouseIsDown)return
		let nl =e.clientX - (this.state.originalPos.mouseX - this.state.originalItemArea.left) - 0//this.state.imageData.displayImage.left
		let nt =e.clientY - (this.state.originalPos.mouseY - this.state.originalItemArea.top) - 0//parseInt(this.state.imageData.displayImage.top)
		let iw = this.state.imageData.displayImage.width
		let ih = this.state.imageData.displayImage.height
		const rw = this.state.cutWidth
		if (rw >= iw) {
			this.state.cutWidth = iw
			
		}
		const rh = this.state.cutHeight
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

		// this.state.cutLeft = nl
		// this.state.cutTop = nt
		this.setState({
			cutLeft:nl,
			cutTop:nt
		})
	}
	getQnCropUrl () {
		let _width = this.state.cutWidth / this.state.imageData.displayImage.width * this.state.imageData.originWidth
		let _height = this.state.cutHeight / this.state.imageData.displayImage.height * this.state.imageData.originHeight
		let _x = this.state.cutLeft / this.state.imageData.displayImage.width * this.state.imageData.originWidth
		let _y = this.state.cutTop / this.state.imageData.displayImage.height * this.state.imageData.originHeight
		let purl = this.props._currentPicture.partUrl || 'noqniu_img'
		console.log(_height,_height,_x,_y)
		let _str = ''
		if (purl.indexOf('?imageMogr2') === -1) {
			_str = '?imageMogr2'
		}
		if (_x < 0) _x = 0
		if (_y < 0) _y = 0
		return `${purl}${_str}/crop/!${parseInt(_width)}x${parseInt(_height)}a${parseInt(_x)}a${parseInt(_y)}`
	}

	_saveCropItem (callback) {
		if (this.state.cropIndex < 0) return

		this.state.showCropBox = false
		let _x = this.state.cutLeft / this.state.scwidth * 720
		let _y = this.state.cutTop / this.state.scwidth * 720
		let _width = this.state.cutWidth / this.state.scwidth * 720
		let _height = this.state.cutHeight / this.state.scwidth * 720
		let _imgUrl = this.getQnCropUrl()

		let _area = {
			x: parseInt(_x),
			y: parseInt(_y),
			height: parseInt(_height),
			width: parseInt(_width),
			rotate: 0,
			imgUrl: _imgUrl,
			index: 999
		}
		let _index = this.state.cropIndex
		console.log('_index: ', _index);
		this.props._currentPicture.questions[_index].area = _area
		
		this.setState({
			_currentPicture:this.props._currentPicture,
			cropIndex:-1
		})
		console.log('img crop saved', this.state.cropIndex, _imgUrl)
		if (callback) callback()
	}
	needSave () {
		return this.state.cropIndex > -1
	}
	// reset () {
	// 	this.state.cropIndex = -1
	// 	this.showCropBox = false
	// 	this.state.showGifTip = true
	// }
	isCropItem (x, y) {
		let index = -1
		let _dism = this.state.imageData.displayImage
		let _x = x - _dism.left
		let _y = y - _dism.top
		for (let i = 0; i < this.props._currentPicture.questions.length; i++) {
			const ele = this.props._currentPicture.questions[i].area
			let minx = (ele.x) / 720 * this.state.scwidth
			let maxx = (ele.x + ele.width) / 720 * this.state.scwidth

			let miny = (ele.y) / 720 * this.state.scwidth
			let maxy = (ele.y + ele.height) / 720 * this.state.scwidth
			console.log('x >= minx && _x <= maxx && _y >= miny && _y <= maxy',x , minx , _x ,maxx ,_y , miny , _y , maxy)
			if (_x >= minx && _x <= maxx && _y >= miny && _y <= maxy) {
				console.log('this click index', i)
				index = i
			}
		}
		return index
	}
	_cropMaskClick (e) {
		var elm = document.querySelector('.modal9527')
		let _cx=e.clientX-elm.offsetLeft-30
		let _cy=e.clientY-elm.offsetTop-30
		this._saveCropItem()
		if (this.props._currentPicture.questions.length > 0) {
			let _index = this.isCropItem(_cx,_cy)
			console.log('index',_index)
			if (_index > -1) {
				this.showCropBox = false
				this.cropItemClick(_index)
			}
		}
	}
	AddCropData () {
		let cropSize={
			height: 200,
			width: 200
		}
		let iw=this.state.imageData.displayImage.width
		let ih=this.state.imageData.displayImage.height
		if(cropSize.width>iw) cropSize.width=iw
		if(cropSize.height>ih) cropSize.height=ih
		return {
			cx: this.state.imageData.displayImage.width / 2 - cropSize.width / 2,
			cy: this.state.imageData.displayImage.height / 2 - cropSize.height / 2,
			cwidth: cropSize.width,
			cheight: cropSize.height
		}
	}
	checkCanAddCrop (_x, _y, _width, _height) {
		if (this.props._currentPicture.questions.length === 0) return true
		let lastCrop = this.props._currentPicture.questions[this.props._currentPicture.questions.length - 1].area
		if (lastCrop.x === _x && lastCrop.y === _y && lastCrop.width === _width && lastCrop.height === _height) {
			// 应该做循环判定？
			return false
		} else {
			return true
		}
	}
	toShowCropBox (cx, cy, cw, ch) {
		this.setState({
			cutLeft : cx,
			cutTop : cy,
			cutWidth : cw,
			cutHeight : ch,
			showCropBox : true
		})
	}
	newCropItem () {
		// 还有优化空间...
		if (this.state.cropIndex > -1) {
			// 先保存上一个框
			this._saveCropItem()
		}
		const {cx, cy, cwidth, cheight} = this.AddCropData()
		let _x = cx / this.state.scwidth * 720
		let _y = cy / this.state.scwidth * 720
		let _width = cwidth / this.state.scwidth * 720
		let _height = cheight / this.state.scwidth * 720
		if (!this.checkCanAddCrop(_x, _y, _width, _height)) {
			this.toShowCropBox(cx, cy, cwidth, cheight)
			
			this.setState({
				cropIndex : this.props._currentPicture.questions.length - 1
			})
			return
		}
		// 新增一个框
		this.toShowCropBox(cx, cy, cwidth, cheight)

		
		// let _area = {
		// 	x: _x,
		// 	y: _y,
		// 	height: _height,
		// 	width: _width,
		// 	rotate: 0
			
		// }
		// this.props._currentPicture.questions.push({
		// 	area: _area,
		// 	mark: 0,
		// 	num: this.props._currentPicture.questions.length+1,
		// 	pageid: this.props._currentPicture.pageId,
		// 	type: 0,
		// 	selected: true,
		// 	addRect: true,
		// 	_index:99
		// })
		// this.setState({
		// 	cropIndex : this.props._currentPicture.questions.length-1,
		// 	_currentPicture:this.props._currentPicture
		// })
		console.log('new crop', this.state.cutTop, this.state.imageData)
	}
  

	checkCpicture(){
		this.props.confirmPicture(this.props._currentPicture)
		console.log('this.state.workPages: ', this.state.workPages,this.props._currentPicture);
	}
	cancelModel(e){
		this.props.hideModalHander()
	}
	
	rediscover(){
		this.setState({
			imgSpingData:{
				text:'重新识别中...',
				isShow:true
			}
		})
		const {examId,partUrl,remark,partId}=this.props._currentPicture
		this.props.dispatch({
			type:'workManage/doRfreshPart',
			payload:{
				examId,partUrl,remark,partId,index:this.props._currentPicture.index
			}
		}).then(res=>{
			this.setState({
				imgSpingData:{
					text:'识别成功',
					isShow:false
				}
			})
		})
	}
	_confirmArea(_index){
		//重新做排序
		
		this._saveCropItem()

		this.setState({
			imgSpingData:{
				text:'正在处理...',
				isShow:true
			}
		})
		let _area=this.props.state._currentPicture2.questions[_index]
		console.log('_area: ', _area,this.state._currentPicture);
		let _areaData={
			partId:this.props.state._currentPicture2.partId,	
			examId:this.props.state._currentPicture2.examId,
			qusImgUrl:_area.area.imgUrl,	
			pointX:_area.area.x,	
			pointY:_area.area.y,	
			areaWidth:_area.area.width,		
			areaHeight:_area.area.height,	
			num:_area.num,
		}
		console.log('_areaData: ', _areaData);
		// this.setState({
		// 	// _partList:this.state._partList,
		// 	showEditPictureModal:false
		// })
		this.props.dispatch({
			type:'workManage/areaDiscern',
			payload:{
				data:_areaData,
				index:this.props.index
			}
		}).then(res=>{
			this.setState({
				imgSpingData:{
					text:'正在处理...',
					isShow:false
				},
				showCropBox:false,
				cropIndex:-1
			})

		})



		//针对questions做一次新的排序
	}

	getOrderQuestions(_questions){
		function compare (property) {
			return function (a, b) {
				var area0 = a[property]
				var area1 = b[property]
				return SetSortRule(area1,area0)// 从小到大排列， v2 - v1从大到小排列
			}
		}

		function SetSortRule(p1, p2) {
				if (p1.x > p2.x) {
						return false;
				}
				else if (p1.x == p2.x) {
						return (p1.y > p2.y);
				}
				else {
						return false;
				}
		}
		_questions = _questions.sort(compare('area'))
		console.log('新排序_questions: ', _questions);
	}
	getOrderQuestions1(xyArray){
		var i, j, t,
				n = xyArray.length;
		for(i=1; i<n; i++){
				for(j=0; j<n-i; j++){
						if(xyArray[j].area.y == xyArray[j+1].area.y && xyArray[j].area.x > xyArray[j+1].area.x){
								t = xyArray[j].area;
								xyArray[j].area=xyArray[j+1].area;
								xyArray[j+1].area= t;
						}else if(xyArray[j].area.y > xyArray[j+1].area.y){
								t = xyArray[j].area;
								xyArray[j]=xyArray[j+1].area;
								xyArray[j+1]= t;
						}
				}
		}
		console.log('xyArray: ', xyArray);
		return xyArray;
}

	imgLoaded(url, callback) {
		var img = new Image();
		img.src = url;
		if (img.complete) {
		// 如果图片被缓存，则直接返回缓存数据
			// callback(img);
			this.state.imageData.originWidth=img.width
			this.state.imageData.originHeight=img.height
			this.state.imageData.displayImage.height=720/(img.width/img.height)
			this.setState({
				imageData:this.state.imageData
			})
		} else {
			img.onload = function () {
				// callback(img);
				this.state.imageData.originWidth=img.width
				this.state.imageData.originHeight=img.height
				this.state.imageData.displayImage.height=720/(img.width/img.height)
				this.setState({
					imageData:this.state.imageData
				})
			}
		}
	}

	//删除指定题目
	deleteCropQuestion(index){
		let _currentArea=this.props.state._currentPicture2.questions[index]
		if(!_currentArea){
			this.setState({
				showCropBox:false,
				cropIndex:-1
			})
			return 
		}

		this.setState({
			imgSpingData:{
				text:"正在删除",
				isShow:true
			}
		})
		this.props.dispatch({
			type:'workManage/doQuesDelete',
			payload:{
				qusId:this.props.state._currentPicture2.questions[index].qusId,
				partId:this.props.state._currentPicture2.partId
			}
		}).then((res)=>{
			if(res.code===0){
				this.props.dispatch({
					type:'workManage/_currentPicture2',
					payload:res.newPart
				})
				let newPartList=this.props.state.propsWork.partList.splice(this.props.index,1,res.newPart)
				this.props.dispatch({
					type:'workManage/propsWork',
					payload:{
						...this.props.state.propsWork,
						partList:newPartList
					}
				})
				message.destroy()
				message.success('题目删除成功')			
				this.setState({
					showCropBox:false,
					cropIndex:-1
				})
			}

			this.setState({
				imgSpingData:{
					text:"",
					isShow:false
				}
			})
		})
	}

	render() {
		return (
			<Modal
				id="mask9527"
				afterClose={()=>{
					this.setState({
						imgSpingData:{
							text:"",
							isShow:false
						}
					})
				}}
				closable={true} 
				keyboard={false}
				maskClosable={false}
				onCancel={()=>{this.cancelModel()}}
				className="modal9527"
				visible={this.props.visible}
				footer={[
					<div key='1' style={{display:'inline-block',float:'left'}}>
						备注：
						<Input disabled={this.state.imgSpingData.isShow} style={{width:'250px'}} type='text' 
							value={this.props._currentPicture.remark} 			
							onChange={(e)=>{
										this.setState({
											_currentPicture:{
												...this.props._currentPicture,
												remark:e.target.value
											}
										})
								}}
							>
						</Input>
					</div>
						,
					<Button disabled={this.state.imgSpingData.isShow} key='3' onClick={()=>{this.newCropItem()}}>手动框题</Button>
					,
					<Button disabled={this.state.imgSpingData.isShow} key='4'  onClick={()=>{this.rediscover()}}>重新识别</Button>
					,
					<Button disabled={this.state.imgSpingData.isShow} onClick={()=>{this.checkCpicture()}} key='5' type='primary' >
						确定
					</Button>
				]}
			>
				<Spin spinning={this.state.imgSpingData.isShow}
							tip={this.state.imgSpingData.text}
					>
					<div className={style.img_box}>

						<img style={{width:720}} onLoad={(e)=>{
							console.log('111',e)
							this.imgLoaded(this.props._currentPicture.partUrl)
						}}  
						src={this.props._currentPicture.partUrl} alt=""/>
						<div className={style.crop_box} 
						onMouseUp={(e)=>{
							this.setState({mouseIsDown:false,hideBar:false}),
							console.log('mouseup...')
						}}
						
						>
						{
							this.state.showCropBox?
							<div className={style.crop_content} 
								
								onClick={(e)=>{
									console.log('click mask...')
									// this._cropMaskClick(e)
									// this.setState({
									// 	showCropBox:false
									// })
								}}  
								onMouseMove={(e)=>this._handerMove(e)}>
								<div  className={[style.content_top,style.bg_gray].join(' ')} style={{height:this.state.cutTop+'px'}}></div>
								<div   className={style.content_middle} style={{height:this.state.cutHeight+'px'}}>
									<div className={style.content_middle_left} style={{width:this.state.cutLeft+'px'}}></div>
									<div id="rect_item9527" 
										onMouseDown={(e)=>this._rectTouchStart(e)}  
										
										className={style.content_middle_middle} style={{width:this.state.cutWidth+'px',height:this.state.cutHeight+'px'}}>

									<div className={[style.rect_hander,style.rect_hander1].join(' ')} 
										onMouseDown={(e)=>this._handerStart(e,1)} 
										
										>
										<div className={style.rect_hander_border}></div>
									</div>
									<div className={[style.rect_hander,style.rect_hander2].join(' ')} 
										onMouseDown={(e)=>this._handerStart(e,2)}  
										>
										<div className={style.rect_hander_border}></div>
									</div>
									<div className={[style.rect_hander,style.rect_hander3].join(' ')} 
										onMouseDown={(e)=>this._handerStart(e,3)} 
										>
										<div className={style.rect_hander_border}></div>
										</div>
									<div className={[style.rect_hander,style.rect_hander4].join(' ')} 
										onMouseDown={(e)=>this._handerStart(e,4)} 
										>
										<div className={style.rect_hander_border}></div>
									</div>
									{
										!this.state.hideBar?
										<div className={style._confirm_box} 
										
										>
										<Button 
											id='delete_9527' 
											onMouseUp={(e)=>{
												this.deleteCropQuestion(this.state.cropIndex)
												e.stopPropagation()
											}}
										>
										删除
										</Button>
										<Button 
											onMouseUp={(e)=>{
												this.setState({
													showCropBox:false
												})
											}}
										>
										取消
										</Button>
										<Button 
											onMouseUp={(e)=>{
												this._confirmArea(this.state.cropIndex)
												
												e.stopPropagation()
											}}
										>确认</Button>
									</div>:''
									}
		
			
									</div>
									<div className={[style.content_middle_right,style.bg_gray].join(' ')}></div>
								</div>
								<div className={[style.content_bottom,style.bg_gray].join(' ')} ></div>
							</div>
							:
							<div className={style.rect_mask}>
								{
									this.props._currentPicture.questions?this.props._currentPicture.questions.map((item, i) => {
										// {console.log('item',item)}
										return (
											<div className={item.selected?'rect_item_active rect_item':'rect_item'}        
												key={`item.examId${item.partId}${i}`}  
												style={{
														width:item.area.width/720*this.state.scwidth+'px',
														height:item.area.height/720*this.state.scwidth+'px',
														left:item.area.x/720*this.state.scwidth+'px',
														top:item.area.y/720*this.state.scwidth+'px',
														zIndex:item._index||50-i
												}} 
												onClick={(e)=>{this.cropItemClick(i,e)}} 
											
												>
												<Input  key={i} onMouseUp={(e)=>{
													e.stopPropagation()
												}} onClick={(e)=>{
													e.stopPropagation()
												}}  className={style.inputnum} defaultValue={i+1}/>
										</div>
											
											)
										}):''
								}
								
							</div>
						}
						
					
				</div>
					</div>
				</Spin>
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
		...state.workManage
  }
}))(EditPageModal);