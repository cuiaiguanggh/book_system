import React from 'react';
import {
  Button,Input,Modal
} from 'antd';
import style from './EditPageModal.less';


class EditPageModal extends React.Component {
  constructor(props) {
		super(props);
		this.showCropModel=this.showCropModel.bind(this);
    	this.state = {

			showModal:false,
			cpicture:{},
			visible:false,
			scwidth:720,
			cutLeft:0,cutTop:0,cutWidth:100,cutHeight:100,
			originalPos:{
				mouseX:0,
				mouseY:0
			},
			rectMinSize:10,
			cropIndex:-1,
			cpindex:0,
			
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
			disabledMove:false
    }
	}

	cropItemClick (index,e) {
		this.setState({
			cropIndex:index
		})
		console.log('click item', this.state.cpicture.areas[index])
		let area = this.state.cpicture.areas[index].area
		this.toShowCropBox(area.x / 720 * this.state.scwidth, area.y / 720 * this.state.scwidth, area.width / 720 * this.state.scwidth, area.height / 720 * this.state.scwidth)

		// this.state.cpicture.areas[index]['selected']=!this.state.cpicture.areas[index]['selected']
		console.log('this.state.cpicture: ', this.state.cpicture);
		// e.stopPropagation()
	}
	_handerStart (e, id) {
		this.setState({
			mouseIsDown:true
		})
        console.log("EditPageModal -> _handerStart -> e, id", e, id)
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
		//let _this = this
		// var query = wx.createSelectorQuery()
		// query.select('#rect_item9527').boundingClientRect()
		// query.exec(function (res) {
		//   console.log(e)
		//   _this.state.originalItemArea.left = res[0].left
		//   _this.state.originalItemArea.top = res[0].top
		// })
	}
	_handerMove (e, n) {
		this.setState({
			disabledMove:true
		})
		
		if(!this.state.mouseIsDown)return 
		if(this.CUT_START.corner===0){
			return this._rectMove(e)
		}
        console.log("EditPageModal -> _handerMove -> e, n", e, n)
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
		console.log(height , _height,this.CUT_START.corner)
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
		let _width = this.state.cutWidth / this.state.imageData.displayImage.width * this.state.cpicture.width
		let _height = this.state.cutHeight / this.state.imageData.displayImage.height * this.state.cpicture.height
		let _x = this.state.cutLeft / this.state.imageData.displayImage.width * this.state.cpicture.width
		let _y = this.state.cutTop / this.state.imageData.displayImage.height * this.state.cpicture.height
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
		console.log("EditPageModal -> _deleteCropItem -> this.state.cropIndex", this.state.cropIndex,this.state.cpicture.areas)
		if (this.state.cpicture.areas[this.state.cropIndex].addRect) {
			this.state.cpicture.areas.splice(this.state.cropIndex, 1)
			// 新增题目支持删除
		} else {
			this.state.cpicture.areas[this.state.cropIndex].selected = false
		}


		this.state.cropIndex = -1
		this.setState({
			showCropBox:false,
			cropIndex:-1,
			showCropBox:false
		})
	}
	saveCropItem (callback) {
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

        console.log("EditPageModal -> saveCropItem -> this.state.cpicture", this.state.cpicture,this.state.cropIndex)
		let _index = this.state.cropIndex
		this.state.cpicture.areas[_index].area = _area
		
		this.setState({
			cpicture:this.state.cpicture,
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
		console.log("EditPageModal -> _cropMaskClick -> e", e.clientY)
		//return
		this.saveCropItem()
		if (this.state.cpicture.areas.length > 0) {
			let _index = this.isCropItem(e.clientX, e.clientY)
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
			this.saveCropItem()
		}
		const {cx, cy, cwidth, cheight} = this.AddCropData()
		let _x = cx / this.state.scwidth * 720
		let _y = cy / this.state.scwidth * 720
		let _width = cwidth / this.state.scwidth * 720
		let _height = cheight / this.state.scwidth * 720
		if (!this.checkCanAddCrop(_x, _y, _width, _height)) {
			this.toShowCropBox(cx, cy, cwidth, cheight)
			
			this.setState({
				cropIndex : this.state.cpicture.areas.length - 1
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
		this.state.cpicture.areas.push({
			area: _area,
			mark: 0,
			num: this.state.cpicture.areas.length,
			pageid: this.state.cpicture.pageId,
			type: 0,
			selected: true,
			addRect: true
		})
		this.setState({
			cropIndex : this.state.cpicture.areas.length-1,
			cpicture:this.state.cpicture
		})
		console.log('new crop', this.state.cutTop, this.state.imageData)
	}
  




	showCropModel(p,i){
		console.log('p: ', p);
		this.setState({
			showModal:true,
			cpicture:p,
			cpindex:i,
			pageMarks:''
		})
	}
	checkCpicture(){
		let _pic=this.state.workPages[this.state.cpindex]
		this.state.workPages.splice(this.state.cpindex,1,this.state.cpicture)
		this.setState({
			showModal:false,
			workPages:this.state.workPages
		})
		console.log('this.state.cpindex,1,this.state.cpicture: ', this.state.cpindex,1,this.state.cpicture);
		console.log('this.state.workPages: ', this.state.workPages,this.state.cpicture);
	}
	cancelModel(e){
		// this.state.workPages.splice(this.state.cpindex,1,this.state.cpicture)
		// this.state.cpicture.marks=''
		// this.setState({
		// 	cpicture:this.state.cpicture,
		// 	workPages:this.state.workPages,
		// 	showModal:false
		// })
		// console.log('e: ', e,this.state.cpicture,this.state.workPages);
	}
	


  	render() {
		return (
			<Modal
				closable={false} 
				onCancel={()=>{this.cancelModel()}}
				className="unsetModal"
				visible={this.props.visible}
				footer={[
					<div key='1' style={{display:'inline-block',float:'left'}}>
						备注：
						<Input key='2' style={{width:'250px'}} type='text' 
							value={this.state.cpicture.marks} 			
							onChange={(e)=>{
										this.setState({
											cpicture:{
												...this.state.cpicture,
												marks:e.target.value
											}
										})
								}}
							>
						</Input>
					</div>
						,
					<Button key='3' onClick={()=>{this.newCropItem()}}>手动框题</Button>
					,
					<Button key='4'>重新识别</Button>
					,
					<Button onClick={()=>{this.checkCpicture()}} key='5' type='primary' >
						确定
					</Button>
				]}
			>
				<div className={style.img_box}>

				<img style={{width:720}}  src={this.state.cpicture.serUrl} alt=""/>
				<div className={style.crop_box} onMouseUp={(e)=>{
					this.setState({mouseIsDown:false,disabledMove:false}),
					console.log('mouseup...')
					this._cropMaskClick(e)
					}}>
					{
						this.state.showCropBox?
						<div className={style.crop_content}   
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
								<div className={style.rect_hander_delete} id='delete_9527' 
									onClick={()=>{this._deleteCropItem()}}>
									<div className={[style.iconfont,style.icon_cuohao].join(' ')}></div>
								</div>
								</div>
								<div className={[style.content_middle_right,style.bg_gray].join(' ')}></div>
							</div>
							<div className={[style.content_bottom,style.bg_gray].join(' ')} ></div>
						</div>
						:
						<div className={style.rect_mask}>
							{
								this.state.cpicture.areas?this.state.cpicture.areas.map((item, i) => {
									return (
										<div className={item.selected?'rect_item_active rect_item':'rect_item'}        
											key={item.num}  
											style={{
													width:item.area.width/720*this.state.scwidth+'px',
													height:item.area.height/720*this.state.scwidth+'px',
													left:item.area.x/720*this.state.scwidth+'px',
													top:item.area.y/720*this.state.scwidth+'px',
													zIndex:50-i,
											}} 
											onClick={(e)=>{this.cropItemClick(i,e)}} 
										
											>
											<Input  key={i}   className={style.inputnum} defaultValue={i+1}/>
									</div>
										
										)
									}):''
							}
							
						</div>
					}
					
				
			</div>
			</div>

			</Modal>
		)
  }

  componentDidMount() {
	setTimeout(() => {
		this.setState({
			cpicture:this.props.cpicture
		})
		console.log("EditPageModal cpicture", this.state.cpicture)
	}, 500);

  }

  componentWillUnmount() {
    
  }



}

export default EditPageModal
