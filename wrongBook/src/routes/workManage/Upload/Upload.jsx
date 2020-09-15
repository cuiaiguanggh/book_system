import React from 'react';
import {
  Layout, Modal,Spin , Button, message,DatePicker, Select, Popover, Icon, Checkbox,Empty,Input
} from 'antd';

import { connect } from 'dva';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './Upload.less';
import moment from 'moment';
// import { dataCenter } from '../../../config/dataCenter'
import store from 'store';

import * as XLSX from 'xlsx';
import observer from '../../../utils/observer'
const { RangePicker } = DatePicker;

//作业中心界面内容
const Option = Select.Option;
const { Sider, Content,
} = Layout;

class Upload extends React.Component {
  constructor(props) {
    super(props);
      this.state={
        cpicture:{},
        visible:false,
        scwidth:720,
        cutLeft:0,cutTop:0,cutWidth:100,cutHeight:100,
        showGifTip:false,
        cropIndex:-1
      }
    }

  
    lookPicture(p){
      this.setState({
        cpicture:p,
        visible:true
      })
    }
    handleOk = e => {
      console.log(e);
      this.setState({
        visible: false,
      });
    }

    handleCancel = e => {
      console.log(e);
      this.setState({
        visible: false,
      });
    };
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
  render() {
      return (
      <>
        <div className={style.uploadin}>
          <div className={style.num}>{this.props.index}</div>
          <img onClick={()=>this.lookPicture(this.props.picture)} src={this.props.picture.serUrl} alt=""/>
        </div>
        <Modal
          className="unsetModal"
          visible={this.state.visible}
          footer={[<div style={{display:'inline-block',float:'left'}}>备注：<Input style={{width:'250px'}} type='text'></Input></div>,<Button key='test'>手动框体</Button>,<Button key='test'>重新识别</Button>,<Button type='primary' key='test'>测试</Button>]}
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
          <button className={style.crop_btn,style.noborder} hover-className="crop_btn_hover"   onClick="newCropItem">
            {/* <img src="/static/images/crop_btn_img.png" alt=""/> */}
            框选
          </button>
        </div>
        </div>

        </Modal>
      </>
    )
  }

  componentDidMount() {
    console.log('this.props',this.props)
    this.setState({
      cpicture:this.props.picture
    })
    // this.lookPicture(this.props.picture)
    this.props.dispatch({
      type:'workManage/testPage'
    })
  }

  componentWillUnmount() {
    
  }



}

export default connect((state) => ({
  state: {
    ...state.workManage
  }
}))(Upload);
