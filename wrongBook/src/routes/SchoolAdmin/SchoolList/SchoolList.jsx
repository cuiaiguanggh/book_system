import React from 'react';
import { Layout, Table, Input,Select,Modal,Radio,Button,Pagination,Popover  } from 'antd';
import { routerRedux,  } from "dva/router";
import { connect } from 'dva';
import store from 'store';
import QRCode from 'qrcode.react';
import style from './SchoolList.less';
// import store from 'store';
const { Content } = Layout;
const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
const { TextArea } = Input;
//作业中心界面内容
class HomeworkCenter extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			editingKey: '',
			current:'student',
			visible1: false,
			visible:false,
			visible2:false,
			visible3:false,
			phaseId:1,
			schoolId:'',
			provincesId:'',
			cityId:'',
			areasId:'',
			provinces:'',
			city:'',
			areas:'',
			qrcode:'',
			SearchValue:'',
		};
	}
	handleOk = (e) => {
		this.setState({
		  visible1: false,
		  visible: false,
		});
		this.props.dispatch({
			type: 'homePage/changeSchool',
			payload:this.state.schoolId
		});
	}
	  handleCancel = (e) => {
		this.setState({
		  visible1: false,
		  visible: false,
		});
	  }
	
	  provinces(){
		let data = this.props.state.city;
		if(data.data){
		  let provinces = data.data.administrativeDivision.provinces;
		  return(
			provinces.map((item,i) =>(
			  <Option key={i} value={item.code}>{item.name}</Option>
			))
		  )
		}
		
	  }
	  city(){
		let data = this.props.state.city;
		if(data.data){
		  let cities = data.data.administrativeDivision.cities;
		  if(this.state.provincesId != ''){
			return(
			  cities.map((item,i) =>{
				if(item.provinceCode == this.state.provincesId){
				  return (
					<Option key={i} value={item.code}>{item.name}</Option>
				  )}  
				}
				
			  )
			)
		  }
		  
		}
		
	  }
	  areas(){
		let data = this.props.state.city;
		if(data.data){
		  let areas = data.data.administrativeDivision.areas;
		  if(this.state.cityId != ""){
			return (
			  areas.map((item,i) =>{
				if(item.cityCode == this.state.cityId){
				  return (
					<Option key={i} value={item.code}>{item.name}</Option>
				  )
				}
			  })
			)
		  }
		}
		
	  }
	  
	render() {
		let dispatch = this.props.dispatch;
		let state = this.props.state;
		const columns = [{
		title: '学校名称',
			dataIndex: 'name',
			key: 'name',
			width: '25%',
			render: (text, record) => (
				<div
					onClick={() =>{
					}}>
					{text}
				</div>
			)
		},
		{
			title: '位置',
			dataIndex: 'position',
			key: 'position',
			width: '15%',
			render: (text, record) => (
				<div
					onClick={() =>{
						// dispatch(
						// 	routerRedux.push({
						// 		pathname: '/homeworkDetails',
						// 		hash:`${record.key}`
						// 		})
						// )
					}}>
					{text}
				</div>
			)
		},
		{
			title: '类型',
			dataIndex: 'type',
			key: 'type',
			width: '10%',
			render: (text, record) => (
				<div
					onClick={() =>{
						// dispatch(
						// 	routerRedux.push({
						// 		pathname: '/homeworkDetails',
						// 		hash:`${record.key}`
						// 		})
						// )
					}}>
					{text}
				</div>
			)
		},
		{
			title: '校长',
			dataIndex: 'principal',
			key: 'principal',
			width: '10%',
			render: (text, record) => (
				<div 
					onClick={() =>{
						// dispatch(
						// 	routerRedux.push({
						// 		pathname: '/homeworkDetails',
						// 		hash:`${record.key}`
						// 		})
						// )
					}}>
					{text}
				</div>
			)
		},
		{
			title: '介绍',
			dataIndex: 'introduce',
			key: 'introduce',
			width: '10%',
			render: (text, record) => (
				<div style={{cursor:'pointer'}} onClick={()=>{
					let data = text;
					if(data === ''){
						data = '暂无信息'
					}
					this.setState({visible2:true,text:data})
				}}>
					详情
				</div>
			)
		},
		{
		title: '操作',
		width: '15%',
			dataIndex: 'operate',
			key: 'operate',
			render: (text, record) => {
				
				return (
					<div className="operateLink">
							<span style={{color:'#1890ff',cursor:'pointer',margin:'0 10px'}}
								onClick={()=>{
									let value = `http://hw-test.mizholdings.com/static/sc?schoolId=${record.key}&year=2018`
									this.setState({visible3:true,qrcode:value})
								}}
							>
								二维码</span>
							
						<span
						style={{color:'#1890ff',cursor:'pointer',margin:'0 10px'}}
						onClick={()=>{
							
							let data = {
								schoolId:record.key
							}
							this.setState({visible:true,schoolId:record.key})
							this.props.dispatch({
								type: 'homePage/schoolInfo',
								payload:data
							});
							this.props.dispatch({
								type:'homePage/schoolNews',
								payload:''
							})
						}
						}>编辑</span>
						<span
						style={{cursor:'pointer',margin:'0 10px',color:'#1890ff'}}
						onClick={()=>{
							let This = this;
							confirm({
								title: '确定删除此学校么?',
								okText: '是',
								cancelText: '否',
								onOk() {
									let data = {
										schoolId:record.key
									}
									This.props.dispatch({
										type: 'homePage/deleteSchool',
										payload:data
									});
								},
								onCancel() {
									console.log('Cancel');
								},
							});
						}}
						>删除</span>
					</div>
				)
			}
		}];
		let schoolList = state.schoolList;
		const dataSource = [];
		let total = 0;
		if(schoolList.data ){
			total = schoolList.data.total
			for(let i = 0;i < schoolList.data.list.length; i ++){
				let p = {};
				let det = schoolList.data.list[i];
				p["key"] = det.schoolId;
				p["name"] = det.schoolName;
				p["position"] = det.address;
				p["type"] = det.phaseName;
				p["principal"] = det.masterName;
				p["introduce"] = det.des;
				dataSource[i]=p;
			}
		}
		let schoolInfo = this.props.state.schoolInfo;
		const hash = this.props.location.hash;
		let cur = hash.substr(hash.indexOf("page=")+5)*1;
		return(
			<Layout >
				<Content style={{ overflow: 'initial' }}>
					<div className={style.layout} style={{ padding: 24, background: '#fff' }}>
						<div style={{overflow:'hidden',marginBottom:"5px",textAlign:'right'}}>
							<div style={{float:'left'}}> 
								<Select
									showSearch
									style={{ width:120,marginRight:10 }}
									placeholder="省"
									optionFilterProp="children"
									onChange={(value,e) =>{
									
									this.setState({provincesId:value,provinces:e.props.children,areas:'',city:''})
									let data = {
										province:e.props.children,
										page:1,
										pageSize:10,
									}
									if(this.state.SearchValue !== ''){
										data.schoolName = this.state.SearchValue
									}
									dispatch({
										type: 'homePage/pageRelevantSchool',
										payload:data
									});
									}}
									filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
								{this.provinces()}
								</Select>
								<Select
									showSearch
									style={{ width:120 ,marginRight:10}}
									placeholder="市"
									optionFilterProp="children"
									onChange={(value,e) =>{
									this.setState({cityId:value,city:e.props.children});
									let data = {
										province:this.state.provinces,
										city:e.props.children,
										page:1,
										pageSize:10
									}
									if(this.state.SearchValue !== ''){
										data.schoolName = this.state.SearchValue
									}
									dispatch({
										type: 'homePage/pageRelevantSchool',
										payload:data
									});
									}}
									filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
								{this.city()}
								</Select>
								<Select
									showSearch
									style={{ width:120,marginRight:10 }}
									placeholder="区"
									optionFilterProp="children"
									// value={this.state}
									onChange={(value,e)=>{
									  this.setState({areasId:value,areas:e.props.children})
									  let data = {
									    province:this.state.provinces,
									    city:this.state.city,
									    areas:e.props.children,
									    page:1,
									    pageSize:10
									  }
									  if(this.state.SearchValue !== ''){
										  data.schoolName = this.state.SearchValue
									  }
									  dispatch({
										  type: 'homePage/pageRelevantSchool',
										  payload:data
									  });
									}}
									filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
								{this.areas()}
								</Select>
								<Select
									showSearch
									style={{ width:120 }}
									placeholder="类型"
									optionFilterProp="children"
									// value={this.state}
									onChange={(value,e)=>{
										let data = {
											page:1,
											pageSize:10
										}
										if(this.state.SearchValue !== ''){
											data.schoolName = this.state.SearchValue
										}
										if(this.state.provinces !== ''){
											data.province = this.state.provinces
											if(this.state.citys !== ''){
												data.city = this.state.citys
												if(this.state.areas !== ''){
													data.area = this.state.areas
												}
											}
										}
										dispatch({
											type: 'homePage/pageRelevantSchool',
											payload:data
										});
									}}
									filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									<Option key={1} value={1}>小学</Option>
									<Option key={2} value={2}>初中</Option>
									<Option key={3} value={3}>高中</Option>
								</Select>
							</div>
							<Search
								placeholder="学校名称"
								style={{width:'300px'}}
								enterButton="搜索"
								onChange={(e)=>{
									this.setState({SearchValue:e.target.value})
								}}
								onSearch={value => {
									let data ={
										pageNum:1,
										pageSize:10,
										schoolName:value
									}
									if(this.state.provinces !== ''){
										data.province = this.state.provinces
										if(this.state.citys !== ''){
											data.city = this.state.citys
											if(this.state.areas !== ''){
												data.area = this.state.areas
											}
										}
									}
									dispatch({
										type: 'homePage/pageRelevantSchool',
										payload:data
									});
									routerRedux.push({
										pathname: '/school',
										hash:'page=1'
									})
								}}
							/>
							<Button 
								style={{verticalAlign:'bottom',marginLeft:'10px'}}
								onClick={()=>{
									this.setState({
										visible1:true
									})
								}}
								type="primary">添加
							</Button>
						</div>
						<Table className={style.scoreDetTable}
						 dataSource={dataSource}
						 columns={columns}
						 pagination={true}
						 bordered={true}
						 rowKey={(record, index)=> index}/>
						 {
							 total>1?
							 <Pagination defaultCurrent={cur} 
							 	onChange={(pageNumber)=>{
									this.props.dispatch(
										routerRedux.push({
											pathname: '/school',
											hash:`page=${pageNumber}`
											})
									)
									let data ={
										pageNum:pageNumber,
										pageSize:10
									}
									dispatch({
										type: 'homePage/pageRelevantSchool',
										payload:data
									});
								 }}
							 	pageSize={10} defaultPageSize={10}  total={total} />:
							 ''
						}
					</div>
					<Modal
						title="编辑"
						visible={this.state.visible}
						onOk={this.handleOk}
						onCancel={this.handleCancel}
						okText='确定'
						cancelText='取消'
						>
						{
							schoolInfo.data ?
							<div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}} >地区</span>
									<Select
										showSearch
										style={{ width:100,marginRight:10 }}
										placeholder="省"
										optionFilterProp="children"
										defaultValue={schoolInfo.data.province}
										onChange={(value,e) =>{
										this.setState({provincesId:value,provinces:e.props.children,areas:'',city:''})
											this.props.dispatch({
												type: 'homePage/provinces',
												payload:e.props.children
											});
											
										}}
										filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									>
									{this.provinces()}
									</Select>
									<Select
										showSearch
										style={{ width:100 ,marginRight:10}}
										placeholder="市"
										defaultValue={schoolInfo.data.city}
										optionFilterProp="children"
										onChange={(value,e) =>{
											this.setState({cityId:value,city:e.props.children});
											this.props.dispatch({
												type: 'homePage/citys',
												payload:e.props.children
											});
										}}
										filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									>
									{this.city()}
									</Select>
									<Select
										showSearch
										style={{ width:100,marginRight:10 }}
										defaultValue={schoolInfo.data.area}
										placeholder="区"
										optionFilterProp="children"
										onChange={(value,e)=>{
										  this.setState({areasId:value,areas:e.props.children})
										  this.props.dispatch({
											type: 'homePage/areas',
											payload:e.props.children
										});
										}}
										filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									>
									{this.areas()}
									</Select>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}} >学校</span>
									<Input 
										defaultValue={this.props.state.schoolName}
										onChange={(e)=>{
											this.props.dispatch({
												type: 'homePage/changeSchoolName',
												payload:e.target.value
											});
										}}
									 style={{width:'200px'}}/>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>类型</span>
									<RadioGroup onChange={(e)=>{
										this.props.dispatch({
											type: 'homePage/changephaseId',
											payload:e.target.value
										});
									}}
									 value={this.props.state.phaseId}>
										<Radio value={1}>小学</Radio>
										<Radio value={2}>初中</Radio>
										<Radio value={3}>高中</Radio>
									</RadioGroup>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>校长</span>
									<Input defaultValue={schoolInfo.data.masterName}
										onChange={(e)=>{
											this.props.dispatch({
												type: 'homePage/changeMasterName',
												payload:e.target.value
											});
										}}  style={{width:'200px'}}/>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>位置</span>
									<Input defaultValue={schoolInfo.data.address} 
									onChange={(e)=>{
										this.props.dispatch({
											type: 'homePage/changeaddress',
											payload:e.target.value
										});
									}} style={{width:'200px'}}/>
								</div>
								<div>
									<span style={{width:"80px",display:'inline-block',verticalAlign: 'top'}}>介绍</span>
									<TextArea defaultValue={schoolInfo.data.des} 
									onChange={(e)=>{
										this.props.dispatch({
											type: 'homePage/changedes',
											payload:e.target.value
										});
									}} style={{width:'200px'}}/>
								</div>
							</div>
							:
							<div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}} >学校</span>
									<Input style={{width:'200px'}}/>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>类型</span>
									<RadioGroup onChange={this.onChange} value='1'>
										<Radio value={1}>小学</Radio>
										<Radio value={2}>初中</Radio>
										<Radio value={3}>高中</Radio>
									</RadioGroup>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>校长</span>
									<Input style={{width:'200px'}}/>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>位置</span>
									<Input style={{width:'200px'}}/>
								</div>
								<div>
									<span style={{width:"80px",display:'inline-block',verticalAlign: 'top'}}>介绍</span>
									<TextArea  style={{width:'200px'}}/>
								</div>
							</div>
						}
							
					</Modal>
					<Modal
						title="添加学校"
						visible={this.state.visible1}
						onOk={()=>{
							this.setState({visible1:false})
							this.props.dispatch({
								type: 'homePage/addSchool',
							});
						}}
						onCancel={this.handleCancel}
						okText='确定'
						cancelText='取消'
						>
							<div>
							<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}} >地区</span>
									<Select
										showSearch
										style={{ width:100,marginRight:10 }}
										placeholder="省"
										optionFilterProp="children"
										onChange={(value,e) =>{
										this.setState({provincesId:value,provinces:e.props.children,areas:'',city:''})
											this.props.dispatch({
												type: 'homePage/provinces',
												payload:e.props.children
											});
										}}
										filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									>
									{this.provinces()}
									</Select>
									<Select
										showSearch
										style={{ width:100 ,marginRight:10}}
										placeholder="市"
										optionFilterProp="children"
										onChange={(value,e) =>{
											this.setState({cityId:value,city:e.props.children});
												
											this.props.dispatch({
												type: 'homePage/citys',
												payload:e.props.children
											});
										}}
										filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									>
									{this.city()}
									</Select>
									<Select
										showSearch
										style={{ width:100,marginRight:10 }}
										placeholder="区"
										optionFilterProp="children"
										onChange={(value,e)=>{
										  this.setState({areasId:value,areas:e.props.children})
										  this.props.dispatch({
											type: 'homePage/areas',
											payload:e.props.children
										});
										}}
										filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									>
									{this.areas()}
									</Select>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}} >学校</span>
									<Input 
										defaultValue={this.props.state.schoolName}
										onChange={(e)=>{
											this.props.dispatch({
												type: 'homePage/changeSchoolName',
												payload:e.target.value
											});
										}}
									 style={{width:'200px'}}/>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>类型</span>
									<RadioGroup onChange={(e)=>{
										this.props.dispatch({
											type: 'homePage/changephaseId',
											payload:e.target.value
										});
									}}
									 value={this.props.state.phaseId}>
										<Radio value={1}>小学</Radio>
										<Radio value={2}>初中</Radio>
										<Radio value={3}>高中</Radio>
									</RadioGroup>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>校管理员</span>
									<Input defaultValue={this.props.state.masterName}
										onChange={(e)=>{
											this.props.dispatch({
												type: 'homePage/changeMasterName',
												payload:e.target.value
											});
										}}  style={{width:'200px'}}/>
								</div>
								
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>手机号</span>
									<Input defaultValue={this.props.state.masterPhone}
										onChange={(e)=>{
											this.props.dispatch({
												type: 'homePage/changeMasterPhone',
												payload:e.target.value
											});
										}}  style={{width:'200px'}}/>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>位置</span>
									<Input defaultValue={this.props.state.address} 
									onChange={(e)=>{
										this.props.dispatch({
											type: 'homePage/changeaddress',
											payload:e.target.value
										});
									}} style={{width:'200px'}}/>
								</div>
								<div>
									<span style={{width:"80px",display:'inline-block',verticalAlign: 'top'}}>介绍</span>
									<TextArea defaultValue={this.props.state.des} 
									onChange={(e)=>{
										this.props.dispatch({
											type: 'homePage/changedes',
											payload:e.target.value
										});
									}} style={{width:'200px'}}/>
								</div>
							</div>
					</Modal>
					<Modal
						title="学校详情"
						visible={this.state.visible2}
						onOk={()=>{
							this.setState({visible2:false})
						}}
						onCancel={()=>{
							this.setState({visible2:false})
						}}
						okText='确定'
						cancelText='取消'
						>
							<div>{this.state.text}</div>
					</Modal>
					<Modal
						title="学校详情"
						visible={this.state.visible3}
						onOk={()=>{
							this.setState({visible3:false})
						}}
						onCancel={()=>{
							this.setState({visible3:false})
						}}
						width='300px'
						okText='确定'
						cancelText='取消'
						>
							<div style={{padding:'10px',textAlign:'center'}}>
								<QRCode className='qrcode' value={this.state.qrcode} />
							</div>
					</Modal>
				</Content>
			</Layout>
		);
	}
	componentDidMount(){
		const {dispatch} = this.props;
		const hash = this.props.location.hash;
		let page = hash.substr(hash.indexOf("page=")+5)*1;
		if(page === 0){
			page = 1
		}
		let data ={
			pageNum:page,
			pageSize:10
		}
		dispatch({
			type: 'homePage/pageRelevantSchool',
			payload:data
		});
		dispatch({
			type: 'homePage/administrativeDivision',
		});
	}
}

export default connect((state) => ({
	state: {
		...state.homePage,
	}
}))(HomeworkCenter);