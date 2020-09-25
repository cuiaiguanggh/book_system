import React from 'react';
import {
  Button,Input,Modal,Spin
} from 'antd';
import style from './EditPageModal.less';


class EditPageModal extends React.Component {
  constructor(props) {
		super(props);
    	this.state = {
			// cpicture:props.cpicture,
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
					"top": 0
				}
			},
			originalItemArea: {
				left: 0,
				top: 0
			  },
			mouseIsDown:false,
			hideBar:false,
			discovering:true
    }
	}

	cropItemClick (index,e) {
		this.setState({
			cropIndex:index
		})
		console.log('click item', this.props.cpicture.questions[index])
		let area = this.props.cpicture.questions[index].area
		this.toShowCropBox(area.x / 720 * this.state.scwidth, area.y / 720 * this.state.scwidth, area.width / 720 * this.state.scwidth, area.height / 720 * this.state.scwidth)
		// this.props.cpicture.questions[index]['selected']=!this.props.cpicture.questions[index]['selected']
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
		let _width = this.state.cutWidth / this.state.imageData.displayImage.width * this.props.cpicture.width
		let _height = this.state.cutHeight / this.state.imageData.displayImage.height * this.props.cpicture.height
		let _x = this.state.cutLeft / this.state.imageData.displayImage.width * this.props.cpicture.width
		let _y = this.state.cutTop / this.state.imageData.displayImage.height * this.props.cpicture.height
		let purl = this.props.cpicture.serUrl || 'noqniu_img'
		let _str = ''
		if (purl.indexOf('?imageMogr2') === -1) {
			_str = '?imageMogr2'
		}
		if (_x < 0) _x = 0
		if (_y < 0) _y = 0
		return `${purl}${_str}/crop/!${_width.toFixed(2)}x${_height.toFixed(2)}a${_x.toFixed(2)}a${_y.toFixed(2)}`
	}
	_deleteCropItem () {
		if (this.props.cpicture.questions[this.state.cropIndex].addRect) {
			this.props.cpicture.questions.splice(this.state.cropIndex, 1)
			// 新增题目支持删除
		} else {
			this.props.cpicture.questions[this.state.cropIndex].selected = false
		}

		this.setState({
			showCropBox:false,
			cropIndex:-1,
			showCropBox:false
		})
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
			x: _x,
			y: _y,
			height: _height,
			width: _width,
			rotate: 0,
			imgUrl: _imgUrl,
			index: 999
		}
		let _index = this.state.cropIndex
		this.props.cpicture.questions[_index].area = _area
		
		this.setState({
			cpicture:this.props.cpicture,
			cropIndex:-1
		})
		console.log('img crop saved', this.state.cropIndex, _imgUrl)
		if (callback) callback()
	}
	needSave () {
		return this.state.cropIndex > -1
	}
	reset () {
		this.state.cropIndex = -1
		this.showCropBox = false
		this.state.showGifTip = true
	}
	isCropItem (x, y) {
		let index = -1
		let _dism = this.state.imageData.displayImage
		let _x = x - _dism.left
		let _y = y - _dism.top
		for (let i = 0; i < this.props.cpicture.questions.length; i++) {
			const ele = this.props.cpicture.questions[i].area
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
		//return
		
		var elm = document.querySelector('.modal9527')
		let _cx=e.clientX-elm.offsetLeft-30
		let _cy=e.clientY-elm.offsetTop-30
		// let _clickY
		console.log('click',_cx,_cy)
		// return
		this._saveCropItem()
		if (this.props.cpicture.questions.length > 0) {
			let _index = this.isCropItem(_cx,_cy)
			console.log('index',_index)
			if (_index > -1) {
				this.showCropBox = false
				this.cropItemClick(_index)
			}
		}
		// e.stopPropagation()
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
		if (this.props.cpicture.questions.length === 0) return true
		let lastCrop = this.props.cpicture.questions[this.props.cpicture.questions.length - 1].area
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
				cropIndex : this.props.cpicture.questions.length - 1
			})
			return
		}
		// 新增一个框
		this.toShowCropBox(cx, cy, cwidth, cheight)

		
		let _area = {
			x: _x,
			y: _y,
			height: _height,
			width: _width,
			rotate: 0
			
		}
		this.props.cpicture.questions.push({
			area: _area,
			mark: 0,
			num: this.props.cpicture.questions.length,
			pageid: this.props.cpicture.pageId,
			type: 0,
			selected: true,
			addRect: true,
			_index:99
		})
		this.setState({
			cropIndex : this.props.cpicture.questions.length-1,
			cpicture:this.props.cpicture
		})
		console.log('new crop', this.state.cutTop, this.state.imageData)
	}
  

	checkCpicture(){
		// if(this.state.cpindex>=0){

		// 	this.state.workPages.splice(this.state.cpindex,1,this.props.cpicture)
		// }

		this.setState({
			workPages:this.state.workPages
		})
		this.props.confirmPicture(this.props.cpicture)
		console.log('this.state.workPages: ', this.state.workPages,this.props.cpicture);
	}
	cancelModel(e){
		this.props.hideModalHander()
	}
	
	rediscover(){
		console.log('开始重新识别...')
		this.setState({
			discovering:true
		})
	}
	_confirmArea(_index){
		//重新做排序
		
		this._saveCropItem()
		let _cropArea=this.props.cpicture.questions[_index]
		console.log('_cropArea: ', _cropArea);
		// console.log('this.state.cpicture.questions: ', this.props.cpicture.questions);
		// this.props._confirmAreaHander(_index)
		// let _questions=this.props.cpicture.questions
		// this.getOrderQuestions(_questions)


		//针对questions做一次新的排序
		// let _areaReqData={
		// 	partId:_cropArea.pageid,//分片id
		// 	examId:10,//	int
		// 	qusImgUrl:_cropArea.area.imgUrl,
		// 	x:	_cropArea.area.x,
		// 	y	:_cropArea.area.y,
		// 	width:_cropArea.area.width,
		// 	height:_cropArea.area.height,
		// 	num:_cropArea.num
		// }
		// console.log('_cropArea: ', _cropArea,_areaReqData);
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

	render() {
		return (
			<Modal
				id="mask9527"
				closable={true} 
				keyboard={false}
				maskClosable={false}
				onCancel={()=>{this.cancelModel()}}
				className="modal9527"
				visible={this.props.visible}
				footer={[
					<div key='1' style={{display:'inline-block',float:'left'}}>
						备注：
						<Input key='2' style={{width:'250px'}} type='text' 
							value={this.props.cpicture.remark} 			
							onChange={(e)=>{
										this.setState({
											cpicture:{
												...this.props.cpicture,
												remark:e.target.value
											}
										})
								}}
							>
						</Input>
					</div>
						,
					<Button key='3' onClick={()=>{this.newCropItem()}}>手动框题</Button>
					,
					<Button key='4'  onClick={()=>{this.rediscover()}}>重新识别</Button>
					,
					<Button onClick={()=>{this.checkCpicture()}} key='5' type='primary' >
						确定
					</Button>
				]}
			>
				<Spin spinning={false&&this.state.discovering}>
					<div className={style.img_box}>

						<img style={{width:720}}  src={this.props.cpicture.url} alt=""/>
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
												this._deleteCropItem()
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
									this.props.cpicture.questions?this.props.cpicture.questions.map((item, i) => {
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

export default EditPageModal
