import React from 'react';
import { Layout,Menu, Table, Input,message, Modal, InputNumber, Select, Form,
} from 'antd';
// import { routerRedux, Link } from "dva/router";
import { connect } from 'dva';
import style from './classAdmin.less';
import store from 'store';
// import * as XLSX from 'xlsx';
const confirm = Modal.confirm;
const { Content } = Layout;
const Search = Input.Search;
const FormItem = Form.Item;
const EditableContext = React.createContext();
const Option = Select.Option;
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);


const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };
  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}


//作业中心界面内容
class HomeworkCenter extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = { 
			 editingKey: '',
			 current:'teacher',
			 visible:false,
			 teacher:'',
			 phone:'',
			 sub:0,
			};
		this.tea = [{
			title: '姓名',
			dataIndex: 'name',
			key: 'name',
			editable: true,
			render: (text, record) => (
				<div
				className='space'
					onClick={() =>{
					}}>
					{text}
				</div>
			)
		},
		{
			title:'手机号',
			dataIndex:'phone',
			key:'phone',
			editable: true,
			render: (text, record) => (
				<div
				className='space'
					onClick={() =>{
					}}>
					{text}
				</div>
			)
		},
		{
			title:'学科',
			dataIndex:'subJec',
			key:'subJec',
			editable: true,
			render: (text, record) => (
				<div
				className='space'
					onClick={() =>{
					}}>
					{text}
				</div>
			)
		},
		{
			title:'错题量',
			dataIndex:'wrongNum',
			key:'wrongNum',
			editable: true,
			render: (text, record) => (
				<div
				className='space'
					onClick={() =>{
					}}>
					{text}
				</div>
			)
		},
	];
		
		this.stu = [{
			title: '姓名',
			dataIndex: 'name',
			key: 'name',
			editable: true,
			render: (text, record) => (
				<div
				className='space'
					onClick={() =>{
					}}>
					{text}
				</div>
			)
		},
		{
			title:'错题量',
			dataIndex:'wrongNum',
			key:'wrongNum',
			editable: false,
			render: (text, record) => (
				<div
				className='space'
					onClick={() =>{
					}}>
					{text}
				</div>
			)
		},
		];
		
		if(store.get('wrongBookNews').rodeType === 10){
			this.tea.push(
				{
					title:'编辑',
					render: (text, record) => (
						<div
							style={{color:'#1890ff',cursor:'pointer'}}
							onClick={() =>{
								let This = this;
								confirm({
									title: '确定要删除'+record.name+'教师么',
									onOk() {
										This.props.dispatch({
											type: 'homePage/kickClass',
											payload:{
												userId:record.key,
											}
										});
									},
									onCancel() {
										console.log('Cancel');
									},
								});
							}}>
							删除
						</div>
					)
				}
			)
			
			this.stu.push(
				{
					title:'编辑',
					render: (text, record) => (
						<div
							style={{color:'#1890ff',cursor:'pointer'}}
							onClick={() =>{
								let This = this;
								confirm({
									title: '确定要将'+record.name+'踢出班级么',
									onOk() {
										This.props.dispatch({
											type: 'homePage/kickClass',
											payload:{
												userId:record.key,
											}
										});
									},
									onCancel() {
										console.log('Cancel');
									},
								});
							}}>
							踢出班级
						</div>
					)
				}
			)
		}
	}
	
	isEditing = record => record.key === this.state.editingKey;

	cancel = () => {
	this.setState({ editingKey: '' });
	};
	
	save(form, key) {
	form.validateFields((error, row) => {
		console.log(row)
		message.warning('修改功能暂未开放');
		this.setState({ editingKey: '' });
	});
	}

	edit(key) {
	this.setState({ editingKey: key });
	}
	
	render() {
		let state = this.props.state;
		let rodeType = store.get('wrongBookNews').rodeType;
		let pageHomeworkDetiles = state.tealist;
		let dataSource = [];
		if(pageHomeworkDetiles.data){
			for(let i = 0;i < pageHomeworkDetiles.data.length; i ++){
				let p = {};
				let det = pageHomeworkDetiles.data[i];
				if(state.showMen != '') {
					if(det.userName.indexOf(state.showMen)>=0) {
						p["key"] = det.userId;
						p["head"] = det.avatarUrl ? det.avatarUrl:'http://images.mizholdings.com/face/default/02.gif'
						p["name"] = det.userName;
						p['phone'] = det.phone
						p['OnwerTeacher'] = det.admin ===1 ?'是':''
						dataSource[i]=p;
					}
				}else{
					p["key"] = det.userId;
					p["head"] = det.avatarUrl ? det.avatarUrl:'http://images.mizholdings.com/face/default/02.gif'
					p["name"] = det.userName;
					p['phone'] = det.phone
					p['OnwerTeacher'] = det.admin ===1 ?'是':''
					dataSource[i]=p;
				}
			}
		}
		
		const components = {
			body: {
			  row: EditableFormRow,
			  cell: EditableCell,
			},
			};
			
			
		  let col = this.state.current === 'teacher' ?this.tea:this.stu
		  const columns = col.map((col) => {
			if (!col.editable) {
			  return col;
			}
			return {
			  ...col,
			  onCell: record => ({
				record,
				inputType: 'text',
				dataIndex: col.dataIndex,
				title: col.title,
				editing: this.isEditing(record),
			  }),
			};
			});
			let sublist = this.props.state.sublist;
			const children = [];
			if(sublist.data){
				for (let i = 0; i < sublist.data.length; i++) {
					let data = sublist.data[i]
					children.push(<Option key={data.k}>{data.v}</Option>);
				}
			}
		return(
			<Layout>
				<Content style={{ overflow: 'initial' }}>
					<div className={style.gradeboder} >
						<Menu
							className={style.menu}
							onClick={(e)=>{
								this.setState({current:e.key})
								
								this.props.dispatch({
									type: 'homePage/showMen',
									payload:''
								});
								this.props.dispatch({
									type: 'homePage/tealist',
									payload:[]
								});
								if(e.key === 'teacher'){
									this.props.dispatch({
										type: 'homePage/memType',
										payload:{
											type:1
										}
									});
									this.props.dispatch({
										type: 'homePage/teacherList',
										payload:{
											type:1
										}
									});
									
								}else {
									this.props.dispatch({
										type: 'homePage/memType',
										payload:{
											type:3
										}
									});
									this.props.dispatch({
										type: 'homePage/teacherList',
										payload:{
											type:3
										}
									});
								}
								
							}}
							selectedKeys={[this.state.current]}
							mode="horizontal"
						>
							<Menu.Item key="teacher" style={{width:'120px',textAlign:'center'}}>
							教师
							</Menu.Item>
							<Menu.Item key="student" style={{width:'120px',textAlign:'center'}} >
							学生
							</Menu.Item>
						</Menu>
						<div style={{overflow:'hidden',marginBottom:"5px",textAlign:'left ',padding:'10px'}}>
							<Search
								// value={this.props.state.showMen}
								placeholder="姓名"
								style={{width:'300px',marginRight:'10px'}}
								enterButton="搜索"
								onSearch={value => {
									this.props.dispatch({
										type: 'homePage/showMen',
										payload:value
									});
								}}
							/>
							{
								rodeType <= 20 && this.state.current === 'teacher' ?
								<span className={style.addGrade} onClick={()=>{
										this.setState({visible:true})
										// Modal.warning({
										// 	title: '添加教师功能暂未开放',
										// });
								}}>添加</span>:''
							}
						</div>
						<div className={style.table}>
							<Table 
								className={style.scoreDetTable}
								dataSource={dataSource}
								columns={columns}
								pagination={true}
								bordered={true}
								components={components}
								rowClassName="editable-row"
							/>
						</div>
					</div>
				</Content>
				<Modal
						title="添加教师"
						visible={this.state.visible}
						onOk={()=>{
							this.setState({
								visible: false,
							});
							let hash = this.props.location.hash
							
							let data={
								name:this.state.teacher,
								phone:this.state.phone,
								classId:hash.substr(hash.indexOf("&id=")+4),
								subjectId:this.state.sub
							}
							
							this.props.dispatch({
								type: 'homePage/createSchoolUser',
								payload:data
							});
							this.setState({teacher:'',phone:''})
						}}
						onCancel={()=>{
							this.setState({
								visible: false,
							});
						}}
						okText='确定'
						cancelText='取消'
						>
							<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>教师名称</span>
									<Input 
										value={this.state.teacher}
										onChange={(e)=>{
											this.setState({teacher:e.target.value})
										}}  style={{width:'200px'}}/>
								</div>
								
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>手机号</span>
									<Input
										value={this.state.phone}
										onChange={(e)=>{
											this.setState({phone:e.target.value})
										}}  style={{width:'200px'}}/>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>学科</span>
										<Select
											showSearch
											style={{ width: 200 }}
											optionFilterProp="children"
											onChange={(value)=>{
												this.setState({sub:value})
											}}
											// defaultValue={classInfo.data.classAdmin}
											filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
										>
											{children}
										</Select>
									
								</div>
					</Modal>
			</Layout>
		);
	}
	componentDidMount(){
		
	}
}

export default connect((state) => ({
	state: {
		...state.homePage
	}
}))(HomeworkCenter);